"use client";

import { Database, FileText, Loader2, Search, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { StatusBadge } from "@/components/status-badge";
import type { KnowledgeDocumentSummary, RetrievalResult } from "@/lib/knowledge/types";

const defaultContent = `# Agent observability notes

Agent products need visible execution traces. Users should see planning, retrieval, tool calls, failures, retries, and final answers as separate runtime events.

Knowledge retrieval should show matched chunks, source documents, and confidence scores so the user can verify why the Agent used a piece of evidence.

Skills should expose their input, output, latency, and errors. This makes Agent behavior easier to debug and improves trust.`;

export function KnowledgeWorkspace({
  documents,
}: Readonly<{
  documents: KnowledgeDocumentSummary[];
}>) {
  const router = useRouter();
  const [name, setName] = useState("agent-observability-notes.md");
  const [content, setContent] = useState(defaultContent);
  const [query, setQuery] = useState("How should an Agent show retrieval evidence?");
  const [results, setResults] = useState<RetrievalResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function uploadDocument() {
    setIsUploading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/knowledge/documents", {
        body: JSON.stringify({
          content,
          name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string; chunkCount?: number };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to upload document.");
      }

      setMessage(`Document ingested with ${payload.chunkCount ?? 0} chunks.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  }

  async function searchKnowledge() {
    setIsSearching(true);
    setMessage(null);

    try {
      const response = await fetch("/api/knowledge/search", {
        body: JSON.stringify({
          query,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as {
        error?: string;
        results?: RetrievalResult[];
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to search knowledge.");
      }

      setResults(payload.results ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to search knowledge.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-violet-50 text-violet-700">
            <Database size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Knowledge Base</p>
            <h1 className="text-xl font-semibold text-slate-950">Upload sources</h1>
          </div>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Document name</span>
          <input
            className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-cyan-500 focus:ring-2"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Markdown / TXT content</span>
          <textarea
            className="mt-2 min-h-64 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-cyan-500 focus:ring-2"
            onChange={(event) => setContent(event.target.value)}
            value={content}
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isUploading}
            onClick={uploadDocument}
          >
            {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Ingest document
          </button>
          <div className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
            <FileText size={16} />
            Markdown and TXT first
          </div>
        </div>

        {message ? (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {message}
          </div>
        ) : null}
      </section>

      <section className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Retrieval test</p>
              <h2 className="text-lg font-semibold text-slate-950">Explainable matched chunks</h2>
            </div>
            <Search className="text-slate-400" size={20} />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="h-10 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-cyan-500 focus:ring-2"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
            />
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSearching}
              onClick={searchKnowledge}
            >
              {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              Search
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {results.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-700">No retrieval results yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Ingest a document, then search for a topic to inspect matched chunks.
                </p>
              </div>
            ) : (
              results.map((result) => (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4" key={result.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {result.documentName} · Chunk {result.index + 1}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-slate-400">{result.id}</p>
                    </div>
                    <StatusBadge tone={result.score > 0 ? "success" : "neutral"}>
                      score {result.score.toFixed(2)}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{result.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Stored documents</p>
              <h2 className="text-lg font-semibold text-slate-950">Current knowledge base</h2>
            </div>
            <StatusBadge tone="info">{documents.length} docs</StatusBadge>
          </div>
          {documents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">No documents yet</p>
              <p className="mt-2 text-sm text-slate-500">Upload the sample notes to create chunks.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
              {documents.map((document) => (
                <div className="grid gap-2 p-4 md:grid-cols-[1fr_100px_160px]" key={document.id}>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{document.name}</p>
                    <p className="mt-1 font-mono text-xs text-slate-400">{document.id}</p>
                  </div>
                  <p className="text-sm text-slate-500">{document.chunkCount} chunks</p>
                  <p className="text-sm text-slate-500">{document.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
