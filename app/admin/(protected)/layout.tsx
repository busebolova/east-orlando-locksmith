import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!validateSession(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
