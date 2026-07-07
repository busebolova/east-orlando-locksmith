import { NextRequest, NextResponse } from 'next/server';
import { savePage } from '@/lib/data';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const seoKeywords = formData.get('seoKeywords') as string;
  const published = formData.get('published') === 'on';

  let sections = undefined;
  try {
    const raw = formData.get('pageSections') as string;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Object.keys(parsed).length > 0) sections = parsed;
    }
  } catch { /* invalid JSON, ignore */ }

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  await savePage(slug, { title, description, content, seoKeywords, published, sections });

  return NextResponse.redirect(new URL('/admin/pages', request.url), 303);
}
