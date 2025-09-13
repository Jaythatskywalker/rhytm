'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: 'Discover' },
  { href: '/library', label: 'Library' },
  { href: '/collections', label: 'Collections' },
  { href: '/export', label: 'Export' },
  { href: '/settings', label: 'Settings' }
];

interface DashboardNavProps {
  theme: 'dark' | 'light';
}

export function DashboardNav({ theme }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-base font-bold transition-colors',
            pathname === item.href
              ? theme === 'dark' 
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                : 'bg-emerald-600 text-white'
              : theme === 'dark'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-[#1a1a17]/70 hover:text-[#1a1a17] hover:bg-[#1a1a17]/10'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
