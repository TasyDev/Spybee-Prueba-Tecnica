import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/organisms/navigation/Sidebar';
import styles from './protected-layout.module.scss';

export const metadata: Metadata = {
  title: 'SpyBee — Protected',
  description: 'Protected pages',
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url || '';

  return (
    <div className={styles.protectedLayout}>
      <Sidebar
        user={{
          name: userName,
          role: 'Admin',
          avatarUrl,
        }}
      />
      <main className={styles.protectedLayout__main}>
        {children}
      </main>
    </div>
  );
}
