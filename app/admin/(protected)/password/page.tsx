import { redirect } from 'next/navigation';
import { getData } from '@/lib/data';
import { updatePassword } from '@/lib/auth';

export default async function PasswordPage() {
  const data = await getData();
  const currentPassword = (data as any).adminPassword || '';

  async function handleUpdatePassword(formData: FormData) {
    'use server';
    const current = formData.get('currentPassword') as string;
    const newPass = formData.get('newPassword') as string;
    const confirmPass = formData.get('confirmPassword') as string;

    const data = await getData();
    if (current !== (data as any).adminPassword) {
      redirect('/admin/password?error=wrong');
    }

    if (newPass !== confirmPass) {
      redirect('/admin/password?error=mismatch');
    }

    if (newPass.length < 4) {
      redirect('/admin/password?error=short');
    }

    await updatePassword(newPass);
    redirect('/admin/password?success=1');
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Password Settings</h2>
      </div>
      <div className="page-content">
        <div className="card" style={{ maxWidth: 500 }}>
          <div className="card-body">
            <form action={handleUpdatePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  required
                  minLength={4}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  required
                  minLength={4}
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
