import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageQuery, calculateVibeMatch } from '@/lib/ai-parser';
import { DataService } from '@/lib/services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt || '';
    const currentBranchId = body.branchId;

    const { filters, aestheticKeywords } = parseNaturalLanguageQuery(prompt);
    const matchingCreators = DataService.getCreators(filters);

    const ranked = matchingCreators.map((creator) => {
      const { score, reason } = calculateVibeMatch(creator, aestheticKeywords, filters);
      const collisionNotice = DataService.getInternalCollisionNotice(creator.id, currentBranchId);
      const competitorAlert = DataService.getCompetitorAlert(creator.id);

      return {
        ...creator,
        vibeMatchScore: score,
        aiMatchReason: reason,
        internalCollisionNotice: collisionNotice,
        competitorAlert,
      };
    }).sort((a, b) => b.vibeMatchScore - a.vibeMatchScore);

    return NextResponse.json({
      parsedFilters: filters,
      appliedAestheticKeywords: aestheticKeywords,
      totalMatches: ranked.length,
      creators: ranked,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
