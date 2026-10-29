import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WORDS_A = ['CollaboNet', 'Verified', 'Sponsor', 'Secure', 'Escrow', 'Shield'];
const WORDS_B = ['Falcon', 'Tiger', 'Atlas', 'Nova', 'Summit', 'Zenith'];
const WORDS_C = ['Prime', 'Apex', 'Matrix', 'Pulse', 'Quantum', 'Vanguard'];

export async function POST(req: NextRequest) {
  try {
    const randomDigit = Math.floor(100 + Math.random() * 900);
    const word1 = WORDS_A[Math.floor(Math.random() * WORDS_A.length)];
    const word2 = WORDS_B[Math.floor(Math.random() * WORDS_B.length)];
    const word3 = WORDS_C[Math.floor(Math.random() * WORDS_C.length)];
    const word4 = WORDS_B[Math.floor(Math.random() * WORDS_B.length)];
    const word5 = WORDS_C[Math.floor(Math.random() * WORDS_C.length)];

    const sessionNonce = `${word1}-${word2}-${randomDigit}-${word3}-${word4}-${word5}`;
    const sessionToken = crypto.randomBytes(16).toString('hex');

    return NextResponse.json({
      sessionNonce,
      sessionToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      presignedUploadUrl: 'https://s3.amazonaws.com/collabonet-verification-blobs/uploads/' + sessionToken,
      instructions: `Please record a 5-10 second selfie video clearly reading aloud the following 6-word passphrase: "${sessionNonce.replace(/-/g, ' ')}"`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
