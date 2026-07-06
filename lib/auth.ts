import type { NextFetchEvent, NextRequest } from 'next/server';

// Simple session token stored in cookie
const SESSION_COOKIE = 'admin_session';
const SESSION_SECRET = 'eol-admin-2026';

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

export async function validateRequest(request: NextRequest, _event?: NextFetchEvent): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return validateSession(token);
}
