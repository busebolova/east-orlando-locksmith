import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';
import { getData, saveData } from '@/lib/data';

export async function POST(request: NextRequest) {
  const token = (await cookies()).get('admin_session')?.value;
  if (!validateSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const headerLogo = formData.get('headerLogo') as string;
  const headerLogoWidth = parseInt(formData.get('headerLogoWidth') as string) || 315;
  const headerLogoHeight = parseInt(formData.get('headerLogoHeight') as string) || 86;
  const favicon = formData.get('favicon') as string;

  const data = await getData();
  data.headerLogo = headerLogo || '';
  data.headerLogoWidth = headerLogoWidth;
  data.headerLogoHeight = headerLogoHeight;
  data.favicon = favicon || '';
  await saveData(data);

  return NextResponse.json({ success: true });
}
