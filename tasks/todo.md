# CollaboNet Implementation Task List

## Phase 1: Foundation & Project Scaffolding
- [x] Task 1.1: Project Setup & Package Configuration
  - **Acceptance Criteria**: Next.js 14+ App Router initialized with TypeScript, Tailwind CSS, Lucide icons, clsx, tailwind-merge; builds without errors.
  - **Verification**: `npm run build` succeeds.
- [x] Task 1.2: Base UI Component Library
  - **Acceptance Criteria**: Reusable components created (Button, Badge, Card, Input, Modal, Tabs, Alert, Avatar, Tooltip).
  - **Verification**: Components importable and render cleanly.
- [x] Task 1.3: Navigation & Multi-Persona Role Switcher
  - **Acceptance Criteria**: App Header with Persona Switcher (`Creator`, `Sales Rep A`, `Sales Rep B`, `Talent Manager`, `Company Head Admin`, `Platform Admin`), breadcrumb/links to all 9 core routes.
  - **Verification**: Toggling persona updates global context and shows current persona badge.

## Checkpoint 1: Foundation
- [x] Next.js app builds cleanly (`npm run build`)
- [x] App header and persona switcher functioning across all views

## Phase 2: Data Models, Seed Data & Enterprise Hierarchy
- [x] Task 2.1: PostgreSQL 16 DDL & RLS Schema Script
  - **Acceptance Criteria**: `scripts/init-db.sql` created containing all 16 tables, enums, `pgvector` HNSW index, and PostgreSQL RLS security policies from DESIGN_DOC.md.
  - **Verification**: SQL syntax validated.
- [x] Task 2.2: Typed Data Models & Store Layer
  - **Acceptance Criteria**: TypeScript interfaces and persistent memory/DB store layer supporting Users, Organizations, Branches, Creators, Campaigns, Conversations, Messages, Contracts, Milestones, Radar, and Hall of Shame.
  - **Verification**: Unit tests / type check on store layer operations.
- [x] Task 2.3: Curated Seed Dataset
  - **Acceptance Criteria**: 30+ authentic creator profiles across Tech, Fintech, Lifestyle, Gaming with rates, stats, and aesthetic tags; Enterprise Org (Acme Global) with NA, APAC, EMEA branches and assigned reps; active campaigns and historical deal links.
  - **Verification**: Querying creator feed returns 30+ items with populated data.

## Checkpoint 2: Data & Seed Layer
- [x] Store layer initializes with full realistic seed data
- [x] Type checking passes (`npx tsc --noEmit`)

## Phase 3: AI-Powered Marketplace & Natural Language Search
- [x] Task 3.1: Hybrid Semantic + Structured Search API
  - **Acceptance Criteria**: `POST /api/v1/marketplace/ai-search` parses natural language queries into JSON filter badges (niches, max rate, min engagement, country) + vibe keywords, and ranks creators.
  - **Verification**: Calling API with "Find Indian fintech creators under $2000" returns filtered creators with match explanation.
- [x] Task 3.2: Interactive Marketplace UI with Animated Badges (`/feed`)
  - **Acceptance Criteria**: Search bar with real-time chip popping, creator cards with rates, verified stats, brand safety score, and vibe match indicator.
  - **Verification**: User types in search bar -> filter chips appear -> creator grid updates dynamically.
- [x] Task 3.3: Creator Profile Modal with Zero-Knowledge Collision & Rival Alerts
  - **Acceptance Criteria**: Profile view displays collision banner (e.g. "APAC branch previously completed a deal with this creator at $1750") and rival exclusivity warning (e.g. "Published reel for Rival Brand 19 days ago").
  - **Verification**: Rep A viewing creator sees collision notice and exclusivity alert without seeing APAC peer chat transcript.

## Checkpoint 3: Search & Discovery
- [x] Natural language search functions and displays animated badges
- [x] Internal collision notice and competitor warnings display accurately

## Phase 4: Isolated Negotiation Chat & AI Deal Copilots
- [x] Task 4.1: Isolated Chat API & Security Gate
  - **Acceptance Criteria**: `GET/POST /api/v1/conversations`, `/messages` enforces that only the assigned rep or creator can access messages. Access by peer rep returns 403 Forbidden.
  - **Verification**: Sales Rep A accesses conversation -> 200 OK. Sales Rep B attempts access -> 403 Forbidden.
- [x] Task 4.2: Role-Aware AI Thread Summarizer
  - **Acceptance Criteria**: `POST /api/v1/conversations/:id/ai-summarize` returns structured summary with offer status, agreed deliverables, and blockers. If requester is Talent Manager, brand POI personal information is stripped.
  - **Verification**: Rep A receives full representative details; Talent Manager receives "Nike Enterprise - APAC Representative".
- [x] Task 4.3: Chat-to-Contract Extractor & AI Suggestion Copilots
  - **Acceptance Criteria**: `POST /api/v1/conversations/:id/ai-extract` parses conversation into contract draft payload (amount, deliverables, due dates); outreach pitch and counter-offer copilots generate contextual drafts.
  - **Verification**: Extraction payload matches agreed terms; copilot pitch references creator's specific niche and stats.
- [x] Task 4.4: Deal Room Messaging UI (`/messages`)
  - **Acceptance Criteria**: Two-pane deal room with active conversation list, message history, "✨ Summarize Thread" button, and "✨ Extract Contract" action drawer.
  - **Verification**: User can send messages, trigger AI summary, and click extract to auto-populate contract.

## Checkpoint 4: Deal Room & RLS Isolation
- [x] Chat isolation verified (Rep A succeeds, Rep B blocked 403)
- [x] Role-aware summarization masks PII for Talent Managers
- [x] Chat-to-Contract extraction returns pre-filled agreement payload

## Phase 5: Legal Contracts, Cryptographic Signing & Milestone Escrow
- [x] Task 5.1: Contract Execution & Milestone Escrow APIs
  - **Acceptance Criteria**: `POST /api/v1/contracts/generate` creates legal draft; `/sign` applies SHA-256 digital signature hash; `/milestones/:id/submit-proof` and `/approve` track deliverable submission and escrow release.
  - **Verification**: Contract transitions from DRAFT -> SIGNED -> ACTIVE -> COMPLETED with immutable signature hashes.
- [x] Task 5.2: Deal Room & Contract Signing UI (`/deals/[id]`)
  - **Acceptance Criteria**: Document preview with terms markdown, digital e-signature pad/button, milestone status pipeline, and proof submission/approval terminal.
  - **Verification**: Brand and creator can sign, view audit hashes, and approve milestones.

## Checkpoint 5: Contract & Escrow
- [x] E-signature generates valid SHA-256 hash and audit record
- [x] Milestones update and disburse escrow funds upon approval

## Phase 6: Two-Phase Verification & Whisper ASR Copilot
- [x] Task 6.1: Verification Engine APIs
  - **Acceptance Criteria**: `POST /api/v1/verification/phase-1/init` issues dynamic 6-word session nonce; `/submit` performs Whisper ASR nonce audio verification and flags confidence; admin queue endpoints handle approval.
  - **Verification**: Nonce validation succeeds with >95% confidence on matching phrase.
- [x] Task 6.2: Interactive Verification Wizard (`/onboarding/verify`)
  - **Acceptance Criteria**: Multi-step wizard: Role selection -> Contact OTP -> Video selfie recorder with dynamic 6-word prompt -> Instant Whisper ASR transcription & green "Nonce Verified" badge.
  - **Verification**: User completes wizard and status transitions to PENDING_PHASE_2.
- [x] Task 6.3: HITL Admin Verification Queue (`/admin/verification-queue`)
  - **Acceptance Criteria**: Platform Admin interface displaying pending applicant videos, Whisper transcript diff, and Approve/Reject buttons.
  - **Verification**: Admin approval transitions user status to VERIFIED.

## Checkpoint 6: Verification Moat
- [x] 6-word nonce generation and Whisper ASR audio match verified
- [x] HITL Admin queue approves applicant and unlocks full account privileges

## Phase 7: Enterprise Governance, Calendar, Collab & Hall of Shame
- [x] Task 7.1: Enterprise Executive Hub (`/enterprise/dashboard`)
  - **Acceptance Criteria**: Company Head Account view with branch switcher, spending vs. budget allocations, deal reassignment modal with AI Handover Brief generator, and Rival Intelligence widget.
  - **Verification**: Reassigning a deal from Rep A to Rep B creates a handover brief and updates conversation ownership.
- [x] Task 7.2: Deliverables Calendar (`/calendar`)
  - **Acceptance Criteria**: Unified calendar grid showing drafts, live posts, and milestone deadlines for active contracts with month/week views.
  - **Verification**: Calendar renders contract milestones on correct due dates.
- [x] Task 7.3: Creator Peer Barter Collab Hub (`/collab`)
  - **Acceptance Criteria**: Peer-to-peer creator directory with AI Peer Barter Concept Generator that suggests 3 zero-dollar collaboration formats between selected creators.
  - **Verification**: Selecting two creators generates tailored collab ideas.
- [x] Task 7.4: Public Hall of Shame Transparency Ledger (`/hall-of-shame`)
  - **Acceptance Criteria**: Public directory of blacklisted scammers and breaching entities with AI-generated dispute timeline, breach summaries, and total loss claims.
  - **Verification**: Hall of shame entries display verified claim details and tribunal decisions.

## Checkpoint 7: Complete End-to-End System
- [x] All 9 routes operational and navigable
- [x] Full build succeeds without errors (`npm run build`)
- [x] Complete user journey runs smoothly across all personas
