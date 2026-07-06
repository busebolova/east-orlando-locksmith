import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

type ChangeFreq = 'weekly' | 'monthly' | 'yearly' | 'daily';

export async function GET() {
  const data = await getData();
  const now = new Date().toISOString();

  const urls: Array<{ loc: string; lastmod: string; changefreq: ChangeFreq; priority: number }> = data.pages
    .filter((p) => p.published)
    .map((p) => ({
      loc: `https://eastorlandolocksmith.com/${p.slug === 'index' ? '' : p.slug}`,
      lastmod: now,
      changefreq: 'weekly' as ChangeFreq,
      priority: p.type === 'homepage' ? 1.0 : p.type === 'service' ? 0.8 : 0.6,
    }));

  data.blogPosts
    .filter((p) => p.published)
    .forEach((p) => {
      urls.push({
        loc: `https://eastorlandolocksmith.com/blog/${p.slug}`,
        lastmod: p.date ? new Date(p.date).toISOString() : now,
        changefreq: 'monthly' as ChangeFreq,
        priority: 0.5,
      });
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
