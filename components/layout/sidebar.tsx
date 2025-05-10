'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Add Food Item', href: '/food/add' },
  { label: 'Add Food Entry', href: '/food/log' },
  { label: 'History', href: '/food/history' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
