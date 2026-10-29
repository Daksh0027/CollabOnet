import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';
import crypto from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { signerRole, signerName } = body; // 'BRAND' | 'CREATOR'

    if (!signerRole) {
      return NextResponse.json({ error: 'signerRole is required' }, { status: 400 });
    }

    // Generate cryptographic SHA-256 signature hash
    const signaturePayload = `${params.id}:${signerRole}:${signerName || 'Authorized User'}:${Date.now()}`;
    const signatureHash = 'sha256:' + crypto.createHash('sha256').update(signaturePayload).digest('hex');

    const updatedContract = DataService.signContract(params.id, signerRole, signatureHash);
    if (!updatedContract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      signatureHash,
      signedAt: new Date().toISOString(),
      contract: updatedContract,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
