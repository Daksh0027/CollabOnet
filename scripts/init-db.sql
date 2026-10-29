-- ============================================================================
-- CollaboNet PostgreSQL 16 Schema (with pgvector & Row-Level Security)
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";      -- pgvector for semantic search & vibe matching
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- Trigram matching for fast text search

-- 2. Enums for Type Safety & RBAC
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'CREATOR', 
        'TALENT_MANAGER', 
        'COMPANY_HEAD_ADMIN', 
        'BRANCH_MANAGER', 
        'SALES_REPRESENTATIVE', 
        'PLATFORM_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'UNVERIFIED', 
        'PENDING_PHASE_1', 
        'PENDING_PHASE_2', 
        'VERIFIED', 
        'REJECTED', 
        'SUSPENDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE deal_status AS ENUM ('PROPOSED', 'NEGOTIATING', 'CONTRACT_PENDING', 'ACTIVE_IN_PROGRESS', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status AS ENUM ('PENDING', 'SUBMITTED', 'REVISION_REQUESTED', 'APPROVED', 'PAID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Users Table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS enterprise_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(128),
    registration_number VARCHAR(64) UNIQUE NOT NULL,
    corporate_domain VARCHAR(255) UNIQUE NOT NULL,
    head_user_id UUID NOT NULL REFERENCES users(id),
    billing_pool_balance NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    competitor_keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Regional Branches / Workspaces (e.g. Nike APAC, Nike NA)
CREATE TABLE IF NOT EXISTS organization_branches (
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
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Creator Profiles with pgvector Embeddings & Brand Safety
CREATE TABLE IF NOT EXISTS creator_profiles (
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
    rates JSONB DEFAULT '{}'::jsonb,
    stats_cache JSONB DEFAULT '{}'::jsonb,
    profile_embedding vector(1536),
    ai_brand_safety_score NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
    is_open_for_collabs BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_creator_profile_embedding ON creator_profiles 
USING hnsw (profile_embedding vector_cosine_ops);

-- 8. Agency Manager Assignments
CREATE TABLE IF NOT EXISTS manager_creator_roster (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    creator_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    authorization_contract_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(manager_user_id, creator_user_id)
);

-- 9. Campaigns & Events
CREATE TABLE IF NOT EXISTS campaigns (
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
    ai_brief_score NUMERIC(5, 2),
    ai_brief_feedback JSONB DEFAULT '{}'::jsonb,
    status campaign_status DEFAULT 'ACTIVE' NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. Connection Requests & Deal Pipeline
CREATE TABLE IF NOT EXISTS connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    assigned_rep_id UUID NOT NULL REFERENCES users(id),
    creator_user_id UUID NOT NULL REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    custom_pitch TEXT,
    status VARCHAR(32) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 11. Real-Time Conversations & Messages with Strict Rep Ownership
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES enterprise_organizations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES organization_branches(id) ON DELETE CASCADE,
    assigned_rep_id UUID NOT NULL REFERENCES users(id),
    creator_user_id UUID NOT NULL REFERENCES users(id),
    connection_id UUID UNIQUE REFERENCES connection_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 12. Cached AI Thread Summaries (Role-Aware Storage)
CREATE TABLE IF NOT EXISTS conversation_ai_summaries (
    conversation_id UUID PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
    last_message_id UUID REFERENCES messages(id),
    rep_view_summary JSONB NOT NULL,
    manager_view_summary JSONB NOT NULL,
    pending_blockers TEXT[] DEFAULT '{}',
    extracted_terms JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 13. Competitor Sponsorship Intelligence Radar
CREATE TABLE IF NOT EXISTS competitor_sponsorship_radar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    competitor_brand_name VARCHAR(128) NOT NULL,
    platform VARCHAR(32) NOT NULL,
    post_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    detected_via VARCHAR(64) DEFAULT 'HASHTAG_AD_SCAN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 14. Legal Contracts & Milestone Tracking
CREATE TABLE IF NOT EXISTS contracts (
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

CREATE TABLE IF NOT EXISTS milestones (
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
CREATE TABLE IF NOT EXISTS deal_reassignment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    previous_rep_id UUID NOT NULL REFERENCES users(id),
    new_rep_id UUID NOT NULL REFERENCES users(id),
    reassigned_by_user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    handover_brief_summary JSONB,
    reassigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 16. Hall of Shame Public Directory
CREATE TABLE IF NOT EXISTS hall_of_shame (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_user_id UUID NOT NULL REFERENCES users(id),
    reporter_user_id UUID NOT NULL REFERENCES users(id),
    contract_id UUID REFERENCES contracts(id),
    organization_id UUID REFERENCES enterprise_organizations(id),
    offense_category VARCHAR(64) NOT NULL,
    total_claim_value NUMERIC(12, 2),
    summary_of_breach TEXT NOT NULL,
    ai_evidence_timeline JSONB,
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

-- 1. Conversation Access Policy
DO $$ BEGIN
    DROP POLICY IF EXISTS conversation_access_policy ON conversations;
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
EXCEPTION
    WHEN undefined_function THEN null;
END $$;

-- 2. Message Access Policy
DO $$ BEGIN
    DROP POLICY IF EXISTS message_access_policy ON messages;
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
EXCEPTION
    WHEN undefined_function THEN null;
END $$;

-- 3. AI Summaries Read Policy
DO $$ BEGIN
    DROP POLICY IF EXISTS ai_summary_access_policy ON conversation_ai_summaries;
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
EXCEPTION
    WHEN undefined_function THEN null;
END $$;
