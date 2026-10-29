import { DataService } from '../src/lib/services';
import { parseNaturalLanguageQuery } from '../src/lib/ai-parser';

async function runVerification() {
  console.log('====================================================');
  console.log('🧪 COLLABONET ARCHITECTURE & RLS E2E TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Natural Language Query Parser Test
  const query = 'Find Indian fintech creators who do 60s YouTube integrations under $2,000 with >4% engagement and cinematic storytelling';
  const { filters, aestheticKeywords } = parseNaturalLanguageQuery(query);
  assert(filters.countryCode === 'IN', 'Query parsed countryCode as IN');
  assert(filters.niches?.includes('fintech') === true, 'Query parsed niche as fintech');
  assert(filters.maxRate === 2000, 'Query parsed maxRate as 2000');
  assert(filters.minEngagementRate === 0.04, 'Query parsed minEngagementRate as 0.04');
  assert(filters.deliverableFormat === 'yt_integrated_60s', 'Query parsed deliverableFormat as yt_integrated_60s');
  assert(aestheticKeywords.includes('cinematic storytelling') === true, 'Query parsed aesthetic keyword as cinematic storytelling');

  // 2. Marketplace & Vibe Match Filter Test
  const creators = DataService.getCreators(filters);
  assert(creators.length > 0, `Marketplace query returned ${creators.length} matching creators`);
  assert(creators[0].displayName === 'Rohan Tech Studio', 'Top match is Rohan Tech Studio');

  // 3. Zero-Knowledge Cross-Branch Collision Radar Test
  const collision = DataService.getInternalCollisionNotice('creator_rohan_tech', 'branch_nike_na');
  assert(collision !== null, 'Collision notice generated for North America branch viewing Rohan');
  assert(collision?.branchName === 'APAC (Mumbai)', 'Collision notice correctly attributes prior deal to APAC branch');
  assert(collision?.historicalRate === 1750, 'Collision notice exposes historical internal rate benchmark ($1750)');

  // 4. Competitor Sponsorship Radar Test
  const competitorAlert = DataService.getCompetitorAlert('creator_rohan_tech');
  assert(competitorAlert !== null, 'Competitor radar detected active sponsorship conflict');
  assert(competitorAlert?.brand === 'Puma', 'Detected competitor brand is Puma');
  assert(competitorAlert?.daysRemaining === 11, 'Exclusivity cooling period correctly calculated (11 days remaining)');

  // 5. PostgreSQL Row-Level Security (RLS) Chat Isolation Test
  // Sales Rep A (Deal Owner) -> 200 OK
  const repAResult = DataService.getConversationWithAccessCheck('conv_alice_rohan', 'user_rep_alice', 'SALES_REPRESENTATIVE');
  assert(repAResult.status === 200, 'Sales Rep A (Deal Owner) granted full conversation read access (200 OK)');
  assert(repAResult.data?.messages.length === 4, 'Sales Rep A successfully fetched all 4 negotiation messages');

  // Sales Rep B (Peer Rep) -> 403 FORBIDDEN
  const repBResult = DataService.getConversationWithAccessCheck('conv_alice_rohan', 'user_rep_bob', 'SALES_REPRESENTATIVE');
  assert(repBResult.status === 403, 'Sales Rep B (Peer Rep) strictly blocked with 403 Forbidden by RLS policy');

  // 6. Role-Aware AI Thread Summarizer & Manager PII Masking Test
  const repSummary = DataService.getAISummary('conv_alice_rohan', 'SALES_REPRESENTATIVE');
  assert(repSummary.isMasked === false, 'Sales Rep receives unmasked summary');
  assert((repSummary.summary as any).repPOI?.name === 'Alice Zhang', 'Sales Rep view includes full Brand Representative POI details');

  const managerSummary = DataService.getAISummary('conv_alice_rohan', 'TALENT_MANAGER');
  assert(managerSummary.isMasked === true, 'Talent Manager summary is masked by RBAC Data Masking Engine');
  assert((managerSummary.summary as any).maskedCompanyEntity.includes('Nike'), 'Manager view only sees corporate company entity');
  assert((managerSummary.summary as any).repPOI === undefined, 'Manager view completely strips representative personal name & phone');

  // 7. Chat-to-Contract Extraction & E-Signing Test
  const extracted = repSummary.extractedTerms;
  const contract = DataService.generateContractFromDeal('conv_alice_rohan', extracted);
  assert(contract !== null, 'Contract auto-generated from extracted terms');
  assert(contract?.totalAmount === 2500, 'Contract total amount is $2,500');
  assert(contract?.milestones.length === 3, 'Contract contains all 3 extracted milestones');

  // E-Signatures
  const signedContract = DataService.signContract(contract!.id, 'BRAND', 'sha256:mock_brand_hash');
  assert(signedContract?.brandSignatureHash === 'sha256:mock_brand_hash', 'Brand e-signature hash recorded');

  // Milestone Approval & Escrow Release
  const milestoneApproved = DataService.approveMilestone(contract!.id, contract!.milestones[0].id);
  assert(milestoneApproved?.status === 'APPROVED', 'Milestone deliverable approved & escrow disbursed');

  // 8. Zero-Downtime Deal Succession / Reassignment Test
  const reassignment = DataService.reassignDeal(
    'conv_alice_rohan',
    'user_rep_bob',
    'Bob Miller',
    'Alice on leave',
    'user_head_admin',
    'Marcus Vance'
  );
  assert(reassignment !== null, 'Deal successfully reassigned with zero downtime');
  assert(reassignment?.conversation.assignedRepId === 'user_rep_bob', 'Conversation assignedRepId updated to Bob Miller');
  assert(reassignment?.log.handoverBriefSummary.dealStage !== undefined, 'AI handover briefing generated for new representative');

  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runVerification();
