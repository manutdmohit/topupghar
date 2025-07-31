'use client';

import { usePathname } from 'next/navigation';
import HeaderSection from '@/components/header';
import FooterSection from '@/components/FooterSection';
import { Toaster } from 'sonner';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <HeaderSection />}
      <main>{children}</main>
      {!isAdmin && <FooterSection />}
      <Toaster />
    </>
  );
}
