import { createSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LoginPage() {
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
        maxAge: 60 * 60 * 24, // 24 hours
      });
      redirect('/admin');
    } else {
      redirect('/admin/login?error=1');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Panel</h1>
        <p>East Orlando Locksmith</p>
        <form action={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="form-control" placeholder="admin" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>
      </div>
    </div>
  );
}
