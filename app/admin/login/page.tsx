import { createSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage(props: { searchParams?: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  async function handleLogin(formData: FormData) {
    'use server';
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === 'admin' && password === 'eoladmin2026') {
      const token = createSession();
      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      redirect('/admin');
    } else {
      redirect('/admin/login?error=1');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b1a2e 0%, #1a2a3a 50%, #0d1f33 100%)',
      padding: 20,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #e6a329, #d4921e)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            fontSize: 28,
            color: '#fff',
          }}>
            &#128274;
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111' }}>Admin Panel</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>East Orlando Locksmith</p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            color: '#991b1b',
            fontSize: 13,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            Geçersiz kullanıcı adı veya şifre.
          </div>
        )}

        <form action={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              placeholder="admin"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#e6a329'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#e6a329'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #e6a329, #d4921e)',
              color: '#071321',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => e.target.style.opacity = '0.9'}
            onMouseOut={e => e.target.style.opacity = '1'}
          >
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 12, color: '#9ca3af' }}>
          Yetkili personel için özel erişim
        </p>
      </div>
    </div>
  );
}
