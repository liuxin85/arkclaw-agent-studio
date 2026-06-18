import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
});
