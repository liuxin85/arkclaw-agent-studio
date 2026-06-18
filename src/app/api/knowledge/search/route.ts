import { z } from "zod";

import { searchKnowledge } from "@/lib/knowledge/persistence";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  query: z.string().min(1, "Query is required."),
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
    const results = await searchKnowledge(parsedRequest.data.query);

    return Response.json({
      results,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to search knowledge.",
      },
      {
        status: 500,
      },
    );
  }
}
