'use client';

import { ReactNode } from 'react';
import MainHeader from '@/components/main-header/header-component';
import { useAuth } from '@/context/auth-context';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isAuthPage } = useAuth();

  return (
    <>
      {!isAuthPage && <MainHeader />}
      <main className={isAuthPage ? 'h-screen' : 'h-[calc(100vh-64px)]'} style={{ overflow: 'auto' }}>
        {children}
      </main>
    </>
  );
}
