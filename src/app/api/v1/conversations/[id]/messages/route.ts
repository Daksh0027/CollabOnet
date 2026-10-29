import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get('x-user-id') || 'user_rep_alice';
  const role = req.headers.get('x-user-role') || 'SALES_REPRESENTATIVE';

  const result = DataService.getConversationWithAccessCheck(params.id, userId, role);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get('x-user-id') || 'user_rep_alice';
    const role = req.headers.get('x-user-role') || 'SALES_REPRESENTATIVE';

    // Verify access before allowing message insert
    const accessCheck = DataService.getConversationWithAccessCheck(params.id, userId, role);
    if (accessCheck.error) {
      return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
    }

    const body = await req.json();
    const content = body.content;
    const senderName = body.senderName || 'Anonymous';

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const newMessage = DataService.addMessage(params.id, userId, senderName, content);
    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
