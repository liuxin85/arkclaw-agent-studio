import type { Prisma } from "@prisma/client";

import { chunkText } from "@/lib/knowledge/chunk-text";
import type { KnowledgeDocumentSummary, RetrievalResult } from "@/lib/knowledge/types";
import { prisma } from "@/lib/prisma";

const defaultKnowledgeBaseName = "Default Knowledge Base";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function ensureDefaultKnowledgeBase() {
  const existingKnowledgeBase = await prisma.knowledgeBase.findFirst({
    where: {
      name: defaultKnowledgeBaseName,
    },
  });

  if (existingKnowledgeBase) {
    return existingKnowledgeBase;
  }

  return prisma.knowledgeBase.create({
    data: {
      description: "Default workspace knowledge base for local Agent runs.",
      name: defaultKnowledgeBaseName,
    },
  });
}

export async function ingestKnowledgeDocument({
  content,
  name,
}: {
  content: string;
  name: string;
}) {
  const knowledgeBase = await ensureDefaultKnowledgeBase();
  const chunks = chunkText(content);

  if (chunks.length === 0) {
    throw new Error("Document content is empty after normalization.");
  }

  const document = await prisma.knowledgeDocument.create({
    data: {
      chunks: {
        create: chunks.map((chunk, index) => ({
          content: chunk,
          index,
          metadata: {
            characterCount: chunk.length,
          } satisfies Prisma.InputJsonValue,
        })),
      },
      content,
      knowledgeBaseId: knowledgeBase.id,
      mimeType: inferMimeType(name),
      name,
    },
    include: {
      chunks: true,
    },
  });

  return {
    chunkCount: document.chunks.length,
    documentId: document.id,
  };
}

export async function listKnowledgeDocuments(): Promise<KnowledgeDocumentSummary[]> {
  try {
    const documents = await prisma.knowledgeDocument.findMany({
      include: {
        _count: {
          select: {
            chunks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return documents.map((document) => ({
      chunkCount: document._count.chunks,
      createdAt: formatDate(document.createdAt),
      id: document.id,
      name: document.name,
    }));
  } catch {
    return [];
  }
}

export async function searchKnowledge(query: string): Promise<RetrievalResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const terms = tokenize(normalizedQuery);
  const chunks = await prisma.documentChunk.findMany({
    include: {
      document: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 200,
  });

  return chunks
    .map((chunk) => ({
      content: chunk.content,
      documentName: chunk.document.name,
      id: chunk.id,
      index: chunk.index,
      score: scoreChunk(terms, chunk.content),
    }))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 6);
}

function inferMimeType(name: string) {
  if (name.toLowerCase().endsWith(".md")) {
    return "text/markdown";
  }

  return "text/plain";
}

function tokenize(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9\u4e00-\u9fa5]+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2),
    ),
  );
}

function scoreChunk(terms: string[], content: string) {
  if (terms.length === 0) {
    return 0;
  }

  const normalizedContent = content.toLowerCase();
  const matchedTerms = terms.filter((term) => normalizedContent.includes(term));

  return matchedTerms.length / terms.length;
}
