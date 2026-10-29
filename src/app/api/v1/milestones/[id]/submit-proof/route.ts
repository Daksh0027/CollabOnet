import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { contractId, proofUrl, proofDescription } = body;

    if (!contractId || !proofUrl) {
      return NextResponse.json({ error: 'contractId and proofUrl are required' }, { status: 400 });
    }

    const milestone = DataService.submitMilestoneProof(
      contractId,
      params.id,
      proofUrl,
      proofDescription || 'Deliverable proof link submitted for brand review.'
    );

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone or contract not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, milestone });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
