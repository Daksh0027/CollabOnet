import {
  SEED_CREATORS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_AI_SUMMARY,
  SEED_INTERNAL_COLLISION_RECORD,
  SEED_COMPETITOR_RADAR,
  SEED_CONTRACTS,
  SEED_BRANCHES,
  SEED_ORGANIZATION,
  SEED_HALL_OF_SHAME,
  SEED_REASSIGNMENT_LOGS,
  SEED_CAMPAIGNS,
} from './store';
import {
  CreatorProfile,
  Conversation,
  Message,
  ConversationAISummary,
  Contract,
  ContractMilestone,
  DealReassignmentLog,
  OrganizationBranch,
  HallOfShameEntry,
  Campaign,
} from './types';

// In-Memory mutable storage initialized with deep clones of seed data
let creators: CreatorProfile[] = JSON.parse(JSON.stringify(SEED_CREATORS));
let conversations: Conversation[] = JSON.parse(JSON.stringify(SEED_CONVERSATIONS));
let messages: Message[] = JSON.parse(JSON.stringify(SEED_MESSAGES));
let contracts: Contract[] = JSON.parse(JSON.stringify(SEED_CONTRACTS));
let branches: OrganizationBranch[] = JSON.parse(JSON.stringify(SEED_BRANCHES));
let campaigns: Campaign[] = JSON.parse(JSON.stringify(SEED_CAMPAIGNS));
let reassignmentLogs: DealReassignmentLog[] = JSON.parse(JSON.stringify(SEED_REASSIGNMENT_LOGS));
let hallOfShameEntries: HallOfShameEntry[] = JSON.parse(JSON.stringify(SEED_HALL_OF_SHAME));
let aiSummaries: Record<string, ConversationAISummary> = {
  conv_alice_rohan: JSON.parse(JSON.stringify(SEED_AI_SUMMARY)),
};

export interface AISearchFilters {
  niches?: string[];
  maxRate?: number;
  minEngagementRate?: number;
  countryCode?: string;
  deliverableFormat?: string;
  aestheticKeywords?: string[];
}

export const DataService = {
  // 1. Marketplace & Search
  getCreators(filters?: AISearchFilters) {
    let results = [...creators];

    if (!filters) return results;

    if (filters.niches && filters.niches.length > 0) {
      const targetNiches = filters.niches.map((n) => n.toLowerCase());
      results = results.filter((c) =>
        targetNiches.includes(c.primaryNiche.toLowerCase()) ||
        c.secondaryNiches.some((sn) => targetNiches.includes(sn.toLowerCase()))
      );
    }

    if (filters.countryCode) {
      results = results.filter((c) => c.countryCode.toLowerCase() === filters.countryCode!.toLowerCase());
    }

    if (filters.maxRate) {
      results = results.filter((c) => {
        const rateToCheck =
          (filters.deliverableFormat && c.rates[filters.deliverableFormat]) ||
          c.rates.yt_integrated_60s ||
          c.rates.ig_reel ||
          999999;
        return rateToCheck <= filters.maxRate!;
      });
    }

    if (filters.minEngagementRate) {
      results = results.filter((c) => c.statsCache.engagementRate >= filters.minEngagementRate!);
    }

    return results;
  },

  getCreatorById(id: string) {
    return creators.find((c) => c.id === id || c.userId === id);
  },

  // 2. Cross-Branch Zero-Knowledge Collision Radar
  getInternalCollisionNotice(creatorId: string, currentBranchId?: string) {
    // If creator is Rohan and checking from non-APAC branch (e.g. NA)
    if (
      creatorId === 'creator_rohan_tech' ||
      creatorId === 'user_creator_rohan'
    ) {
      if (currentBranchId !== 'branch_nike_apac') {
        return {
          hasPriorCompanyDeal: true,
          branchName: SEED_INTERNAL_COLLISION_RECORD.branchName,
          historicalRate: SEED_INTERNAL_COLLISION_RECORD.historicalRate,
          campaignName: SEED_INTERNAL_COLLISION_RECORD.campaignName,
          message: `Notice: ${SEED_INTERNAL_COLLISION_RECORD.branchName} completed a deal with this creator ($${SEED_INTERNAL_COLLISION_RECORD.historicalRate}). Historical internal rate benchmark: ~$${SEED_INTERNAL_COLLISION_RECORD.historicalRate}. Avoid internal bidding wars.`,
        };
      }
    }
    return null;
  },

  // 3. Competitor Sponsorship Exclusivity Radar
  getCompetitorAlert(creatorId: string) {
    const alert = SEED_COMPETITOR_RADAR.find(
      (r) => r.creatorId === creatorId && (r.exclusivityDaysRemaining ?? 0) > 0
    );
    if (alert) {
      return {
        brand: alert.competitorBrandName,
        platform: alert.platform,
        postUrl: alert.postUrl,
        daysAgo: 30 - (alert.exclusivityDaysRemaining ?? 0),
        daysRemaining: alert.exclusivityDaysRemaining,
        warning: `Conflict Alert: This creator published a sponsored post for rival brand ${alert.competitorBrandName} ${30 - (alert.exclusivityDaysRemaining ?? 0)} days ago. Exclusivity cooling period active.`,
      };
    }
    return null;
  },

  // 4. Isolated Chat & RLS Access Enforcement
  getConversationsForUser(userId: string, role: string) {
    // Sales Reps can ONLY see their assigned conversations
    if (role === 'SALES_REPRESENTATIVE') {
      return conversations.filter((c) => c.assignedRepId === userId);
    }
    // Creators see conversations where they are the creator
    if (role === 'CREATOR') {
      return conversations.filter((c) => c.creatorUserId === userId);
    }
    // Talent Managers see deals for their rostered creators (e.g. Rohan)
    if (role === 'TALENT_MANAGER') {
      return conversations.filter((c) => c.creatorUserId === 'user_creator_rohan');
    }
    // Platform Admin & Head Account can see list (metadata only)
    if (role === 'PLATFORM_ADMIN' || role === 'COMPANY_HEAD_ADMIN') {
      return conversations;
    }
    return [];
  },

  getConversationWithAccessCheck(conversationId: string, userId: string, role: string) {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return { error: 'Conversation not found', status: 404 };

    // Core RLS Policy Check:
    // Sales Rep B trying to read Rep A's conversation -> 403 Forbidden!
    const isAssignedRep = conv.assignedRepId === userId;
    const isCreator = conv.creatorUserId === userId;
    const isManager = role === 'TALENT_MANAGER' && conv.creatorUserId === 'user_creator_rohan';
    const isPlatformAdmin = role === 'PLATFORM_ADMIN';

    if (!isAssignedRep && !isCreator && !isManager && !isPlatformAdmin) {
      return {
        error: '403 Forbidden: Row-Level Security (RLS) violation. Representatives cannot inspect peer negotiations.',
        status: 403,
      };
    }

    const convMessages = messages.filter((m) => m.conversationId === conversationId);
    return { data: { conversation: conv, messages: convMessages }, status: 200 };
  },

  addMessage(conversationId: string, senderId: string, senderName: string, content: string) {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      content,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);

    // Update conversation last message snippet
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessageSnippet = content;
      conv.updatedAt = newMsg.createdAt;
    }

    return newMsg;
  },

  // 5. Role-Aware AI Thread Summarizer with Manager PII Masking
  getAISummary(conversationId: string, userRole: string) {
    const summary = aiSummaries[conversationId] || SEED_AI_SUMMARY;

    // Talent Manager Privacy Moat: PII Sanitized!
    if (userRole === 'TALENT_MANAGER') {
      return {
        role: 'TALENT_MANAGER',
        isMasked: true,
        summary: summary.managerViewSummary,
        pendingBlockers: summary.pendingBlockers,
        extractedTerms: summary.extractedTerms,
      };
    }

    // Full POI view for Creator and Assigned Sales Rep
    return {
      role: userRole,
      isMasked: false,
      summary: summary.repViewSummary,
      pendingBlockers: summary.pendingBlockers,
      extractedTerms: summary.extractedTerms,
    };
  },

  // 6. Contracts & Milestone Escrow
  getContracts() {
    return contracts;
  },

  getContractById(contractId: string) {
    return contracts.find((c) => c.id === contractId);
  },

  generateContractFromDeal(conversationId: string, extractedTerms: any) {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return null;

    const newContract: Contract = {
      id: `contract_${Date.now()}`,
      organizationId: conv.organizationId,
      branchId: conv.branchId,
      branchName: conv.branchName,
      assignedRepId: conv.assignedRepId,
      assignedRepName: conv.assignedRepName,
      creatorId: conv.creatorProfileId,
      creatorDisplayName: conv.creatorDisplayName,
      creatorHandle: conv.creatorHandle,
      totalAmount: extractedTerms.totalAmount || 2500,
      currency: extractedTerms.currency || 'USD',
      termsMarkdown: `### COLLABONET STANDARDIZED SPONSORSHIP CONTRACT
**Brand Enterprise**: Nike Global (${conv.branchName})  
**Assigned Deal Owner**: ${conv.assignedRepName}  
**Creator**: ${conv.creatorDisplayName} (${conv.creatorHandle})  
**Contract Value**: $${extractedTerms.totalAmount || 2500}.00 USD (Escrow Protected)

#### Extracted Agreed Terms
- Includes Gifted Footwear Product: ${extractedTerms.terms?.includesGiftedProduct ? 'YES' : 'NO'}
- Category Exclusivity: ${extractedTerms.terms?.exclusivityDays || 30} Days
- Maximum Allowed Revision Rounds: ${extractedTerms.terms?.maxRevisionRounds || 2}`,
      status: 'CONTRACT_PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: (extractedTerms.deliverables || []).map((d: any, idx: number) => ({
        id: `ms_gen_${Date.now()}_${idx}`,
        contractId: `contract_${Date.now()}`,
        title: d.title,
        deliverableType: d.deliverableType,
        amount: d.amount,
        dueDate: d.dueDate,
        status: 'PENDING',
        revisionCount: 0,
      })),
    };

    contracts.unshift(newContract);
    return newContract;
  },

  signContract(contractId: string, signerRole: 'BRAND' | 'CREATOR', signatureHash: string) {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return null;

    const now = new Date().toISOString();
    if (signerRole === 'BRAND') {
      contract.brandSignatureHash = signatureHash;
      contract.brandSignedAt = now;
    } else {
      contract.creatorSignatureHash = signatureHash;
      contract.creatorSignedAt = now;
    }

    if (contract.brandSignatureHash && contract.creatorSignatureHash) {
      contract.status = 'ACTIVE_IN_PROGRESS';
    }

    contract.updatedAt = now;
    return contract;
  },

  submitMilestoneProof(contractId: string, milestoneId: string, proofUrl: string, proofDescription: string) {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return null;

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return null;

    milestone.proofUrl = proofUrl;
    milestone.proofDescription = proofDescription;
    milestone.status = 'SUBMITTED';
    contract.updatedAt = new Date().toISOString();
    return milestone;
  },

  approveMilestone(contractId: string, milestoneId: string) {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return null;

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return null;

    milestone.status = 'APPROVED';
    milestone.approvedAt = new Date().toISOString();

    // Check if all milestones are approved
    const allApproved = contract.milestones.every((m) => m.status === 'APPROVED');
    if (allApproved) {
      contract.status = 'COMPLETED';
    }

    contract.updatedAt = new Date().toISOString();
    return milestone;
  },

  // 7. Deal Succession & Reassignment
  reassignDeal(
    conversationId: string,
    newRepId: string,
    newRepName: string,
    reason: string,
    reassignedByUserId: string,
    reassignedByName: string
  ) {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return null;

    const prevRepId = conv.assignedRepId;
    const prevRepName = conv.assignedRepName;

    // Update conversation owner
    conv.assignedRepId = newRepId;
    conv.assignedRepName = newRepName;
    conv.updatedAt = new Date().toISOString();

    const log: DealReassignmentLog = {
      id: `reassign_${Date.now()}`,
      conversationId,
      previousRepId: prevRepId,
      previousRepName: prevRepName,
      newRepId,
      newRepName,
      reassignedByUserId,
      reassignedByName,
      reason,
      handoverBriefSummary: {
        dealStage: 'Active negotiation handed over.',
        keyAgreements: [
          'Budget parameters aligned with branch allocation',
          'Creator bio and engagement rate vetted',
        ],
        immediateActionItems: [
          `Connect with ${conv.creatorDisplayName}`,
          'Finalize contract generation',
        ],
        cautionNotes: 'Review existing chat context before dispatching counter-proposals.',
      },
      reassignedAt: new Date().toISOString(),
    };

    reassignmentLogs.unshift(log);
    return { conversation: conv, log };
  },

  // 8. Enterprise Multi-Branch & Hall of Shame
  getBranches() {
    return branches;
  },

  getCampaigns() {
    return campaigns;
  },

  getHallOfShame() {
    return hallOfShameEntries;
  },

  getReassignmentLogs() {
    return reassignmentLogs;
  },
};
