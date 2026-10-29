# CollaboNet — Comprehensive Feature Specification

> **System**: Trust & Management Operating System for Social Media Agencies, Creators, and Brand Sponsors  
> **Document Purpose**: Complete Feature Inventory, Role Mapping, and Detailed Functional Specifications  
> **Status**: Ready for Review & Discussion  

---

## 1. Feature Matrix by User Persona

| Feature Module | Creator | Talent Manager | Brand Sales Rep | Brand Head Admin | Platform Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **1. Multi-Persona Switcher & Auth** | View as Creator | View as Manager | View as Rep A/B | Executive View | Audit View |
| **2. Two-Phase Trust Verification** | Submit Nonce Clip | Submit Agency Roster | Domain Check | Branch Governance | Approve / Reject |
| **3. Smart Discovery & NL Search** | View Campaigns | Pitch Roster | Search Creators | Org Discovery | Monitor Listings |
| **4. Isolated Deal Rooms** | Direct Chat | Masked POI Chat | Isolated Fenced Chat | Audit Deal Status | Dispute Discovery |
| **5. In-Chat AI Copilots** | Counter-Offer Bot | Masked Summary | Pitch Generator | High-Level Rollup | — |
| **6. Zero-Knowledge Collision Radar** | — | — | Active Alert | Cross-Branch View | — |
| **7. Chat-to-Contract & E-Sign** | Draw/Type Sign | Review Terms | Extract & Counter-Sign | Approve Budget | Audit Hashes |
| **8. Deliverables & Calendar** | Submit Proofs | Track Deadlines | Review & Approve | Milestone Rollup | Verify Proofs |
| **9. Peer Collab Generator** | Match Creators | Cross-Pitch | — | — | — |
| **10. "Hall of Shame" Public Ledger** | Report Scammer | Report Defaulter | Report Breach | Protect Brand | Arbitrate & Publish |

---

## 2. Detailed Functional Breakdown

### Feature 1: Multi-Persona Authentication & Role Switcher
- **Objective**: Allow seamless testing and role-specific workflows across all five platform personas without logging in and out.
- **Key Capabilities**:
  - Global Header Switcher with one-click toggles: `CREATOR`, `SALES_REP_A`, `SALES_REP_B`, `TALENT_MANAGER`, `COMPANY_HEAD_ADMIN`, and `PLATFORM_ADMIN`.
  - Dynamic UI re-rendering: Navigation menus, access permissions, and data fencing immediately adjust based on the active role badge.
  - Manager declaration flag during onboarding: requires agencies to declare representation vs. solo creators.

---

### Feature 2: Two-Phase Zero-Trust Verification Pipeline
- **Objective**: Completely eradicate middleman impersonation, ghost accounts, and fee skimming.
- **Workflow**:
  1. **Phase 1 (Automated Verification)**:
     - User requests a dynamic 6-word session nonce (e.g. `"CollaboNet verify handle @techlead on 2026-10-30"`).
     - Browser accesses webcam via `MediaRecorder` API; user records a 10-second proof video speaking the nonce.
     - Automated Whisper ASR transcribes the audio and checks phrase similarity against the issued nonce.
  2. **Phase 2 (Human-in-the-Loop Admin Queue)**:
     - Review queue at `/admin/verification-queue` displays applicant profile, social proof, and recorded clip.
     - Admin approves or rejects with feedback note.
     - Upon approval, user profile receives verified checkmark and full marketplace/messaging privileges.

---

### Feature 3: Smart Marketplace & Natural Language Search
- **Objective**: Enable brand sponsors to find the exact creator for their campaign in seconds.
- **Key Capabilities**:
  - **Natural Language Search Input**: Accepts freeform text such as:  
    *"Find Indian tech creators with over 100k followers under $2,500 budget."*
  - **Animated Filter Chips**: Extracted criteria dynamically pop onto the screen as interactive tags (e.g., `[Niche: Tech]`, `[Location: India]`, `[Max Rate: $2,500]`, `[Min Followers: 100K]`).
  - **Structured Filter Sidebar**: Direct manual toggles for Platform (YouTube, Instagram, TikTok, X), Niche categories, and Price tiers.
  - **Creator Profile Card & Drawer**: Displays verified badges, primary platform stats, engagement metrics, past brand collaborations, and instant *"Start Deal"* action.

---

### Feature 4: Isolated Deal Rooms & Real-Time Messaging System
- **Objective**: Provide structured, scam-proof real-time negotiation spaces while preserving enterprise privacy and enforcing granular RBAC.
- **Key Capabilities**:
  - **Activity-Stream Style Deal Room**: Clean Linear-inspired messaging layout showing chat bubbles, inline milestone alerts, and contract status cards.
  - **Strict Peer Rep Fencing (RBAC)**: Sales Rep A and Sales Rep B cannot view or join each other's conversations, even within the same corporate domain. Enforced directly at the MongoDB query layer (`conversation.repId == currentUser.id`).
  - **Talent Manager POI Masking (RBAC)**: When a Talent Manager negotiates on behalf of a creator, personal brand contact details (email, phone, direct name) are masked to general enterprise metadata (e.g., *"Enterprise Brand POC"*), preventing unapproved creator poaching.
  - **Anti-Scam PII & Payment Interceptor**: Real-time regex filter detects unauthorized off-platform payment links (wire details, telegram handles, unapproved crypto wallets) and displays instant warning banners.
  - **Live Typing & Status Updates**: Bi-directional real-time updates via WebSockets/SSE with optimistic UI updates powered by React 19.

---

### Feature 5: In-Chat AI Deal Copilots (Powered by OpenRouter API)
- **Objective**: Automate deal negotiation, accelerate agreement formulation, and protect deal privacy via OpenRouter's multi-model AI routing.
- **Key Capabilities**:
  - **Universal OpenRouter Integration**: Uses OpenRouter API to route tasks to optimal models (e.g. Claude 3.5 Sonnet for legal contract structuring, Gemini 1.5 / GPT-4o for lightning-fast chat summarization).
  - **✨ Summarize Thread**: Synthesizes negotiation state into a 3-bullet brief (Agreed deliverables, Proposed budget, Pending terms). Managers receive a PII-sanitized summary.
  - **✨ Chat-to-Contract Extractor**: Parses conversation history and generates a fully formed legal contract draft (title, deliverables, payment milestones, due dates) in one click.
  - **Personalized Outreach Generator**: Suggests hyper-relevant campaign pitches based on creator niche and past sponsorship track record.
  - **Smart Counter-Offer Calculator**: Recommends commercially viable counter-proposals based on market rates.
  - **Deterministic Offline Fallback**: Heuristic regex rules extract dates, deliverables, and budgets locally when API keys are unconfigured or during upstream network outages.

---

### Feature 6: Enterprise Multi-Branch Governance & Zero-Knowledge Collision Radar
- **Objective**: Prevent multi-branch enterprises from bidding against each other for the same talent.
- **Key Capabilities**:
  - **Collision Radar Banner**: When Rep A opens a deal room with a creator who is already in active negotiations with Rep B (from another regional branch), a prominent warning badge alerts:  
    *⚠️ Internal Collision Detected: APAC Branch is also negotiating with this creator.*
  - **Zero-Knowledge Privacy**: Transcripts and proposed amounts remain 100% confidential between reps; only the collision alert is revealed.
  - **Head Admin Dashboard**: Enterprise overview of regional branch spend, team member allocations, and zero-downtime deal reassignment if a representative departs.

---

### Feature 7: Digital E-Signing & Cryptographic Milestone Escrow
- **Objective**: Transform casual chat agreements into legally enforceable digital contracts with locked funds.
- **Key Capabilities**:
  - **PDF Agreement Generator**: Automatically builds standardized agency contracts formatted with legal definitions, deliverable tables, and IP terms.
  - **SHA-256 Tamper-Proof Hashing**: Generated contract file is cryptographically hashed; any modification invalidates the checksum stored in the deal ledger.
  - **HTML5 Canvas E-Signature**: Both parties sign directly in the browser (draw signature or type with custom font) along with recorded signer UUID, client IP, and UTC timestamp.
  - **Milestone Escrow State Lock**: Contract locks into `CONTRACT_SIGNED`; sponsor deposits campaign budget into escrow before production commences.

---

### Feature 8: Deliverables Fulfillment Pipeline & Unified Event Calendar
- **Objective**: Provide milestone tracking with automated proof verification before escrow payout.
- **Workflow Steps**:
  1. **Milestone 1 (Creative Script / Outline)**: Creator uploads draft $\to$ Sponsor clicks Approve or Request Changes.
  2. **Milestone 2 (Rough Cut Video Preview)**: Creator provides preview asset link $\to$ Sponsor approves editing.
  3. **Milestone 3 (Live Post Verification)**: Creator inputs published live URL (YouTube/Instagram) $\to$ System validates post availability $\to$ Escrow funds unlocked for creator payout.
  4. **Deliverables Calendar**: Unified visual scheduler for scheduled content dates, campaign milestones, and brand preview walk-in events.

---

### Feature 9: Creator-to-Creator Peer Collab Generator
- **Objective**: Facilitate organic creator-to-creator collaborations without agency red tape.
- **Key Capabilities**:
  - Dedicated Collab tab for verified talent.
  - Filter peers by subscriber tiers, content themes, and geographic location.
  - **AI Collab Concept Generator**: Proposes co-production ideas (e.g., *"Tech Reviewer X vs. Gaming Streamer Y: Building the Ultimate $5,000 Gaming Rig"*).
  - Mutual invitation exchange and synchronized shared milestones.

---

### Feature 10: "Hall of Shame" Public Fraud Registry
- **Objective**: Eliminate scams, payment defaults, and rogue mediators through radical public accountability.
- **Key Capabilities**:
  - **Evidentiary Dispute Submission**: Aggrieved party uploads breached contract, chat log hashes, and unfulfilled deliverable proof.
  - **72-Hour Arbitration Queue**: Platform admin reviews counter-evidence from the accused party.
  - **Public Exposure Registry (`/hall-of-shame`)**: Confirmed offenders are permanently tagged with real names, business registration, known social handles, and redacted evidentiary audit documents.
  - Searchable and indexed to protect the wider creator and brand community from recurring scammers.
