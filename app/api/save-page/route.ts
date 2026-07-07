import { NextRequest, NextResponse } from 'next/server';
import { savePage } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, updates } = body;

    if (!slug || !updates) {
      return NextResponse.json({ error: 'Missing slug or updates' }, { status: 400 });
    }

    await savePage(slug, updates);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
