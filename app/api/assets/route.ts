import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

export async function POST(request: NextRequest) {
  const token = (await cookies()).get('admin_session')?.value;
  if (!validateSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';

  // URL import mode — JSON body with { url }
  if (contentType.includes('application/json')) {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch URL');
      const buffer = Buffer.from(await response.arrayBuffer());

      const urlObj = new URL(url);
      let ext = path.extname(urlObj.pathname).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
        ext = '.png'; // fallback
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (buffer.length > MAX_SIZE) {
        return NextResponse.json({ error: 'Image too large. Max 5MB' }, { status: 400 });
      }

      await fs.mkdir(ASSETS_DIR, { recursive: true });
      const baseName = path.basename(urlObj.pathname, ext).replace(/[^a-zA-Z0-9_-]/g, '-') || 'imported';
      const fileName = `${baseName}${ext}`;
      const filePath = path.join(ASSETS_DIR, fileName);

      // Avoid overwriting — add suffix if exists
      let finalName = fileName;
      let counter = 1;
      while (true) {
        try { await fs.access(filePath); } catch { break; }
        finalName = `${baseName}-${counter}${ext}`;
        counter++;
        break; // just one attempt
      }

      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/assets/${finalName}`,
        fileName: finalName,
      });
    } catch {
      return NextResponse.json({ error: 'Failed to import image from URL' }, { status: 400 });
    }
  }

  // File upload mode — multipart form
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp, svg' }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 });
  }

  await fs.mkdir(ASSETS_DIR, { recursive: true });

  // Sanitize filename: keep only alphanumeric, dash, underscore
  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
  const fileName = `${baseName}${ext}`;
  const filePath = path.join(ASSETS_DIR, fileName);

  const bytes = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(bytes));

  return NextResponse.json({
    success: true,
    url: `/assets/${fileName}`,
    fileName,
  });
}

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get('admin_session')?.value;
  if (!validateSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    const fileName = path.basename(url);
    const filePath = path.join(ASSETS_DIR, fileName);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function GET() {
  const token = (await cookies()).get('admin_session')?.value;
  if (!validateSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(ASSETS_DIR, { recursive: true });
    const files = await fs.readdir(ASSETS_DIR);
    const images = files
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .map(f => ({
        name: f,
        url: `/assets/${f}`,
      }));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
