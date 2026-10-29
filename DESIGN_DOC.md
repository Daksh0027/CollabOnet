# CollaboNet — System Architecture & Technical Design Document (TDD)
**AI-Powered Operating System & Transaction Infrastructure for Creators, Agencies, and Multi-Branch Brand Enterprises**

---

## 1. Document Control & Metadata

| Attribute | Details |
| :--- | :--- |
| **Project Name** | **CollaboNet** |
| **Document Version** | `v1.2.0` (AI-Native Enterprise Edition) |
| **Status** | Approved for Implementation / RFC Stage |
| **Target Platforms** | Web App (Next.js 14+ App Router), Mobile App (React Native/Expo), Backend Services (Node.js/TypeScript & Python) |
| **Database & Cache** | PostgreSQL 16+ (with `pgvector` & Row-Level Security), Redis 7+ (Pub/Sub & Cache), S3/Cloudflare R2 (Media/Blobs) |
| **AI / ML Infrastructure** | OpenAI / Gemini API (Embeddings & Structured LLM), Whisper ASR (Liveness Nonce Check), LangChain / Vercel AI SDK |
| **Source Reference** | [Notion Specification: Connecting/Management Tool for Agencies & Creators](https://app.notion.com/p/Connecting-management-tool-for-Social-media-agencies-and-creators-408e3efc57dc8018b80df5d37f939db0) |

---

## 2. Executive Summary & Problem Space

### 2.1 The Core Problem
In the modern creator economy, brand-creator partnerships are heavily intermediated by unaccredited third-party talent agencies, brokers, and PR middlemen. This fragmented ecosystem suffers from:
1. **Middleman Corruption & Financial Leakage**: Agencies inflate brand invoices while skimming 30%–70% of payouts from creators without transparency.
2. **Payment Defaults & Exploitation**: Creators frequently complete campaign deliverables only to encounter ghosting, disputed revisions, or non-payment.
3. **Impersonation & Brand Safety Risks**: Scammers impersonate high-follower creators using fake email domains and botted screenshots to siphon advance sponsor budgets.
4. **Lack of Legal Enforceability**: Deals are routinely agreed upon over informal Instagram DMs or WhatsApp threads with no legally binding agreements, milestone escrows, or verifiable audit trails.
5. **Enterprise Multi-Branch Chaos & Internal Cannibalization**: Large corporations with multiple regional offices (e.g., North America, EMEA, APAC) employ dozens of sales and marketing representatives. Without data fencing and cross-branch coordination, internal reps snoop on peer chats, leak terms, and accidentally bid against each other for the same creator at different prices.
6. **High Transaction Friction**: Manually searching through thousands of creator media kits, interpreting negotiation threads, drafting legal contracts, and detecting competitor sponsorships burns hundreds of operational hours per campaign.

### 2.2 The CollaboNet AI-Powered Solution
**CollaboNet** weaves an **AI Agentic Layer** into its secure PostgreSQL 16 + Redis + BullMQ architecture without violating its core security moat (**Peer Rep Chat Isolation** and **Manager POI Masking**). Key capabilities:
- **Two-Phase Human-in-the-Loop (HITL) Verification**: Powered by Whisper ASR audio-verification copilot and App Store-grade admin queues.
- **Enterprise Multi-Branch Hierarchy**: Centralized **Head Account** oversight with branch budget limits, team provisioning, and zero-downtime deal succession.
- **Strict Peer Chat Isolation**: Enforced via PostgreSQL Row-Level Security (RLS) so representatives only view their assigned negotiations.
- **Hybrid Semantic + Structured AI Search**: Natural language query parsing (Text-to-SQL/Filter) combined with `pgvector` portfolio vibe matching and automated brand-safety screening.
- **In-Chat AI Thread Summarizer & Contract Extractor**: One-click deal state synthesis with role-aware privacy masking (stripping representative PII for talent managers) and instant conversion of chat agreements into populated legal contracts.
- **Rival Intelligence & Zero-Knowledge Collision Radar**: Automatically detects competitor sponsorships and warns reps when another branch is actively talking to the same creator—preventing internal bidding wars while keeping transcripts 100% private.
- **Contextual AI Suggestion Copilots**: Personalized outreach generators for reps, smart counter-offer calculators for creators, peer barter concept creators, and dispute triage assistants.
- **Legally Binding Contracts & Milestone Escrow**: Cryptographic document signing and milestone disbursement with public accountability through the **"Hall of Shame"**.

---

## 3. High-Level System Architecture

CollaboNet integrates an **AI Orchestration Service (`AISvc`)** directly alongside its core microservices. All AI calls pass through tenant and role-filtering layers to preserve RLS guarantees.

```mermaid
flowchart TB
    subgraph Clients["Frontend Clients"]
        Web["Web Application\n(Next.js 14+ App Router, Tailwind, Shadcn, Framer)"]
        Mobile["Mobile Client\n(React Native / Expo SDK 51)"]
    end

    subgraph Gateway["Edge & Gateway Layer"]
        CDN["Cloudflare Edge / WAF"]
        APIGateway["API Gateway & Reverse Proxy\n(Rate Limiting, JWT Validation, Tenant Routing)"]
    end

    subgraph CoreBackend["Application Core (Node.js / TypeScript)"]
        AuthSvc["Auth & RBAC Service\n(Session, OAuth 2.0, SCIM/SSO)"]
        OrgSvc["Enterprise Org & Branch Service\n(Multi-Branch, Member Provisioning, Budgets)"]
        VerificationSvc["Verification Engine\n(2-Phase HITL Pipeline)"]
        MarketplaceSvc["Marketplace & Search Engine\n(Hybrid Semantic + Structured Filter)"]
        ChatSvc["Real-Time Isolated Messaging Service\n(WebSocket / Socket.IO + Redis Adapter + RLS)"]
        ContractSvc["Contract & Legal Service\n(Dynamic PDF Gen & E-Sign Engine)"]
        ReputationSvc["Reputation & Hall of Shame Svc\n(Disputes, Reviews, Strike Counter)"]
    end

    subgraph AIService["AI & Intelligence Layer (Python / Fastify Agent)"]
        AISvc["AI Orchestration Engine\n(LangChain, LLM Structured Outputs, Embeddings)"]
        NLParser["NL-to-Filter Parser\n(JSON Schema Extraction)"]
        VibeMatcher["Vibe Matcher & Vector Search\n(pgvector Cosine Sim)"]
        ChatSummarizer["Role-Aware Chat Summarizer\n(PII-Masked Context Window)"]
        ContractExtractor["Chat-to-Contract Extractor\n(Term Parser & Milestone Formatter)"]
        CollisionEngine["Zero-Knowledge Collision Radar\n(Cross-Branch Coordination)"]
        WhisperASR["Whisper Audio Verifier\n(Phase-1 Nonce Matching)"]
    end

    subgraph DataStorage["Data & State Persistence"]
        Postgres[(PostgreSQL 16\nMaster + pgvector + Row-Level Security)]
        RedisCache[(Redis Cluster\nCache, Rate Limits, WS PubSub)]
        BlobStorage[("S3 / Cloudflare R2\nMedia, Contracts, Verification Videos")]
    end

    subgraph Workers["Async Background Workers (BullMQ)"]
        WorkerSocial["Social Analytics & Rival Scanner\n(YouTube / Meta Graph API + #ad Scraper)"]
        WorkerVideo["Video Transcoder & Whisper Worker"]
        WorkerEmbed["Profile & Campaign Embedding Worker"]
        WorkerNotif["Notification Dispatcher\n(Push, Email, WhatsApp)"]
    end

    Web & Mobile --> CDN --> APIGateway
    APIGateway --> AuthSvc & OrgSvc & VerificationSvc & MarketplaceSvc & ChatSvc & ContractSvc & ReputationSvc

    MarketplaceSvc <--> NLParser & VibeMatcher
    ChatSvc <--> ChatSummarizer & ContractExtractor
    OrgSvc <--> CollisionEngine
    VerificationSvc <--> WhisperASR
    AISvc --- NLParser & VibeMatcher & ChatSummarizer & ContractExtractor & CollisionEngine & WhisperASR

    CoreBackend --> Postgres & RedisCache
    AISvc --> Postgres
    VerificationSvc & ContractSvc --> BlobStorage

    CoreBackend --> RedisCache --> Workers
    Workers --> Postgres & BlobStorage & AISvc
```

---

## 4. User Personas & Enterprise Role-Based Access Control (RBAC)

CollaboNet establishes a multi-tenant organizational hierarchy designed for both independent creators and multinational enterprise brands with AI guardrails.

```mermaid
graph TD
    subgraph EnterpriseBrand["Enterprise Company Structure (e.g., Nike Global)"]
        HeadAcc["Company Head Account\n(Org Owner / CMO / Executive Admin)"]
        Branch1["Branch: North America\n(Regional Branch Lead)"]
        Branch2["Branch: APAC (Mumbai / Tokyo)\n(Regional Branch Lead)"]
        
        Rep1["Sales / Marketing Rep A"]
        Rep2["Sales / Marketing Rep B"]
        Rep3["Sales / Marketing Rep C"]
        
        HeadAcc --> Branch1 & Branch2
        Branch1 --> Rep1 & Rep2
        Branch2 --> Rep3
    end

    subgraph CreatorSide["Creator Ecosystem"]
        Creator["Verified Content Creator"]
        Manager["Talent Manager / Agency"]
        Manager -.->|Represents| Creator
    end

    Rep1 <===>|Isolated Deal Chat A| Creator
    Rep2 -.->|BLOCKED / NO ACCESS (403)| Rep1
    Rep3 <===>|Isolated Deal Chat B| Creator

    subgraph AIAssistants["AI Agents & Privacy Fences"]
        ZKAlert["Zero-Knowledge Collision Alert\n(Warns Rep 3 that Rep 1 dealt with Creator)"]
        AISummary["Role-Aware AI Summary\n(Manager sees Masked Company; Rep sees Full POI)"]
    end

    Rep3 -.-> ZKAlert
    Manager -.-> AISummary
```

### 4.1 Enterprise & Creator Persona Matrix

| Persona | Hierarchy Level | Primary Goals | Access Scope & Information Isolation |
| :--- | :--- | :--- | :--- |
| **Company Head Account (Org Admin)** | Top Enterprise Tier (CMO / VP Marketing) | Corporate oversight, global budget governance, rival intelligence, cross-branch ROI | **Global Organization View**: Manages branches, invites/deactivates reps, monitors branch budgets, reviews AI executive digests and rival sponsorship benchmarks. Does **not** inspect daily rep chats unless formally escalated. |
| **Branch Manager** | Regional Tier (e.g. APAC Marketing Lead) | Regional campaigns, team workload balancing, budget efficiency | **Branch Scoped View**: Monitors all campaigns and aggregate spending for their branch. Can reassign stalled deals within the branch and access handover briefs. |
| **Sales / Marketing Representative** | Operational Deal Owner (The POI) | Sourcing creators, negotiating deliverables, executing deals | **Strict Rep Isolation**: Can ONLY see their **own assigned conversations and deals**. Cannot view peer chats. Empowered with NL search, personalized outreach generator, and contract extractor. |
| **Content Creator** | Creator Tier | Monetize content, find legitimate sponsors, protect IP | Sees the **full name, photo, and title** of the brand POI. Uses AI counter-offer assistants, rate benchmarking, and Collab Tab barter generators. |
| **Talent Manager (Agency)** | Creator Representative Tier | Manage deals for rostered creators | **Role Isolation Rule**: Can only see the **Company Entity Name** (e.g., *"Nike Enterprise - APAC"*). Personal brand POI details are masked in both chat and AI summaries. |
| **Platform Auditor** | System Administrator Tier | Fraud mitigation, verification, dispute resolution | Access to verification footage, Whisper transcript audit logs, and the Hall of Shame dispute triage copilot. |

### 4.2 Chat, Deal & AI Feature Visibility Matrix

| Resource / Feature | Sales Rep A (Owner) | Sales Rep B (Peer) | Branch Manager | Company Head Account | Creator | Talent Manager |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rep A Chat Messages** | **Full Read/Write** | **NO ACCESS (403)** | Metadata Only | Metadata Only | **Full Read/Write** | Masked Read/Write |
| **AI Thread Summary** | **Full Context** | **NO ACCESS (403)** | Handover Brief* | Escalation Only | **Full Context** | **Masked (No Rep PII)** |
| **Chat-to-Contract Auto-Draft** | **One-Click Draft** | No Access | Read-Only Draft | Read-Only Draft | Review & Sign | Review & Sign |
| **Internal Collision Alert** | Rate Benchmark | Rate Benchmark | Branch Overview | Global Overview | N/A | N/A |
| **Rival Sponsorship Radar** | Category View | Category View | Regional Radar | Global Radar | N/A | N/A |
| **Reassign Deal Owner** | Denied | Denied | Allowed (Branch) | Allowed (Global) | Denied | Denied |

*\*Note: Handover Briefs are generated exclusively when a Branch Manager or Head Account executes a formal deal reassignment.*

---

## 5. Detailed Step-by-Step Technical Blueprint

---

### Step 1: Authentication & Two-Phase Verification Engine with Whisper ASR Copilot

The verification process is the fundamental security moat of CollaboNet. Unlike standard email signups, accounts remain in an `UNVERIFIED` state with restricted read-only browsing until both verification phases pass.

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator / Brand
    participant Client as Frontend (Web/App)
    participant Auth as Auth & Verification API
    participant S3 as Media Blob Storage
    participant Worker as BullMQ / Whisper Worker
    actor Admin as HITL Admin Reviewer

    Note over User, Client: Phase 1: Automated Verification + AI Audio Check
    User->>Client: Register (Email, Mobile, Role, Handle)
    Client->>Auth: POST /api/v1/auth/register
    Auth-->>Client: OTP Challenge for Email & SMS
    User->>Client: Submit OTPs & Social Handle Claim
    Client->>Auth: POST /api/v1/verification/phase-1/init
    Auth->>Auth: Generate dynamic 6-word session nonce (e.g., "CollaboNet-Tiger-901-Falcon")
    Auth-->>Client: Nonce token + S3 Pre-signed URL
    User->>Client: Record Liveness Video reciting nonce
    Client->>S3: Upload Video (direct to S3 bucket)
    Client->>Auth: POST /api/v1/verification/phase-1/submit
    Auth->>Worker: Enqueue Video & Audio Verification Task
    Worker->>Worker: Extract audio stream -> Transcribe with Whisper ASR
    Worker->>Worker: Exact phrase matching (Audio Nonce vs. Session Nonce)
    Worker->>Auth: Mark Nonce as VALIDATED (or Flag Discrepancy)

    Note over User, Admin: Phase 2: Human-in-the-Loop Review
    Admin->>Auth: GET /api/v1/admin/verification-queue
    Auth-->>Admin: Video preview, Whisper transcript diff, verified social stats
    Admin->>Admin: Audit footage & approve (or conduct WebRTC verification call)
    Admin->>Auth: POST /api/v1/admin/verify-decision (APPROVED)
    Auth-->>Client: Push Notification: Account Fully Active
```

#### Technical Implementation Details:
1. **Manager Declaration Checkbox**:
   * During onboarding, users encounter a mandatory check: `[x] Are you an Agency / Talent Manager?`.
   * Selection forces the submission of signed Representation Agreements with creator roster IDs. Falsifying this step triggers instant permanent blacklisting and hardware fingerprint ban.
2. **Phase 1 (Automated Verification + Whisper Copilot)**:
   * **Multi-channel Contact Verification**: Phone verification via SMS OTP; corporate/creator email via magic links.
   * **Social Platform Handshake**: OAuth2 integration with YouTube Data API and Meta Graph API.
   * **Whisper Audio Nonce Verifier**: When the selfie video is uploaded, an asynchronous BullMQ worker uses OpenAI Whisper / local Whisper-base to transcribe the audio stream and verify the dynamic 6-word nonce. If the audio matches with >95% confidence, it passes directly to the Phase 2 admin queue with a `"Nonce Verified"` green badge.
3. **Phase 2 (Human Verification Review)**:
   * Verification requests enter an administrative triage queue partitioned by tier (Micro, Macro, Enterprise Brand).
   * **Corporate Domain Verification**: Enterprise companies verify corporate domain ownership via DNS TXT records (`_collabonet-verification=xyz`) or business registration documents (CIN/GSTIN/EIN).
   * **Mandatory Legal Disclaimer Acceptance**: Before account unlock, both parties digitally accept the platform's standard mediation clause, non-circumvention rules, and limitation of liability agreement.

---

### Step 2: Enterprise Multi-Branch Architecture & Head Account Hub

To accommodate multinational brands with distributed marketing departments, CollaboNet treats the brand as a top-level **Tenant Organization** containing **Regional Branches**.

```mermaid
graph TD
    Org[Enterprise Organization: Acme Global] --> Head[Head Account: CMO / Global Admin]
    
    Org --> B1[Branch 1: North America - NYC]
    Org --> B2[Branch 2: APAC - Mumbai]
    Org --> B3[Branch 3: EMEA - London]
    
    B1 --> RepA[Sales Executive: Alice]
    B1 --> RepB[Sales Executive: Bob]
    B2 --> RepC[Sales Executive: Charlie]
    
    Head -->|Manages| B1 & B2 & B3
    Head -->|Sets Budgets & Oversees| Org
    Head -->|Can Reassign Deals| RepA & RepB & RepC
```

#### 2.1 Branch & Team Member Provisioning
1. **Head Account Capabilities**:
   * **Branch Creation**: Create regional offices (e.g., *"Nike APAC - Mumbai Office"*, *"Nike EMEA - London Branch"*) with designated operational currencies, tax zones, and spending thresholds.
   * **Member Invitations & Role Provisioning**: Invite marketing executives via corporate SSO (SAML 2.0 / Okta) or email magic links, binding them to a specific branch with designated roles (`BRANCH_MANAGER`, `SALES_REPRESENTATIVE`).
   * **Centralized Billing & Escrow Pool**: The Head Account funds a master enterprise escrow wallet and distributes monthly spending allocations across branches.
2. **Deal Succession & Reassignment Engine**:
   * When a representative transitions roles, takes leave, or leaves the company, the Head Account (or Branch Manager) executes a **Zero-Downtime Deal Handover**:
     ```http
     POST /api/v1/orgs/deals/{dealId}/reassign
     Body: { "newRepresentativeId": "user_bob_uuid", "handoverReason": "Alice on leave" }
     ```
   * The system transfers active conversation access to the new representative and triggers the **AI Handover Briefing Generator** so the new rep catches up in seconds without reading 200+ historical messages.

---

### Step 3: AI-Powered Search, Smart Dynamic Filters & Brand Safety

Currently, traditional platforms rely on rigid dropdown filters. CollaboNet upgrades `MarketplaceSvc` into a **Hybrid Semantic + Structured Search Engine**.

```mermaid
flowchart LR
    UserQuery["User Natural Language Query:\n'Find Indian fintech creators who do 60s YouTube integrations under $2,000 with >4% engagement'"]
    
    subgraph AIParser["AI Query Parser (Structured Outputs)"]
        LLM["LLM with JSON Schema"]
        FilterJSON["Structured Filter JSON:\n{ niche: 'fintech', country: 'IN', platform: 'youtube',\n  format: 'yt_integrated_60s', max_rate: 2000, min_engagement: 0.04 }"]
        QueryEmbedding["Query Vector Embedding\n(text-embedding-3-small: 1536 dim)"]
    end
    
    subgraph PostgresEngine["PostgreSQL 16 Hybrid Query Engine"]
        SQLFilter["Structured JSONB Filter:\nrates->>'yt_integrated_60s' <= 2000\nAND stats_cache->>'engagement_rate' >= 0.04"]
        VectorSearch["pgvector Cosine Search:\nprofile_embedding <=> QueryEmbedding < 0.35"]
        SafetyFilter["Brand Safety Gate:\nai_brand_safety_score >= 85.0"]
    end
    
    UserQuery --> LLM
    LLM --> FilterJSON & QueryEmbedding
    FilterJSON --> SQLFilter
    QueryEmbedding --> VectorSearch
    SQLFilter & VectorSearch & SafetyFilter --> RankedResults["Ranked Creator Matches\n(with AI Match Explanations)"]
```

#### 3.1 Three-Pillar AI Discovery Engine
1. **Natural Language to Structured Filter Parser (Text-to-Filter)**:
   * Reps type conversational prompts. An LLM with Structured Outputs parses the query into a deterministic JSON filter payload, eliminating manual dropdown toggling.
   * Visual feedback: The UI dynamically animates and highlights filter badges corresponding to the parsed parameters.
2. **Semantic Portfolio & Vibe Matching (`pgvector`)**:
   * Brands often look for specific aesthetic vibes (e.g., *"cinematic storytelling"*, *"minimalist tech desk setups"*, *"high-energy Gen-Z street style"*), which tags like "Tech" completely miss.
   * When creators update their bio, pitch text, or portfolio case studies, a BullMQ worker generates a 1536-dimensional vector embedding stored in `creator_profiles.profile_embedding`.
   * Queries perform cosine distance calculations (`<=>`) to match creators by stylistic tone.
3. **AI Audience Authenticity & Brand-Safety Filter**:
   * During the `WorkerSocial` sync, an AI classification pass scans recent comment sections, view-to-like ratios, and caption histories.
   * Botted comments (repetitive emoji spam, sudden follower spikes) and controversial content lower the creator's `ai_brand_safety_score` (0–100 scale). Reps can set a hard brand-safety cutoff floor (e.g., `>= 90.0`).

---

### Step 4: Isolated Negotiation Chat, Role-Aware AI Thread Summarizer & Contract Extractor

CollaboNet combines low-latency WebSockets with PostgreSQL Row-Level Security (RLS) and custom AI prompt pipelines to uphold two non-negotiable security boundaries:
1. **Peer Representative Chat Isolation**: Sales Rep A and Sales Rep B cannot read each other's chats.
2. **Manager POI Masking**: Talent managers cannot see personal brand POI details in chat or in AI summaries.

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Content Creator
    actor Manager as Talent Manager
    actor RepA as Sales Rep A (Assigned Lead)
    participant ChatAPI as Chat & WebSocket Gateway
    participant AI as AISvc (Summarizer & Extractor)
    participant Masking as RBAC Data Masking Engine
    participant DB as PostgreSQL (with RLS)

    Note over RepA, Creator: Negotiation over 25+ Messages
    RepA->>ChatAPI: Send proposal: "$2,200 for 1x Reel + 2x Stories"
    Creator->>ChatAPI: Counter-offer: "$2,500 if product gifted"
    RepA->>ChatAPI: Accept counter-offer

    Note over RepA, AI: One-Click AI Summary & Contract Auto-Draft
    RepA->>ChatAPI: Click "✨ Summarize Thread"
    ChatAPI->>DB: Fetch messages (Guarded by RLS: Rep A assigned)
    ChatAPI->>AI: Generate Thread Summary
    AI-->>RepA: Structured TL;DR (Offer: $2,500, Deliverables: 1 Reel + 2 Stories, Gifted Product)

    Note over Manager, AI: Talent Manager Summary Request (Privacy Guardrail)
    Manager->>ChatAPI: Click "✨ Summarize Thread"
    ChatAPI->>Masking: Apply RBAC Masking to Conversation Context
    Masking->>AI: Send Sanitized Messages (Rep personal details stripped)
    AI-->>Manager: Summary displaying "Agreed with Nike Enterprise - APAC Representative" (Zero PII Leaked)

    Note over RepA, DB: Instant "Chat-to-Contract" Extraction
    RepA->>ChatAPI: Click "✨ Extract Terms to Contract"
    ChatAPI->>AI: Parse agreed milestones, amounts, and dates into JSON
    AI-->>ChatAPI: Pre-filled Contract Draft Payload
    ChatAPI->>DB: POST /api/v1/contracts/generate (Pre-populated)
```

#### 4.1 In-Chat AI Thread Summarizer (Role-Aware)
- Generates a structured snapshot with three sections:
  1. **Current Offer Status**: (e.g., *"Brand offered $2,500 with gifted product; Creator accepted"*).
  2. **Agreed Deliverables & Timeline**: (e.g., *"1x IG Reel due Nov 15; 2x Stories due Nov 20"*).
  3. **Pending Blockers**: (e.g., *"Awaiting confirmation on spark ads usage rights"*).
- **Privacy Guardrail**: For Talent Managers, messages pass through the `RBAC Data Masking Engine` before reaching the LLM prompt. The AI summary references only `"Company: Nike Enterprise - APAC"` and completely omits Rep A's personal name, direct phone, or email.

#### 4.2 "Chat-to-Contract" Auto-Draft Button
- The LLM parses the conversation history, extracts numerical terms, milestone titles, formats, and due dates, and automatically pre-fills the payload for `POST /api/v1/contracts/generate`.
- Reduces contract drafting time from 20 minutes to a single 2-second click.

---

### Step 5: Enterprise Cross-Branch Intelligence & Rival Analysis

Because Sales Reps operate in strict isolation, large enterprises face the risk of **internal collision** (bidding against each other) and lack visibility into competitor sponsorships.

```mermaid
flowchart TD
    subgraph RivalRadar["1. Competitor Sponsorship Radar"]
        WorkerSocial["WorkerSocial Scanner\n(Scans #ad, brand handles, video descriptions)"] --> RivalDB[(Competitor Sponsorships)]
        RivalDB --> ExclusivityBadge["Exclusivity & Conflict Detector\n'⚠️ Alert: Published reel for Rival Brand 19 days ago'"]
        RivalDB --> SoVBenchmarking["Share-of-Voice & Category CPM Benchmarks\n'Branch paying 18% above category average'"]
    end

    subgraph InternalCollision["2. Zero-Knowledge Internal Collision Alert"]
        RepNA["Rep A (North America Branch)\nViews Creator Profile"]
        CoordEngine["AI Cross-Branch Coordinator\n(Inspects org deals without exposing peer chats)"]
        CollisionBanner["Privacy-Safe Banner on Profile:\n'Notice: APAC branch completed a deal with this creator ($2,200).'\n(Peer chat transcripts remain 100% locked 403)"]
        
        RepNA --> CoordEngine --> CollisionBanner
    end

    subgraph BriefGrader["3. Pre-Launch Campaign Brief Grader"]
        DraftBrief["Rep drafts campaign in POST /api/v1/campaigns"]
        Evaluator["AI Brief Grader (0-100)"]
        Checks["Flags: Budget too low for requested deliverables\nor deadline tighter than verified creator average"]
        
        DraftBrief --> Evaluator --> Checks
    end
```

#### 5.1 Zero-Knowledge Internal Collision Alert
- When Rep A (North America) opens a creator profile, the system queries whether another branch (e.g., APAC) has an active or recent deal with the same creator.
- **Privacy Guarantee**: Displays a contextual notice: *"Notice: Another branch (APAC) completed a deal with this creator. Historical internal rate benchmark: ~$2,200."* Rep A cannot view or open the APAC chat transcripts (RLS still returns `403`), but the enterprise avoids overpaying or bidding against itself.

#### 5.2 Competitor Sponsorship Radar & Conflict Detector
- `WorkerSocial` scans public video descriptions, `#ad` / `#sponsored` tags, and brand mentions across YouTube and Instagram for creators in the database.
- **Exclusivity Alert**: Before a representative locks escrow funds for a contract with a 30-day exclusivity clause, the AI warns: *"⚠️ Conflict Alert: This creator published a sponsored reel for [Rival Brand] 19 days ago."*
- **Rate Benchmarking**: Displays anonymized regional CPM/CPE averages to Branch Managers (e.g., *"Your APAC branch is paying 18% above market rate for Tech YouTube Integrations in India"*).

#### 5.3 Pre-Launch Campaign Brief Grader & Executive ROI Synthesizer
- **Brief Grader**: Evaluates drafted campaigns on a 0–100 quality scale, checking if the budget matches prevailing rates in `creator_profiles.rates` for the requested platforms and niches.
- **Executive ROI Synthesizer**: Generates a high-level monthly digest on `/enterprise/dashboard` for the Head Account (e.g., *"APAC branch achieved a 22% faster deal-close velocity and 15% lower revision rate than EMEA this quarter"*).

---

### Step 6: Contextual AI Suggestion Copilots

Embedded AI generation tools accelerate marketplace interactions across all four user personas:

| Target Persona | Suggestion Copilot Feature | Data Inputs Used | Output / Automated Action |
| :--- | :--- | :--- | :--- |
| **Sales Representative** | **Hyper-Personalized Outreach Generator** | Campaign brief + Creator bio + `stats_cache` + recent top video topic | Generates a tailored hook referencing the creator's actual content inside `connection_requests.custom_pitch`. |
| **Content Creator** | **Smart Application & Counter-Offer Assistant** | Brand campaign card + Creator verified rate card + past case studies | Generates a high-converting pitch or a polite, data-backed counter-offer in chat when a brand lowballs. |
| **Creator (Collab Tab)** | **Peer Barter Concept Generator** | Creator A niche/city + Creator B niche/city in `/collab` | Suggests 3 specific zero-dollar collaboration formats (e.g., *"FinTech x SaaS creator 60s split-screen Reel on startup taxes"*). |
| **Platform Auditor** | **Phase-1 Nonce & Dispute Triage Copilot** | Phase-1 video + Hall of Shame dispute evidence (contracts, chat history, milestones) | Transcribes video to match the 6-word nonce; compiles a neutral chronological timeline of breach claims for the tribunal. |

---

### Step 7: Legal Deal Document Signing & Milestone Escrow

Every finalized chat negotiation translates into a standardized, cryptographically signed legal agreement tied directly to the corporate branch and assigned representative.

```mermaid
stateDiagram-v2
    [*] --> Draft : Deal Terms Agreed in Chat (or AI Extracted)
    Draft --> ContractGenerated : System Generates Legal PDF (With Branch Details)
    ContractGenerated --> PendingBrandSign : Sent to Assigned Brand Rep / Branch Signer
    PendingBrandSign --> PendingCreatorSign : Brand E-Signs & Locks Escrow Funds from Branch Budget
    PendingCreatorSign --> DealActive : Creator E-Signs Agreement
    DealActive --> MilestoneSubmission : Creator Uploads Draft/Live Links
    MilestoneSubmission --> BrandReview : Automated Validation & Brand Rep Review
    BrandReview --> RevisionRequested : Changes Required (Max 2 Rounds)
    RevisionRequested --> MilestoneSubmission : Creator Re-submits
    BrandReview --> Approved : Deliverables Accepted by Assigned Rep
    Approved --> PaymentReleased : Escrow Disbursed to Creator
    PaymentReleased --> [*] : Deal Closed & Feedback Logged
```

#### Contract Specification & Fields
- **Parties**: Legal Corporate Entity & Specific Branch, Assigned Representative Name, Creator Legal Name, and Platform as Escrow Agent.
- **Deliverables Schedule**: Precise specification of post formats, quantity, minimum runtime, mandatory hashtags, tracking links, and tag handles.
- **Intellectual Property (IP) & Usage Rights**: Exclusivity duration, organic posting rights vs. paid whitelisting/spark ads rights.
- **Review Deadlines & Revision Caps**: Standard limit of two revision rounds; maximum 48-hour brand review window before auto-approval.
- **Cryptographic Signatures**: Document hashed via SHA-256 with timestamp, user IP address, user agent, and verified auth signature stored in an immutable audit table.

---

### Step 8: Deliverables Calendar & Event Scheduler

Both creators and brand managers require unified schedule tracking to prevent missed deadlines.

```
+-----------------------------------------------------------------------+
|  COLLABONET UNIFIED DELIVERABLE & EVENT CALENDAR                      |
+-----------------------------------------------------------------------+
|  MON       |  TUE       |  WED       |  THU       |  FRI       |  SAT/SUN |
|------------+------------+------------+------------+------------+----------|
| 01         | 02         | 03         | 04         | 05         | 06 / 07  |
|            | [DRAFT]    |            | [LIVE POST]|            | [EVENT]  |
|            | Nike Reel  |            | Nike Reel  |            | Creator  |
|            | Due 18:00  |            | Publish    |            | Meetup   |
|------------+------------+------------+------------+------------+----------|
| 08         | 09         | 10         | 11         | 12         | 13 / 14  |
| [WALK-IN]  |            | [REVISION] |            | [PAYOUT]   |          |
| Tech Brand |            | SaaS Video |            | $2,500     |          |
| Activation |            | Script Rev |            | Disbursed  |          |
+-----------------------------------------------------------------------+
```

#### Technical Features:
- **Calendar Feeds**: Two-way iCal / Google Calendar / Apple Calendar sync via signed webcal tokens.
- **Push Notification Cron**: Scheduled BullMQ workers dispatch reminders at T-48h, T-24h, and T-2h before draft submission deadlines.
- **Walk-in Event Pass**: Issues dynamic QR-coded event passes with geo-fenced check-in capabilities for physical brand activation walk-ins.

---

### Step 9: The "Hall of Shame" & Reputation Tribunal

To permanently disincentivize bad behavior (creators taking money and ghosting, or brands using content without paying), CollaboNet incorporates an evidence-backed public accountability directory: **The Hall of Shame**.

```mermaid
flowchart TD
    Dispute[User Files Breach Claim] --> Evidence[Upload Contract, Chat Logs, Payment Proof]
    Evidence --> AICopilot[AI Dispute Triage Copilot:\nExtracts chronological timeline & flags breaches]
    AICopilot --> GracePeriod[Mandatory 72-Hour Resolution Window]
    GracePeriod -->|Resolved Privately| Closed[Dispute Dismissed]
    GracePeriod -->|Unresolved| Tribunal[CollaboNet Admin Tribunal Review]
    Tribunal -->|Claim Invalid| Dismissed[Claim Dismissed + Penalty for False Filing]
    Tribunal -->|Breach Confirmed| Action{Enforcement Action}
    Action --> Strike1[1st Offense: Formal Warning + Trust Score -30%]
    Action --> Strike2[2nd Offense: Suspension + Temporary Badging]
    Action --> Permanent[Severe Fraud: Permanent Hall of Shame Entry & Blacklist]
    Permanent --> PublicProfile[Public Ledger Entry: Identity, Breach Summary, Loss Value]
```

---

## 6. Comprehensive Database Schema (PostgreSQL 16 DDL with `pgvector` & RLS)

Below is the complete production-grade relational schema incorporating `pgvector`, AI summaries, competitor tracking, and PostgreSQL Row-Level Security.

```sql
-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";      -- pgvector for semantic search & vibe matching
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- Trigram matching for fast text search

-- 2. Enums for Type Safety & RBAC
CREATE TYPE user_role AS ENUM (
    'CREATOR', 
    'TALENT_MANAGER', 
    'COMPANY_HEAD_ADMIN', 
    'BRANCH_MANAGER', 
    'SALES_REPRESENTATIVE', 
    'PLATFORM_ADMIN'
);

CREATE TYPE verification_status AS ENUM (
    'UNVERIFIED', 
    'PENDING_PHASE_1', 
    'PENDING_PHASE_2', 
    'VERIFIED', 
    'REJECTED', 
    'SUSPENDED'
);

CREATE TYPE campaign_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
CREATE TYPE deal_status AS ENUM ('PROPOSED', 'NEGOTIATING', 'CONTRACT_PENDING', 'ACTIVE_IN_PROGRESS', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'CANCELLED');
CREATE TYPE milestone_status AS ENUM ('PENDING', 'SUBMITTED', 'REVISION_REQUESTED', 'APPROVED', 'PAID');

-- 3. Core Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(32) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    verification_status verification_status DEFAULT 'UNVERIFIED' NOT NULL,
    is_manager BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Enterprise Parent Organizations (e.g. Nike Global)
CREATE TABLE enterprise_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(128),
    registration_number VARCHAR(64) UNIQUE NOT NULL,
    corporate_domain VARCHAR(255) UNIQUE NOT NULL,
    head_user_id UUID NOT NULL REFERENCES users(id),
    billing_pool_balance NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    competitor_keywords TEXT[] DEFAULT '{}', -- e.g. ARRAY['adidas', 'puma', 'underarmour']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Regional Branches / Workspaces (e.g. Nike APAC, Nike NA)
CREATE TABLE organization_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_name VARCHAR(128) NOT NULL,
    location_city VARCHAR(64) NOT NULL,
    location_country VARCHAR(4) NOT NULL,
    monthly_budget_allocation NUMERIC(12, 2) DEFAULT 0.00,
    manager_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(organization_id, branch_name)
);

-- 6. Organization Memberships
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Creator Profiles with pgvector Embeddings & Brand Safety
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(128) NOT NULL,
    handle VARCHAR(64) UNIQUE NOT NULL,
    bio TEXT,
    pitch_text TEXT,
    primary_niche VARCHAR(64) NOT NULL,
    secondary_niches TEXT[] DEFAULT '{}',
    country_code VARCHAR(4) NOT NULL,
    city VARCHAR(64),
    rates JSONB DEFAULT '{}'::jsonb, -- e.g. {"ig_reel": 500, "yt_dedicated": 2000}
    stats_cache JSONB DEFAULT '{}'::jsonb, -- e.g. {"subscribers": 150000, "engagement_rate": 0.048}
    profile_embedding vector(1536), -- Vector embedding for aesthetic & vibe matching
    ai_brand_safety_score NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
    is_open_for_collabs BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Cosine similarity index for fast pgvector search
CREATE INDEX idx_creator_profile_embedding ON creator_profiles 
USING hnsw (profile_embedding vector_cosine_ops);

-- 8. Agency Manager Assignments
CREATE TABLE manager_creator_roster (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    creator_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    authorization_contract_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(manager_user_id, creator_user_id)
);

-- 9. Campaigns & Events
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    created_by_rep_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_walk_in_event BOOLEAN DEFAULT FALSE NOT NULL,
    event_location_address TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    target_niches TEXT[] DEFAULT '{}',
    required_platforms TEXT[] DEFAULT '{}',
    budget_min NUMERIC(12, 2),
    budget_max NUMERIC(12, 2),
    ai_brief_score NUMERIC(5, 2), -- Scored 0-100 by Pre-Launch Brief Grader
    ai_brief_feedback JSONB DEFAULT '{}'::jsonb,
    status campaign_status DEFAULT 'ACTIVE' NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. Connection Requests & Deal Pipeline
CREATE TABLE connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    assigned_rep_id UUID NOT NULL REFERENCES users(id),
    creator_user_id UUID NOT NULL REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    custom_pitch TEXT, -- Pre-filled by AI Personalized Outreach Generator
    status VARCHAR(32) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 11. Real-Time Conversations & Messages with Strict Rep Ownership
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    assigned_rep_id UUID NOT NULL REFERENCES users(id),
    creator_user_id UUID NOT NULL REFERENCES users(id),
    connection_id UUID UNIQUE REFERENCES connection_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 12. Cached AI Thread Summaries (Role-Aware Storage)
CREATE TABLE conversation_ai_summaries (
    conversation_id UUID PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
    last_message_id UUID REFERENCES messages(id),
    rep_view_summary JSONB NOT NULL,     -- Full POI context for Creator & Assigned Rep
    manager_view_summary JSONB NOT NULL, -- PII-masked context for Talent Managers
    pending_blockers TEXT[] DEFAULT '{}',
    extracted_terms JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 13. Competitor Sponsorship Intelligence Radar
CREATE TABLE competitor_sponsorship_radar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    competitor_brand_name VARCHAR(128) NOT NULL,
    platform VARCHAR(32) NOT NULL, -- 'YOUTUBE', 'INSTAGRAM'
    post_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    detected_via VARCHAR(64) DEFAULT 'HASHTAG_AD_SCAN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 14. Legal Contracts & Milestone Tracking
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id),
    branch_id UUID NOT NULL REFERENCES organization_branches(id),
    assigned_rep_id UUID NOT NULL REFERENCES users(id),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    total_amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'USD' NOT NULL,
    terms_markdown TEXT NOT NULL,
    pdf_document_url TEXT,
    brand_signature_hash VARCHAR(255),
    brand_signed_at TIMESTAMP WITH TIME ZONE,
    creator_signature_hash VARCHAR(255),
    creator_signed_at TIMESTAMP WITH TIME ZONE,
    status deal_status DEFAULT 'PROPOSED' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    deliverable_type VARCHAR(64) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    proof_url TEXT,
    status milestone_status DEFAULT 'PENDING' NOT NULL,
    revision_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 15. Deal Reassignment & Succession Audit Log
CREATE TABLE deal_reassignment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    previous_rep_id UUID NOT NULL REFERENCES users(id),
    new_rep_id UUID NOT NULL REFERENCES users(id),
    reassigned_by_user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    handover_brief_summary JSONB, -- AI-generated transition briefing
    reassigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 16. Hall of Shame Public Directory
CREATE TABLE hall_of_shame (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_user_id UUID NOT NULL REFERENCES users(id),
    reporter_user_id UUID NOT NULL REFERENCES users(id),
    contract_id UUID REFERENCES contracts(id),
    organization_id UUID REFERENCES enterprise_organizations(id),
    offense_category VARCHAR(64) NOT NULL,
    total_claim_value NUMERIC(12, 2),
    summary_of_breach TEXT NOT NULL,
    ai_evidence_timeline JSONB, -- AI-generated neutral chronological breakdown
    evidence_document_urls TEXT[] DEFAULT '{}',
    adjudicated_by UUID NOT NULL REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--------------------------------------------------------------------------------
-- POSTGRESQL ROW-LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------------------------------
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_ai_summaries ENABLE ROW LEVEL SECURITY;

-- 1. Conversation Read/Write Policy
CREATE POLICY conversation_access_policy ON conversations
    FOR ALL
    USING (
        assigned_rep_id = auth.uid() OR
        creator_user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM manager_creator_roster mcr
            WHERE mcr.creator_user_id = conversations.creator_user_id 
              AND mcr.manager_user_id = auth.uid()
              AND mcr.is_active = TRUE
        ) OR
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() AND u.role = 'PLATFORM_ADMIN'
        )
    );

-- 2. Message Read/Write Policy
CREATE POLICY message_access_policy ON messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = messages.conversation_id
              AND (
                c.assigned_rep_id = auth.uid() OR 
                c.creator_user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM manager_creator_roster mcr
                    WHERE mcr.creator_user_id = c.creator_user_id 
                      AND mcr.manager_user_id = auth.uid()
                      AND mcr.is_active = TRUE
                ) OR
                EXISTS (
                    SELECT 1 FROM users u
                    WHERE u.id = auth.uid() AND u.role = 'PLATFORM_ADMIN'
                )
              )
        )
    );

-- 3. AI Summaries Read Policy: Matches Conversation RLS (No Peer Rep Snooping)
CREATE POLICY ai_summary_access_policy ON conversation_ai_summaries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_ai_summaries.conversation_id
              AND (
                c.assigned_rep_id = auth.uid() OR 
                c.creator_user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM manager_creator_roster mcr
                    WHERE mcr.creator_user_id = c.creator_user_id 
                      AND mcr.manager_user_id = auth.uid()
                      AND mcr.is_active = TRUE
                )
              )
        )
    );
```

---

## 7. REST & WebSocket API Contracts

### 7.1 Core REST Endpoints

```
Authentication & Verification:
POST   /api/v1/auth/register                   --> Register email/mobile/role
POST   /api/v1/auth/verify-otp                 --> Validate phone/email OTP
POST   /api/v1/verification/phase-1/init       --> Generate nonce & pre-signed S3 video URL
POST   /api/v1/verification/phase-1/submit     --> Submit video & trigger Whisper ASR check
GET    /api/v1/admin/verification/queue        --> [Admin] View pending Phase 2 requests
POST   /api/v1/admin/verification/decision     --> [Admin] Approve/Reject with reasoning

Enterprise Org & Multi-Branch Management (Head Account):
GET    /api/v1/orgs/my-org                     --> [Head] Get enterprise profile & budget pool
POST   /api/v1/orgs/branches                   --> [Head] Create new regional branch
GET    /api/v1/orgs/branches                   --> [Head/Mgr] List branches and spending
POST   /api/v1/orgs/members/invite             --> [Head/Mgr] Invite sales rep to a branch
PATCH  /api/v1/orgs/members/:id/status         --> [Head/Mgr] Deactivate/activate representative
POST   /api/v1/orgs/deals/:id/reassign         --> [Head/Mgr] Reassign deal from Rep A to Rep B with AI brief
GET    /api/v1/orgs/analytics/global           --> [Head] Aggregated spend & performance metrics
GET    /api/v1/orgs/analytics/rival-intel      --> [Head/Mgr] Competitor sponsorships & rate benchmarks

AI-Powered Marketplace & Search:
POST   /api/v1/marketplace/ai-search           --> Natural language prompt -> Vector + SQL filter results
GET    /api/v1/creators                        --> Structured search with pgvector similarity
POST   /api/v1/campaigns/ai-analyze            --> Pre-launch brief grader (0-100) & conflict check
POST   /api/v1/copilot/outreach-pitch          --> [Rep] AI personalized connection pitch generator
POST   /api/v1/copilot/counter-offer           --> [Creator] AI smart counter-offer generator
POST   /api/v1/copilot/collab-ideas            --> [Creator] Collab Tab peer barter concept generator

Negotiations & Isolated Deals with AI:
GET    /api/v1/conversations/my-chats          --> [Rep/Creator] Fetch only my isolated conversations
GET    /api/v1/conversations/:id/messages      --> Fetch messages (strictly guarded by RLS)
POST   /api/v1/conversations/:id/messages      --> Send message
POST   /api/v1/conversations/:id/ai-summarize  --> Generates/fetches role-masked chat summary
POST   /api/v1/conversations/:id/ai-extract    --> Extracts chat terms into a pre-filled Contract draft JSON
POST   /api/v1/contracts/generate              --> Create standardized legal PDF draft
POST   /api/v1/contracts/:id/sign              --> Cryptographically sign contract
POST   /api/v1/milestones/:id/submit-proof     --> Submit deliverable live link/file

Trust & Hall of Shame:
POST   /api/v1/disputes/file                   --> Open breach of contract claim
GET    /api/v1/hall-of-shame                   --> View public blacklisted entities
```

### 7.2 Sample Payload: AI Natural Language Search (`POST /api/v1/marketplace/ai-search`)

**Request**:
```json
{
  "prompt": "Find Indian tech or fintech creators who do 60s YouTube integrations under $2,000 with >4% engagement and a cinematic storytelling vibe",
  "branchId": "9b12a884-3c41-4fb2-8d72-9fa055018a33"
}
```

**Response**:
```json
{
  "parsedFilters": {
    "niches": ["tech", "fintech"],
    "countryCode": "IN",
    "deliverableFormat": "yt_integrated_60s",
    "maxRate": 2000.00,
    "minEngagementRate": 0.04
  },
  "appliedAestheticKeywords": ["cinematic storytelling", "minimalist"],
  "totalMatches": 8,
  "creators": [
    {
      "id": "e4293f01-52a1-4328-8d99-563b71ca8401",
      "displayName": "Rohan Tech Studio",
      "handle": "@rohan_tech",
      "subscribers": 240000,
      "engagementRate": 0.052,
      "rateForRequestedFormat": 1800.00,
      "aiBrandSafetyScore": 96.50,
      "vibeMatchScore": 0.92,
      "aiMatchReason": "Matches high engagement in Indian fintech; portfolio videos feature cinematic B-roll and narrative review pacing.",
      "internalCollisionNotice": {
        "hasPriorCompanyDeal": true,
        "branchName": "APAC - Mumbai",
        "historicalRate": 1750.00
      }
    }
  ]
}
```

### 7.3 Sample Payload: "Chat-to-Contract" Extractor (`POST /api/v1/conversations/:id/ai-extract`)

**Response**:
```json
{
  "confidenceScore": 0.98,
  "contractDraftPayload": {
    "campaignId": "f78a2211-5dc0-449a-bdfb-8d19762fa490",
    "totalAmount": 2500.00,
    "currency": "USD",
    "milestones": [
      {
        "title": "First Draft Video Review",
        "deliverableType": "UNLISTED_YOUTUBE_LINK",
        "amount": 0.00,
        "dueDate": "2026-11-12T18:00:00Z"
      },
      {
        "title": "Final 60s Dedicated Integration Goes Live",
        "deliverableType": "PUBLIC_YOUTUBE_INTEGRATION",
        "amount": 2500.00,
        "dueDate": "2026-11-18T18:00:00Z"
      }
    ],
    "terms": {
      "exclusivityDays": 30,
      "maxRevisionRounds": 2,
      "includesGiftedProduct": true,
      "paymentReleaseTrigger": "INSPECTION_48H_OR_MANUAL_APPROVAL"
    }
  }
}
```

---

## 8. Frontend Engineering & UX Specifications

The frontend client is implemented with **Next.js 14+ (App Router)** for the web application and **React Native / Expo** for mobile.

### 8.1 Key Application Routes

| Path | User Persona | Layout & Functionality |
| :--- | :--- | :--- |
| `/` | Public | Landing page detailing anti-scam mission, verified badges, and dual onboarding CTAs. |
| `/onboarding/verify` | All | Multi-step interactive verification wizard: Nonce recording -> Whisper audio status -> OTPs. |
| `/enterprise/dashboard` | **Company Head Account** | Executive Hub: Branch switcher, budget allocations, team directory, and **Rival Intelligence Widget**. |
| `/feed` | Creator / Sales Rep | **AI Natural Language Search Bar**: Filter chips pop into place as the user types; displays creator cards with vibe match scores. |
| `/collab` | Creator | Peer-to-peer creator search grid with **AI Peer Barter Concept Generator**. |
| `/messages` | Creator / Sales Rep | **Isolated Deal Room**: Two-pane messenger with **"✨ Summarize"** and **"✨ Extract Contract"** buttons in the header. |
| `/calendar` | Creator / Sales Rep | Deliverables tracker with milestone due dates, draft reviews, and live post dates. |
| `/deals/:id` | Creator / Sales Rep | Deal Room: Milestone status board, contract PDF previewer, e-signature canvas, and proof upload terminal. |
| `/hall-of-shame` | Public | Public transparency ledger of adjudicated contract breaches with AI dispute timelines. |

### 8.2 Three High-Visibility UI Moments ("Hackathon Jeeto Yojna")

#### Visual Moment 1: Natural Language Search with Animated Chips
```tsx
// Interactive Search Bar with Auto-Expanding Badges
export function AISearchBar({ onFilterParsed }: SearchProps) {
  const [query, setQuery] = useState('');
  const [activeChips, setActiveChips] = useState<string[]>([]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2 p-2 border rounded-full shadow-sm bg-background">
        <Sparkles className="w-5 h-5 text-primary animate-pulse ml-3" />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Find Indian fintech creators with >4% engagement under $2,000..."
          className="flex-1 bg-transparent border-none outline-none text-sm px-2"
        />
        <Button size="sm" className="rounded-full">Search</Button>
      </div>
      {/* Animated Filter Chips popping into place */}
      <div className="flex flex-wrap gap-2 mt-2">
        {activeChips.map((chip) => (
          <Badge key={chip} variant="secondary" className="animate-in fade-in zoom-in-95">
            {chip}
          </Badge>
        ))}
      </div>
    </div>
  );
}
```

#### Visual Moment 2: "✨ Summarize & Auto-Draft" Action Drawer in Deal Room
```tsx
// Deal Room Header Actions
export function DealRoomHeader({ conversationId, userRole }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-between border-b p-4">
      <h3 className="font-semibold text-lg">Deal Negotiation</h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => handleSummarize(userRole)}>
          <Sparkles className="w-4 h-4 mr-1 text-blue-500" />
          Summarize Thread
        </Button>
        <Button size="sm" onClick={handleExtractContract} className="bg-emerald-600 hover:bg-emerald-700">
          <FileSignature className="w-4 h-4 mr-1" />
          Extract to Contract
        </Button>
      </div>
    </div>
  );
}
```

#### Visual Moment 3: Zero-Knowledge Collision & Rival Alert Banner
```tsx
// Contextual Alert on Creator Profile
export function CreatorIntelligenceBanner({ collisionData, rivalAlert }: Props) {
  return (
    <div className="space-y-2 mb-4">
      {collisionData && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">Internal Cross-Branch Alert</AlertTitle>
          <AlertDescription className="text-xs text-amber-700">
            {collisionData.branchName} previously worked with this creator at ~${collisionData.historicalRate}. 
            Avoid internal bidding wars.
          </AlertDescription>
        </Alert>
      )}
      {rivalAlert && (
        <Alert className="border-rose-500/50 bg-rose-500/10">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <AlertTitle className="text-rose-800 font-semibold">Exclusivity Warning</AlertTitle>
          <AlertDescription className="text-xs text-rose-700">
            This creator published a sponsored post for rival brand <strong>{rivalAlert.brand}</strong> {rivalAlert.daysAgo} days ago.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

## 9. Phased Implementation Roadmap ("Hackathon Jeeto Yojna")

To deliver maximum impact rapidly—especially in competitive hackathon or rapid go-to-market cycles—the development is organized into three targeted phases following the **"Hackathon Jeeto Yojna"** principles.

```mermaid
timeline
    title Execution Blueprint (Hackathon to Production)
    Phase 1 : Priority No. 1 (Motion UX & Visual Polish)
            : High-fidelity Figma / Framer interactions
            : Animated NL Search bar with popping filter chips
            : Priority No. 2 (Bulletproof Working Loop)
            : Role selection -> Verification UI -> Feed -> Chat -> Deal Signing
            : ✨ In-Chat Summarize & One-Click Contract Auto-Draft
            : Zero-Knowledge Internal Collision & Rival Alert Badges
            : Priority No. 3 (Curated Seed Data)
            : 30+ verified creators with real portfolios & rate cards
    Phase 2 : Backend Hardening
            : PostgreSQL 16 + pgvector HNSW indexing
            : Row-Level Security (RLS) enforcement on chats & summaries
            : Whisper ASR worker for Phase-1 liveness audio check
            : Dynamic legal PDF generation with SHA-256 hashes
    Phase 3 : Production & Compliance
            : Stripe Connect / Escrow payment rail integration
            : Automated Meta Graph / YouTube OAuth metric sync
            : Admin Tribunal workflow & Hall of Shame automation
            : Mobile App packaging for iOS & Android
```

### Phase 1: MVP Core Loop (Hackathon Winning Strategy)
- **Top Priority 1 (Motion & Smooth UX)**: Seamless transitions using Framer Motion, clean typography (Inter / Geist), and dark/light mode polish.
- **Top Priority 2 (Bulletproof Functional Journey)**:
  1. User selects role: Switch between Creator, Sales Rep A, and Company Head Account.
  2. Experience the 2-Phase verification preview (Whisper audio nonce check).
  3. Interactive Home Feed: Type natural language query in search bar -> watch filter chips animate into place.
  4. Real-time negotiation chat between Creator and Brand Rep A.
  5. Click **"✨ Summarize Thread"** to see instant structured bullet points (with privacy masking for managers).
  6. Click **"✨ Extract to Contract"** to populate the ready-to-sign legal PDF agreement in 2 seconds.
  7. Open Creator Profile to view the **Internal Collision & Rival Alert Banner**.
  8. Switch to Brand Rep B: Show that Rep B's inbox has **Zero Access (403)** to Rep A's conversation.
- **Top Priority 3 (Realistic Seed Data)**: Pre-seed 30+ authentic niche creators, rate cards, sample video pitches, and active brand campaigns across branches.

### Phase 2: Production Backend Infrastructure
- Deploy core Node.js/Express API with PostgreSQL on Supabase or Neon.
- Enable PostgreSQL Row-Level Security (RLS) on `conversations`, `messages`, and `conversation_ai_summaries`.
- Implement BullMQ workers for video transcoding, Whisper transcription, and vector embedding generation.
- Configure AWS S3 bucket policies with strict CORS and pre-signed upload TTLs.

### Phase 3: Financial Rails & Scaled Verification
- Integrate Escrow payment gateway (Stripe Connect custom accounts or Razorpay Route).
- Formalize legal agreement templates with jurisdiction-specific disclaimers.
- Launch the public Hall of Shame dispute arbitration panel.

---

## 10. Security, Compliance & Anti-Abuse Engineering

1. **Strict Peer Chat Isolation via Row-Level Security (RLS)**:
   * Chat privacy is enforced at the PostgreSQL database engine level using RLS, not merely in application logic. Even if an API route fails to include a `WHERE assigned_rep_id = ?` clause, PostgreSQL automatically filters out messages from unauthorized peer representatives.
2. **AI Privacy & Zero PII Leakage Guardrail**:
   * All conversation histories pass through the `RBAC Data Masking Engine` before reaching LLM prompt contexts. Talent Managers never receive Brand Rep personal details in generated summaries.
   * Cached summaries in `conversation_ai_summaries` carry strict RLS policies matching `conversations`.
3. **Anti-Deepfake Nonce Generation & Whisper ASR Validation**:
   * Verification nonces are computed on the server using `crypto.randomBytes(32)` concatenated with a 15-minute epoch timestamp.
   * Uploaded videos must be submitted within 10 minutes of nonce issuance. Whisper ASR transcribes the audio stream to match the exact 6-word phrase before Phase 2 admin review.
4. **Data Protection & Legal Disclaimer**:
   * The platform enforces a clear disclaimer during Phase 2 onboarding:
     > *"CollaboNet provides verified identity matching, cryptographic document execution, and reputation arbitration. Users remain independently responsible for campaign content compliance, tax reporting, and platform terms of service adherence."*
5. **Audit Trail Immutability**:
   * All deal reassignments, contract revisions, signature hashes, milestone approvals, and dispute decisions write to an append-only `audit_logs` table protected against manual updates.

---

## 11. Appendix: Getting Started & Local Development

### 11.1 Prerequisites
- Node.js 20+ (LTS)
- Docker & Docker Compose (for PostgreSQL 16 with `pgvector` & Redis)
- Git

### 11.2 Environment Variables (`.env.example`)
```env
# Database (PostgreSQL with pgvector)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collabonet?schema=public"
REDIS_URL="redis://localhost:6379"

# AI & LLM Services
OPENAI_API_KEY="sk-proj-..."
GEMINI_API_KEY="AIzaSy..."

# Security
JWT_SECRET="super-secret-jwt-key-change-in-production"
SESSION_SECRET="session-secret-key"

# Storage (AWS S3 or Cloudflare R2)
S3_BUCKET_NAME="collabonet-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"

# Integrations
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
```

### 11.3 Quickstart Commands
```bash
# Clone and enter directory
cd /home/starz/clones/collabonet

# Spin up local PostgreSQL (with pgvector) and Redis containers
docker run --name collabonet-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=collabonet \
  -p 5432:5432 \
  -d pgvector/pgvector:pg16

docker run --name collabonet-redis -p 6379:6379 -d redis:7-alpine

# Initialize Node project / Next.js
npm install
```
