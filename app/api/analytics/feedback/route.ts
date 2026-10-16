import { getFeedbackSubmissionData } from '@/lib/server/analytics';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get('spaceId');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!spaceId || !start || !end) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const data = await getFeedbackSubmissionData(spaceId, start, end);
  return NextResponse.json(data);
}
