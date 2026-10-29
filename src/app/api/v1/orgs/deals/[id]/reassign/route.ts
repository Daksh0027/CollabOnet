import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { newRepresentativeId, newRepresentativeName, handoverReason } = body;
    const reassignedByUserId = req.headers.get('x-user-id') || 'user_head_admin';
    const reassignedByName = req.headers.get('x-user-name') || 'Marcus Vance (CMO)';

    if (!newRepresentativeId || !handoverReason) {
      return NextResponse.json(
        { error: 'newRepresentativeId and handoverReason are required' },
        { status: 400 }
      );
    }

    const result = DataService.reassignDeal(
      params.id,
      newRepresentativeId,
      newRepresentativeName || 'Assigned Representative',
      handoverReason,
      reassignedByUserId,
      reassignedByName
    );

    if (!result) {
      return NextResponse.json({ error: 'Deal or conversation not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Deal reassigned successfully with zero downtime.',
      conversation: result.conversation,
      handoverAuditLog: result.log,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
