import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { contractId } = body;

    if (!contractId) {
      return NextResponse.json({ error: 'contractId is required' }, { status: 400 });
    }

    const milestone = DataService.approveMilestone(contractId, params.id);
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone or contract not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      milestone,
      escrowDisbursementStatus: 'RELEASED_TO_CREATOR_ESCROW_WALLET',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
