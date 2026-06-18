import { z } from "zod";

import { ingestKnowledgeDocument } from "@/lib/knowledge/persistence";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  content: z.string().min(1, "Content is required."),
  name: z.string().min(1, "Document name is required."),
});

export async function POST(request: Request) {
  const parsedRequest = requestSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: parsedRequest.error.issues[0]?.message ?? "Invalid request.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await ingestKnowledgeDocument(parsedRequest.data);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to ingest document.",
      },
      {
        status: 500,
      },
    );
  }
}
