'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

export function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="px-4 py-4 border-b">
                <SheetTitle>Nutrition Tracker</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Sidebar
                  mobile={true}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/dashboard"
            className="text-lg md:text-xl font-bold text-gray-800"
          >
            Nutrition Tracker
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600 hidden md:inline-block truncate max-w-[200px]">
                {user.email}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-sm md:text-base"
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
