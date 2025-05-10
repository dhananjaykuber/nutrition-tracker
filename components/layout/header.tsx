'use client';

import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-gray-800">
          Health Tracker
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
