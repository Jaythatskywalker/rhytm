'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { MiniPlayer } from './MiniPlayer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">      
      <main className="pb-24 flex-1 h-full">
        {children}
      </main>
      
      <MiniPlayer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
