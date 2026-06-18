# ArkClaw Agent Studio Project Plan

## 1. Project Positioning

ArkClaw Agent Studio is a web-based platform for building, running, observing, and debugging AI Agents.

The project is designed to match an Agent application development role. It should demonstrate not only frontend UI ability, but also understanding of Agent architecture, task planning, tool calls, knowledge retrieval, memory, Skills, runtime observability, failure handling, and product delivery.

The core positioning:

> A visual Agent workflow platform that makes Agent behavior configurable, observable, debuggable, and reusable.

## 2. Target Role Alignment

The job description focuses on:

- Agent application architecture and core feature development
- Large model adaptation
- Memory, knowledge base, and Skills integration
- Task planning, logical reasoning, and decision execution
- Performance optimization and stability
- Error tolerance and recovery
- Collaboration with product and algorithm teams
- Engineering delivery from requirements to launch

This project should map to those requirements through a complete product loop:

1. Configure an Agent.
2. Attach knowledge and tools.
3. Run a user task.
4. Observe planning, retrieval, tool calls, and execution steps.
5. Handle failures, retry, and resume.
6. Generate and persist the final result.

## 3. MVP Scope

The MVP should avoid becoming a broad demo. It should focus on one complete, polished workflow:

> Upload knowledge materials, create an Agent with retrieval and tools, run a task, observe each execution step in real time, and generate a final report.

### 3.1 Agent Builder

Purpose: visually configure Agent behavior.

Core features:

- Create and edit Agent profiles.
- Configure model provider, system prompt, available Skills, and knowledge base.
- Use a node-based workflow canvas for advanced mode.
- Support common node types:
  - User input
  - LLM
  - Knowledge retrieval
  - Skill call
  - Conditional branch
  - Final response

MVP requirement:

- The first version can support a constrained workflow template instead of a fully general workflow engine.
- The UI should still expose the execution structure clearly.

### 3.2 Run Console

Purpose: make Agent execution observable and debuggable.

Core features:

- Submit a task to an Agent.
- Stream execution status in real time.
- Display planning steps, retrieval results, tool calls, intermediate outputs, errors, retries, and final answer.
- Allow rerunning failed steps where technically feasible.
- Show token usage, duration, and status for each step.

MVP requirement:

- Use a timeline view plus detail panel.
- Keep the execution trace persistent so it can be reviewed after completion.

### 3.3 Knowledge Base

Purpose: demonstrate retrieval-augmented Agent behavior.

Core features:

- Upload Markdown, TXT, and PDF files.
- Chunk documents.
- Generate embeddings.
- Store chunks in a vector database.
- Test retrieval manually.
- During Agent runs, show matched chunks with source, score, and content preview.

MVP requirement:

- Support Markdown/TXT first.
- PDF can be added after the core loop is working.

### 3.4 Skills Center

Purpose: demonstrate pluggable tool capability.

Core features:

- Register Skills.
- Enable or disable Skills per Agent.
- Test a Skill independently.
- Show input schema, output schema, execution result, and errors.

Initial Skills:

- Web page fetch and summarize
- HTTP API request
- Document summary
- Structured report generator

MVP requirement:

- Define a simple Skill protocol and implement 2 real Skills.

### 3.5 History and Templates

Purpose: make the project feel productized instead of demo-only.

Core features:

- Store Agent run history.
- Save execution traces.
- Reopen past results.
- Provide several Agent templates.

Initial templates:

- Research report Agent
- Knowledge Q&A Agent
- Competitor analysis Agent

## 4. Architecture Modules

### 4.1 Frontend

Responsibilities:

- Agent configuration UI
- Workflow canvas
- Knowledge base management
- Skill management
- Real-time run console
- Execution trace visualization
- Run history and templates

Important frontend concerns:

- Long-running task state management
- Streaming UI updates
- Large execution trace rendering
- Optimistic UI for configuration changes
- Error and retry interaction design
- Clear visualization of Agent internals

### 4.2 Backend API

Responsibilities:

- Agent CRUD
- Knowledge base CRUD
- File ingestion
- Embedding and retrieval
- Run creation and orchestration
- Skill registration and execution
- Streaming execution events to frontend
- Persisting run traces

### 4.3 Agent Runtime

Responsibilities:

- Convert a user task into executable steps.
- Select retrieval and Skills.
- Execute steps with status tracking.
- Emit structured runtime events.
- Handle timeout, retry, cancellation, and failure states.
- Persist trace data.

The Agent runtime does not need to be overly complex in the MVP. A small state-machine-based executor is enough if the event model is clean.

### 4.4 Knowledge Pipeline

Responsibilities:

- Parse uploaded files.
- Split text into chunks.
- Generate embeddings.
- Store document chunks.
- Retrieve relevant chunks for a query.
- Return explainable retrieval results.

### 4.5 Skill Runtime

Responsibilities:

- Define a Skill manifest.
- Validate input schema.
- Execute Skill handler.
- Return structured output.
- Track execution duration and errors.

Example Skill manifest:

```ts
type SkillManifest = {
  name: string;
  description: string;
  inputSchema: unknown;
  outputSchema: unknown;
  timeoutMs: number;
};
```

## 5. Technical Stack Decision

### 5.1 Recommended Stack

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Flow
- Zustand
- TanStack Query

Backend:

- Next.js Route Handlers for MVP API
- Node.js runtime
- PostgreSQL
- Prisma
- pgvector
- Redis
- BullMQ

AI and Agent:

- OpenAI-compatible model provider abstraction
- LangGraph-inspired internal state machine for MVP
- Later optional integration with LangGraph.js
- Vercel AI SDK for model streaming where useful

Realtime:

- Server-Sent Events for Agent run streaming
- WebSocket only if bidirectional runtime control becomes necessary

Document ingestion:

- Plain text and Markdown parser first
- PDF parser in phase 2

Deployment:

- Docker Compose for local PostgreSQL, Redis, and app services
- Vercel or self-hosted Node deployment later

### 5.2 Why This Stack

Next.js keeps frontend and backend iteration fast for an MVP. Since the project is meant to show frontend strength with full-stack Agent understanding, a single TypeScript codebase reduces overhead and makes the architecture easier to explain.

React Flow is the right fit for Agent workflow visualization. It gives the project a strong visual interface and helps differentiate it from ordinary chat applications.

PostgreSQL plus pgvector is pragmatic for a portfolio project because relational data, run traces, documents, chunks, and vector search can live in one database.

SSE is simpler than WebSocket for one-way streaming execution events. Most Agent runs only need backend-to-frontend updates, so SSE should be the default.

BullMQ and Redis are useful once Agent runs become long-running or concurrent. They can be introduced after the basic synchronous executor is working.

### 5.3 Alternatives Considered

Python FastAPI backend:

- Stronger ecosystem for AI and document processing.
- Good if the project later emphasizes backend AI engineering.
- Higher integration cost for a frontend-led portfolio if maintained as a separate service.

LangGraph from day one:

- Powerful and credible for Agent workflows.
- Can introduce complexity before the product loop is clear.
- Better as a phase 2 replacement or enhancement after the internal event model is stable.

Qdrant:

- Strong dedicated vector database.
- More infrastructure to run and explain.
- PostgreSQL plus pgvector is enough for MVP.

WebSocket:

- Useful for interactive runtime controls.
- More lifecycle complexity.
- SSE is enough for streaming execution traces in MVP.

## 6. Milestones

### Milestone 1: Product Skeleton

- Create Next.js app.
- Set up layout, navigation, and base UI system.
- Add placeholder pages:
  - Agent Builder
  - Run Console
  - Knowledge Base
  - Skills Center
  - Run History

Definition of done:

- The product structure is navigable and visually coherent.

### Milestone 2: Agent Run Trace MVP

- Implement task submission.
- Implement a simple backend executor.
- Stream runtime events through SSE.
- Render execution timeline in Run Console.
- Persist run records.

Definition of done:

- A user can run a task and watch structured execution events appear in real time.

### Milestone 3: Knowledge Base MVP

- Upload Markdown/TXT.
- Chunk and store documents.
- Add retrieval endpoint.
- Show retrieval test UI.
- Connect retrieval to Agent run.

Definition of done:

- Agent execution can retrieve knowledge and show cited chunks in the run trace.

### Milestone 4: Skills MVP

- Define Skill manifest and execution contract.
- Implement two Skills.
- Build Skills Center.
- Allow Agents to enable selected Skills.
- Show Skill calls in the run trace.

Definition of done:

- Agent execution can call at least one real Skill and expose its input/output.

### Milestone 5: Workflow Builder

- Add React Flow canvas.
- Render Agent workflow nodes.
- Support editing a constrained workflow template.
- Connect Builder configuration to runtime.

Definition of done:

- A user can visually understand and modify the Agent execution structure.

### Milestone 6: Polish and Interview Readiness

- Add run history.
- Add templates.
- Improve error, retry, and cancellation states.
- Add seed demo data.
- Write README and architecture notes.
- Record a short demo script.

Definition of done:

- The project can be shown in an interview with a clear story and live demo.

## 7. Interview Story

The project should be presented as:

> I built a frontend-led Agent application platform, but the core value is not a chat UI. The system makes Agent execution observable and configurable. It supports knowledge retrieval, pluggable Skills, task execution traces, streaming runtime updates, and failure states. This helped me understand Agent applications as production systems rather than simple model API wrappers.

Key points to explain:

- Agent runtime state model
- SSE event stream design
- Knowledge retrieval explainability
- Skill protocol design
- Workflow visualization
- Long-running task UX
- Error handling and retry
- Frontend performance for large traces

## 8. Initial Development Principle

Build the smallest complete loop first:

1. Create an Agent.
2. Upload a small knowledge document.
3. Ask the Agent to generate a report.
4. Show planning, retrieval, Skill call, and final output in the run console.
5. Persist the run trace.

After this loop works, expand breadth.
