import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, campaignTitle, keyAngle } = body;

    const creator = DataService.getCreatorById(creatorId);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    const sampleVideo = creator.portfolioSamples[0]?.title || 'your latest video';
    const primaryVibe = creator.vibeTags[0] || 'clean aesthetic';

    const generatedPitch = `Hi ${creator.displayName.split(' ')[0]}!

I've been following your channel and loved your breakdown in "${sampleVideo}". The ${primaryVibe} and retention pacing really stood out to our creative team.

We are currently casting for the "${campaignTitle || 'Nike Air Max Pulse 2026'}" campaign. Given your audience in ${creator.primaryNiche} and your strong ${(creator.statsCache.engagementRate * 100).toFixed(1)}% engagement rate, we'd love to partner on a 60s dedicated integration.

We provide full creative freedom, fast 48h turnaround approvals, and upfront milestone escrow backing. Would you be open to reviewing the brief?`;

    return NextResponse.json({
      pitch: generatedPitch,
      statsReferenced: {
        creatorHandle: creator.handle,
        engagementRate: creator.statsCache.engagementRate,
        matchedVibe: primaryVibe,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
