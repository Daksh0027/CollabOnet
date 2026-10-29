import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const niche = searchParams.get('niche');
    const country = searchParams.get('country');
    const maxRate = searchParams.get('maxRate');
    const minEngagement = searchParams.get('minEngagement');

    const filters = {
      niches: niche ? [niche] : undefined,
      countryCode: country || undefined,
      maxRate: maxRate ? parseFloat(maxRate) : undefined,
      minEngagementRate: minEngagement ? parseFloat(minEngagement) : undefined,
    };

    const creators = DataService.getCreators(filters);
    return NextResponse.json({ creators });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
