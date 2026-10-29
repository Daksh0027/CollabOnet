import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get('x-user-id') || 'user_rep_alice';
    const role = req.headers.get('x-user-role') || 'SALES_REPRESENTATIVE';

    // Verify conversation access first
    const accessCheck = DataService.getConversationWithAccessCheck(params.id, userId, role);
    if (accessCheck.error) {
      return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
    }

    const summaryData = DataService.getAISummary(params.id, role);
    return NextResponse.json(summaryData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
