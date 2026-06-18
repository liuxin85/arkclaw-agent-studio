"use client";

import "@xyflow/react/dist/style.css";

import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";

const nodes: Node[] = [
  {
    id: "input",
    position: { x: 0, y: 120 },
    data: { label: "User task" },
    type: "input",
  },
  {
    id: "plan",
    position: { x: 220, y: 60 },
    data: { label: "Plan steps" },
  },
  {
    id: "retrieve",
    position: { x: 440, y: 0 },
    data: { label: "Retrieve knowledge" },
  },
  {
    id: "skill",
    position: { x: 440, y: 140 },
    data: { label: "Call Skill" },
  },
  {
    id: "report",
    position: { x: 680, y: 80 },
    data: { label: "Generate report" },
    type: "output",
  },
];

const edges: Edge[] = [
  { id: "input-plan", source: "input", target: "plan" },
  { id: "plan-retrieve", source: "plan", target: "retrieve" },
  { id: "plan-skill", source: "plan", target: "skill" },
  { id: "retrieve-report", source: "retrieve", target: "report" },
  { id: "skill-report", source: "skill", target: "report" },
];

export function WorkflowPreview() {
  return (
    <ReactFlow
      fitView
      edges={edges}
      nodes={nodes}
      nodesDraggable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background />
      <Controls showInteractive={false} />
      <MiniMap pannable={false} zoomable={false} />
    </ReactFlow>
  );
}
