# Implementation Plan: CollaboNet

## Overview
CollaboNet is an AI-powered operating system and transaction infrastructure for creators, agencies, and multi-branch brand enterprises. This plan implements the full architecture specified in `DESIGN_DOC.md`: Next.js 14+ App Router full-stack web application, hybrid semantic + structured AI search with dynamic animated chips, role-isolated chat deal rooms, role-aware AI thread summarization with PII masking, "Chat-to-Contract" instant drafting, cryptographic e-signing with milestone escrow, 2-phase HITL verification with Whisper ASR audio nonce matching, enterprise multi-branch governance with zero-knowledge collision radar, deliverables calendar, peer barter collab generator, and the public Hall of Shame transparency ledger.

## Architecture Decisions
- **Full-Stack Next.js 14+ App Router**: High performance, unified TypeScript API routes (`/api/v1/...`) and modern client UI routes.
- **Database & Data Layer**: PostgreSQL 16 DDL with `pgvector` & Row-Level Security (RLS) provided in migrations/DDL script (`scripts/init-db.sql`). In addition, an in-memory & SQLite-compatible local storage adapter with rich seed data ensures that the full application runs out-of-the-box locally and in containerized Postgres environments with zero friction.
- **AI Orchestration**: Structured AI parsing engine with Gemini / OpenAI API integration and high-fidelity deterministic fallback mockers for offline evaluation.
- **Role Isolation & RLS Security**: Enforced in API middleware and database query filters so Sales Reps cannot snoop on peer deals, and Talent Managers receive PII-sanitized brand POI summaries.
- **Motion & UI Polish**: Tailwind CSS, Lucide icons, Framer Motion animations for chip popping, modals, and deal transitions.

## Task List

### Phase 1: Foundation & Project Scaffolding
- [ ] Task 1.1: Initialize Next.js 14+ App Router project with TypeScript, Tailwind CSS, Lucide icons, and core dependencies.
- [ ] Task 1.2: Build core UI component library (Button, Badge, Card, Input, Modal/Dialog, Tabs, Alert, Avatar, Tooltip).
- [ ] Task 1.3: Setup Global Layout, App Header with Persona Role Switcher (`CREATOR`, `SALES_REPRESENTATIVE_A`, `SALES_REPRESENTATIVE_B`, `TALENT_MANAGER`, `COMPANY_HEAD_ADMIN`, `PLATFORM_ADMIN`), and navigation bar.

### Checkpoint: Foundation
- [ ] App builds clean, responsive layout works, role switcher toggles user persona with active role badge.

### Phase 2: Data Models, Seed Data & Enterprise Hierarchy
- [ ] Task 2.1: Implement PostgreSQL 16 DDL script with `pgvector` and RLS policies (`scripts/init-db.sql`).
- [ ] Task 2.2: Implement Type Definitions and Data Store Service Layer (Users, Organizations, Branches, Creators, Campaigns, Conversations, Messages, Contracts, Milestones, Radar, Hall of Shame).
- [ ] Task 2.3: Generate realistic curated seed data (30+ verified creators across Tech, Fintech, Lifestyle, Gaming; Enterprise Org with NA/APAC/EMEA branches; active campaigns and historical deals).

### Checkpoint: Data Layer
- [ ] Seed data queries return correctly, types are strictly verified, multi-branch and creator rosters load reliably.

### Phase 3: AI-Powered Marketplace & Natural Language Search
- [ ] Task 3.1: Implement Hybrid Semantic + Structured Search API (`POST /api/v1/marketplace/ai-search` and `GET /api/v1/creators`) with query parsing and vibe match scoring.
- [ ] Task 3.2: Build `/feed` Marketplace UI featuring the animated Natural Language Search Bar with popping filter badges.
- [ ] Task 3.3: Implement Creator Profile Drawer / Page with Zero-Knowledge Internal Collision Banner and Rival Exclusivity Alert.

### Checkpoint: Search & Discovery
- [ ] Natural language search parses queries (e.g. "Find Indian fintech creators under $2,000") and renders animated filter chips with ranked results and collision notices.

### Phase 4: Isolated Negotiation Chat & AI Deal Copilots
- [ ] Task 4.1: Implement Chat API (`GET/POST /api/v1/conversations`, `/messages`) with strict Rep ownership security (403 for peer reps).
- [ ] Task 4.2: Implement In-Chat AI Thread Summarizer (`POST /api/v1/conversations/:id/ai-summarize`) with role-aware privacy masking (Manager sees masked POI; Rep sees full context).
- [ ] Task 4.3: Implement "Chat-to-Contract" Extractor (`POST /api/v1/conversations/:id/ai-extract`) and AI Suggestion Copilots (Personalized Outreach Pitch & Smart Counter-Offer).
- [ ] Task 4.4: Build `/messages` Deal Room UI with message stream, quick copilots, "✨ Summarize Thread", and "✨ Extract to Contract" drawer.

### Checkpoint: Negotiation & Isolation
- [ ] Sales Rep A can chat and summarize; Sales Rep B gets access denied (403); Talent Manager receives PII-sanitized summary; Contract terms extract in one click.

### Phase 5: Legal Contracts, Cryptographic Signing & Milestone Escrow
- [ ] Task 5.1: Implement Contract & Milestone APIs (`POST /api/v1/contracts/generate`, `POST /api/v1/contracts/:id/sign`, `/submit-proof`, `/approve`).
- [ ] Task 5.2: Build `/deals/[id]` Deal Room UI with PDF-style contract preview, SHA-256 signature hash canvas, and milestone submission/approval pipeline.

### Checkpoint: Deal Execution
- [ ] Pre-filled contract generated from chat, both parties can sign with cryptographic audit stamp, milestones track from submission to payment release.

### Phase 6: Two-Phase Verification & Whisper ASR Audio Nonce Check
- [ ] Task 6.1: Implement Verification APIs (`POST /api/v1/verification/phase-1/init`, `/submit`, `/admin/verification/queue`, `/decision`).
- [ ] Task 6.2: Build `/onboarding/verify` multi-step interactive verification wizard with dynamic 6-word session nonce recorder and simulated/real Whisper ASR audio match.
- [ ] Task 6.3: Build HITL Platform Auditor Verification Queue for pending Phase-2 reviews.

### Checkpoint: Verification Moat
- [ ] User generates nonce, records audio/video, Whisper ASR verifies match with green badge, Admin reviews and activates account.

### Phase 7: Enterprise Governance, Calendar, Collab & Hall of Shame
- [ ] Task 7.1: Build `/enterprise/dashboard` for Company Head Account (branch switcher, budget allocation, Zero-Downtime Deal Reassignment with AI Handover Brief, Rival Radar).
- [ ] Task 7.2: Build `/calendar` Unified Deliverable & Event Scheduler.
- [ ] Task 7.3: Build `/collab` Peer Barter Concept Generator for creators.
- [ ] Task 7.4: Build `/hall-of-shame` Public Transparency Ledger with AI Dispute Timeline.

### Checkpoint: Complete Application
- [ ] All 9 routes operational, tests pass, end-to-end workflows validated, ready for production and hackathon demonstration.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Peer rep chat leakage | High (Breaches core enterprise moat) | Enforce at API middleware + database RLS query level with explicit user ID validation. |
| Talent Manager POI exposure | High (Privacy violation) | Pass conversation through RBAC Sanitization pipeline before AI summarization. |
| External AI API latency or missing keys | Medium | Implement robust local AI fallback parser with rule-based regex and heuristic embeddings when API key is unconfigured. |
| Large bundle / build complexity | Low | Use Next.js 14 App Router with standalone output and lightweight dependencies. |
