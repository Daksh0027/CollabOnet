# CollaboNet — Technology Stack Specification

> **System**: Trust & Management Operating System for Social Media Agencies, Creators, and Brand Sponsors  
> **Document Purpose**: Core Technology Stack, Framework Selections, and Architectural Rationale  
> **Status**: Approved Specification  

---

## 1. Technology Architecture Summary

| Layer | Selection | Version / Tooling | Architectural Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | `15.x` with **React 19** | Modern React Server Components (RSC), Turbopack bundler, optimistic UI updates, and server-side rendering for public registries. |
| **Language** | **TypeScript** | `5.6+` | Strict type safety end-to-end (API contracts, MongoDB documents, component props). |
| **Database** | **MongoDB** | `7.x+` (via Mongoose / Native Driver) | Native JSON document model; seamlessly models nested campaign deliverables, conversational message threads, RBAC roles, and dynamic contract terms. |
| **Styling & UI System** | **Tailwind CSS + Lucide Icons** | `3.4+` / Lucide `0.470+` | Minimalist Linear-grade dark theme (`#0c0d0e`, `#121316`, subtle 1px border `#222326`, high-contrast typography). |
| **Component Primitives** | **Radix UI Primitives** | Headless UI | Accessible, unstyled primitives (Dialogs, Popovers, Tabs, Dropdowns, Sliding Sheets). |
| **Motion** | **Framer Motion** | `11.x` | Smooth sidebar transitions, slide-over copilot drawer, and animated status pills. |
| **API Layer** | **Next.js Route Handlers (`/api/v1/*`)** | Node.js Runtime | RESTful JSON endpoints with RBAC middleware token validation. |
| **Real-Time Chat Engine** | **WebSockets / Server-Sent Events (SSE)** | Native Web Standards / Socket.IO | Real-time bi-directional chat, typing indicators, read receipts, and live collision radar alerts. |
| **AI Orchestration** | **OpenRouter API** | OpenRouter Client SDK / REST | Unified gateway to state-of-the-art models (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Flash/Pro) for chat summarization, contract extraction, and NL search parsing, backed by offline deterministic fallback handlers. |
| **Digital E-Signing** | **PDF-Lib & Web Crypto (SHA-256)** | HTML5 Canvas + Hasher | In-browser contract PDF compilation, dual-party digital canvas signatures, and cryptographic SHA-256 integrity hashing. |
| **Verification & Liveness** | **Browser `MediaRecorder` API** | WebRTC Video + Audio | Native browser webcam capture for dynamic 6-word session nonce phrases. |

---

## 2. Key Technology Choices & Rationale

### 2.1 Next.js 15 + React 19 vs. Legacy Frameworks
- **Turbopack Compiler**: Lightning-fast hot reload and builds for developer productivity.
- **Async Server Functions**: Native Server Actions and Promises for cookies and headers simplify secure auth session management.
- **Optimistic Chat UI**: React 19 `useOptimistic` hook enables instant chat message rendering before server round-trips.

### 2.2 MongoDB vs. Relational Database
- **Document Flexibility for Real-Time Chat & Deals**: Conversations contain rich nested message histories, attachments, system events (counter-offers, signatures), and deliverable checklists. In MongoDB, an entire deal room can be indexed and queried as a unified aggregate.
- **Dynamic Campaign & Contract Schemas**: Different creator niches (YouTube long-form vs. Instagram Reels vs. TikTok) demand varied deliverable milestones and terms. MongoDB’s schema flexibility avoids costly schema migrations.
- **Fast Development & Scalability**: Runs easily locally (via MongoDB Atlas or local daemon / `mongodb-memory-server`) with zero friction.

### 2.3 OpenRouter API for Universal AI Access
- **Single Unified Gateway**: OpenRouter provides a single unified API to switch between top-tier models (e.g. Claude 3.5 Sonnet for contract parsing, Gemini/GPT-4o for rapid chat summarization) using standard OpenAI-compatible endpoints.
- **Cost & Redundancy Optimization**: Automatic fallbacks and routing ensure that AI deal assistants remain functional even if a specific vendor experiences downtime or rate limits.
- **Built-in Offline Fallback**: Deterministic regex and rule-based heuristic parsers run locally if network or API keys are unavailable.

### 2.4 Linear-Grade Minimalist UI System
- Modeled directly after Linear’s productivity suite:
  - Deep matte carbon palette (`#0c0d0e` canvas, `#121316` cards, `#222326` borders).
  - Monospace badges (`font-mono text-xs`) for deal identifiers (`COL-8852`), timestamps, and SHA-256 hashes.
  - Slide-over AI copilot drawer on the right side of the chat deal room.
