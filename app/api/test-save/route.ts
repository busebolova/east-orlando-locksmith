import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { savePage, getData } = await import('@/lib/data');
    const body = await request.json();
    const { slug, updates } = body;

    if (!slug || !updates) {
      return NextResponse.json({ error: 'Missing slug or updates' }, { status: 400 });
    }

    // Test: read current state
    const data = await getData();
    const before = data.pages.find((p: any) => p.slug === slug);

    // Save
    const result = await savePage(slug, updates);

    // Re-read to confirm
    const data2 = await getData();
    const after = data2.pages.find((p: any) => p.slug === slug);

    return NextResponse.json({
      success: true,
      beforeSections: before?.sections || null,
      afterSections: after?.sections || null,
      match: JSON.stringify(before?.sections) === JSON.stringify(after?.sections) ? 'UNCHANGED' : 'UPDATED'
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
