import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get('x-user-id') || 'user_rep_alice';
    const role = req.headers.get('x-user-role') || 'SALES_REPRESENTATIVE';

    const accessCheck = DataService.getConversationWithAccessCheck(params.id, userId, role);
    if (accessCheck.error) {
      return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
    }

    const summary = DataService.getAISummary(params.id, role);
    const extracted = summary.extractedTerms;

    return NextResponse.json({
      confidenceScore: 0.98,
      contractDraftPayload: {
        conversationId: params.id,
        totalAmount: extracted.totalAmount,
        currency: extracted.currency,
        milestones: extracted.deliverables,
        terms: extracted.terms,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
