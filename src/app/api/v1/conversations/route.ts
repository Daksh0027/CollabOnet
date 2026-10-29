import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || 'user_rep_alice';
  const role = req.headers.get('x-user-role') || 'SALES_REPRESENTATIVE';

  const conversations = DataService.getConversationsForUser(userId, role);
  return NextResponse.json({ conversations });
}
