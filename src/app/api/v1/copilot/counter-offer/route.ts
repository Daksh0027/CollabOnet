import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandOfferAmount, requestedDeliverables, creatorBaseRate, reason } = body;

    const offer = parseFloat(brandOfferAmount) || 2000;
    const base = parseFloat(creatorBaseRate) || 2800;
    const counterAmount = Math.round((offer + base) / 2);

    const generatedCounter = `Thanks for sharing the initial proposal! 

Based on our recent organic video performance averaging ${(55000).toLocaleString()} views and 5.2% engagement in this specific category, our standard rate card for ${requestedDeliverables || '1x 60s Integration'} is $${base}. 

However, because the product aligns so closely with our upcoming editorial schedule, I can meet you at $${counterAmount} if we can include product seeding for unboxing and limit exclusivity to 30 days.

Looking forward to bringing this to life!`;

    return NextResponse.json({
      suggestedCounterAmount: counterAmount,
      draftMessage: generatedCounter,
      rationale: `Compromises midpoint between brand offer ($${offer}) and base rate ($${base}) while protecting creator value.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
