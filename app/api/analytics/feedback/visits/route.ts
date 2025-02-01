import { getVisitData, VisitType } from '@/lib/server/feedback-backend/analytics';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get('spaceId');
  const pageType = searchParams.get('pageType') as VisitType;
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!spaceId || !pageType || !start || !end) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const data = await getVisitData('feedback', spaceId, pageType, start, end);
  console.log({visitData:data})
  return NextResponse.json(data);
}