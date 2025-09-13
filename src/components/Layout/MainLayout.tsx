'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { TopNav } from './TopNav';
import { MiniPlayer } from './MiniPlayer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <main className="pb-24">
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
