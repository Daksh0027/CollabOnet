import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function GET() {
  const contracts = DataService.getContracts();
  return NextResponse.json({ contracts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, extractedTerms } = body;

    if (!conversationId || !extractedTerms) {
      return NextResponse.json(
        { error: 'conversationId and extractedTerms are required' },
        { status: 400 }
      );
    }

    const contract = DataService.generateContractFromDeal(conversationId, extractedTerms);
    if (!contract) {
      return NextResponse.json({ error: 'Failed to generate contract' }, { status: 404 });
    }

    return NextResponse.json({ contract }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
