export type KnowledgeDocumentSummary = {
  id: string;
  name: string;
  chunkCount: number;
  createdAt: string;
};

export type RetrievalResult = {
  id: string;
  documentName: string;
  index: number;
  content: string;
  score: number;
};
