const maxChunkLength = 700;
const minChunkLength = 120;

export function chunkText(content: string) {
  const normalizedContent = content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalizedContent) {
    return [];
  }

  const paragraphs = normalizedContent.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const normalizedParagraph = paragraph.replace(/\s+/g, " ").trim();

    if (!normalizedParagraph) {
      continue;
    }

    if (!currentChunk) {
      currentChunk = normalizedParagraph;
      continue;
    }

    const nextChunk = `${currentChunk}\n\n${normalizedParagraph}`;

    if (nextChunk.length > maxChunkLength && currentChunk.length >= minChunkLength) {
      chunks.push(currentChunk);
      currentChunk = normalizedParagraph;
    } else {
      currentChunk = nextChunk;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.flatMap((chunk) => splitLongChunk(chunk));
}

function splitLongChunk(chunk: string) {
  if (chunk.length <= maxChunkLength) {
    return [chunk];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < chunk.length) {
    const end = Math.min(start + maxChunkLength, chunk.length);
    chunks.push(chunk.slice(start, end).trim());
    start = end;
  }

  return chunks.filter(Boolean);
}
