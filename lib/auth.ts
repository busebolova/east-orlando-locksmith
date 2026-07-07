import { getData } from '@/lib/data';

const SESSION_COOKIE = 'admin_session';
const SESSION_SECRET = 'eol-admin-2026';

export async function verifyPassword(inputPassword: string): Promise<boolean> {
  const data = await getData();
  return inputPassword === (data as any).adminPassword;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { saveData } = await import('@/lib/data');
  const data = await getData();
  (data as any).adminPassword = newPassword;
  await saveData(data);
}

export function createSession(): string {
  const token = Buffer.from(
    JSON.stringify({ id: 'admin', time: Date.now(), secret: SESSION_SECRET })
  ).toString('base64');
  return token;
}

export function validateSession(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded.secret === SESSION_SECRET;
  } catch {
    return false;
  }
}
