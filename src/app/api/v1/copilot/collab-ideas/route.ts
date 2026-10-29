import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorAId, creatorBId } = body;

    const creatorA = DataService.getCreatorById(creatorAId) || DataService.getCreators()[0];
    const creatorB = DataService.getCreatorById(creatorBId) || DataService.getCreators()[1];

    const concepts = [
      {
        title: `${creatorA.primaryNiche.toUpperCase()} vs ${creatorB.primaryNiche.toUpperCase()}: The Cross-Over Benchmark`,
        format: 'Split-Screen 60s Reel & YouTube Short (Zero Budget Barter)',
        conceptPitch: `${creatorA.displayName} and ${creatorB.displayName} co-produce a fast-paced debate contrasting spending vs investing habits across tech and finance tools.`,
        crossAudienceSynergy: `Blends ${creatorA.displayName}'s ${creatorA.city} urban tech following with ${creatorB.displayName}'s high-income investor demographic.`,
      },
      {
        title: 'Day in the Life of a Minimalist Creator Exchange',
        format: 'Guest Cameo & Collab Post (Both Channels)',
        conceptPitch: `${creatorA.displayName} reviews ${creatorB.displayName}'s workflow setup and software stack, while ${creatorB.displayName} audits ${creatorA.displayName}'s monetization strategies.`,
        crossAudienceSynergy: 'Estimated combined organic impression boost: +45,000 views with zero ad spend.',
      },
      {
        title: '3-Tool Challenge: 30-Day Productivity Experiment',
        format: 'Co-Hosted Live Stream & Carousel Infographic',
        conceptPitch: 'Both creators test 3 productivity & wealth apps for 30 days and release a shared verdict checklist.',
        crossAudienceSynergy: 'High bookmark and save rate across Instagram and LinkedIn.',
      },
    ];

    return NextResponse.json({
      creatorA: { id: creatorA.id, name: creatorA.displayName, niche: creatorA.primaryNiche },
      creatorB: { id: creatorB.id, name: creatorB.displayName, niche: creatorB.primaryNiche },
      collaborationConcepts: concepts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
