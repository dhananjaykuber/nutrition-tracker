'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Apple, PlusCircle, History } from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Add Food Item',
    href: '/food/add',
    icon: Apple,
  },
  {
    label: 'Log Food',
    href: '/food/log',
    icon: PlusCircle,
  },
  {
    label: 'History',
    href: '/food/history',
    icon: History,
  },
];

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        mobile ? 'w-full' : 'hidden lg:block w-64 border-r border-gray-200',
        'p-4'
      )}
    >
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-zinc-300 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
