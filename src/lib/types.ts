// CollaboNet Core Type Definitions

export type UserRole =
  | 'CREATOR'
  | 'TALENT_MANAGER'
  | 'COMPANY_HEAD_ADMIN'
  | 'BRANCH_MANAGER'
  | 'SALES_REPRESENTATIVE'
  | 'PLATFORM_ADMIN';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING_PHASE_1'
  | 'PENDING_PHASE_2'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type DealStatus =
  | 'PROPOSED'
  | 'NEGOTIATING'
  | 'CONTRACT_PENDING'
  | 'ACTIVE_IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

export type MilestoneStatus = 'PENDING' | 'SUBMITTED' | 'REVISION_REQUESTED' | 'APPROVED' | 'PAID';

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  isManager: boolean;
  name: string;
  createdAt: string;
}

export interface EnterpriseOrganization {
  id: string;
  legalName: string;
  tradeName: string;
  registrationNumber: string;
  corporateDomain: string;
  headUserId: string;
  billingPoolBalance: number;
  competitorKeywords: string[];
  createdAt: string;
}

export interface OrganizationBranch {
  id: string;
  organizationId: string;
  branchName: string;
  locationCity: string;
  locationCountry: string;
  monthlyBudgetAllocation: number;
  spentThisMonth: number;
  managerUserId?: string;
  createdAt: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  bio: string;
  pitchText: string;
  primaryNiche: string;
  secondaryNiches: string[];
  countryCode: string;
  city: string;
  rates: {
    ig_reel?: number;
    ig_story?: number;
    yt_dedicated?: number;
    yt_integrated_60s?: number;
    [key: string]: number | undefined;
  };
  statsCache: {
    subscribers: number;
    avgViews: number;
    engagementRate: number;
    platform: 'youtube' | 'instagram' | 'both';
  };
  vibeTags: string[];
  aiBrandSafetyScore: number;
  isOpenForCollabs: boolean;
  avatarUrl?: string;
  portfolioSamples: Array<{
    title: string;
    views: string;
    url: string;
  }>;
}

export interface Campaign {
  id: string;
  organizationId: string;
  branchId: string;
  createdByRepId: string;
  title: string;
  description: string;
  isWalkInEvent: boolean;
  eventLocationAddress?: string;
  eventDate?: string;
  targetNiches: string[];
  requiredPlatforms: string[];
  budgetMin: number;
  budgetMax: number;
  aiBriefScore?: number;
  aiBriefFeedback?: string;
  status: CampaignStatus;
  deadline: string;
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  organizationId: string;
  branchId: string;
  assignedRepId: string;
  creatorUserId: string;
  campaignId?: string;
  customPitch: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: Array<{ type: string; url: string; name: string }>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  assignedRepId: string;
  assignedRepName: string;
  assignedRepEmail: string;
  creatorUserId: string;
  creatorDisplayName: string;
  creatorHandle: string;
  creatorProfileId: string;
  campaignTitle?: string;
  lastMessageSnippet: string;
  updatedAt: string;
}

export interface ConversationAISummary {
  conversationId: string;
  lastMessageId?: string;
  repViewSummary: {
    offerStatus: string;
    deliverables: string[];
    timeline: string;
    budget: string;
    repPOI: {
      name: string;
      email: string;
      branch: string;
    };
  };
  managerViewSummary: {
    offerStatus: string;
    deliverables: string[];
    timeline: string;
    budget: string;
    maskedCompanyEntity: string; // "Nike Enterprise - APAC Representative"
  };
  pendingBlockers: string[];
  extractedTerms: {
    totalAmount: number;
    currency: string;
    deliverables: Array<{
      title: string;
      deliverableType: string;
      amount: number;
      dueDate: string;
    }>;
    terms: {
      exclusivityDays: number;
      maxRevisionRounds: number;
      includesGiftedProduct: boolean;
    };
  };
}

export interface CompetitorRadarEntry {
  id: string;
  creatorId: string;
  competitorBrandName: string;
  platform: 'YOUTUBE' | 'INSTAGRAM';
  postUrl: string;
  publishedAt: string;
  detectedVia: string;
  exclusivityDaysRemaining?: number;
}

export interface ContractMilestone {
  id: string;
  contractId: string;
  title: string;
  deliverableType: string;
  amount: number;
  dueDate: string;
  proofUrl?: string;
  proofDescription?: string;
  status: MilestoneStatus;
  revisionCount: number;
  approvedAt?: string;
}

export interface Contract {
  id: string;
  campaignId?: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  assignedRepId: string;
  assignedRepName: string;
  creatorId: string;
  creatorDisplayName: string;
  creatorHandle: string;
  totalAmount: number;
  currency: string;
  termsMarkdown: string;
  pdfDocumentUrl?: string;
  brandSignatureHash?: string;
  brandSignedAt?: string;
  creatorSignatureHash?: string;
  creatorSignedAt?: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
  milestones: ContractMilestone[];
}

export interface DealReassignmentLog {
  id: string;
  conversationId: string;
  previousRepId: string;
  previousRepName: string;
  newRepId: string;
  newRepName: string;
  reassignedByUserId: string;
  reassignedByName: string;
  reason: string;
  handoverBriefSummary: {
    dealStage: string;
    keyAgreements: string[];
    immediateActionItems: string[];
    cautionNotes: string;
  };
  reassignedAt: string;
}

export interface HallOfShameEntry {
  id: string;
  offenderUserId: string;
  offenderName: string;
  offenderHandle: string;
  offenderType: 'CREATOR' | 'BRAND_AGENCY';
  reporterUserId: string;
  reporterName: string;
  offenseCategory: string;
  totalClaimValue: number;
  summaryOfBreach: string;
  aiEvidenceTimeline: Array<{
    date: string;
    event: string;
    verifiedProof: string;
  }>;
  evidenceDocumentUrls: string[];
  adjudicatedBy: string;
  publishedAt: string;
}
