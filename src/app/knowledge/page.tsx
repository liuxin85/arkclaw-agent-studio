import { AppShell } from "@/components/app-shell";
import { listKnowledgeDocuments } from "@/lib/knowledge/persistence";

import { KnowledgeWorkspace } from "./knowledge-workspace";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const documents = await listKnowledgeDocuments();

  return (
    <AppShell>
      <KnowledgeWorkspace documents={documents} />
    </AppShell>
  );
}
