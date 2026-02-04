'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <nav className="flex items-center justify-between p-4 bg-card border-b fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/solisteo-mark.svg" alt="SOLISTEO" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#254fff] to-[#1ad4ff] bg-clip-text text-transparent">SOLISTEO</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/solisteo-mark.svg" alt="SOLISTEO" className="h-8 w-8" />
          <span className="text-xl font-bold text-primary tracking-tight">SOLISTEO</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user.company_name || ''} />
                  <AvatarFallback>
                    {((user.role === 'admin' || user.role === 'super_admin')
                      ? 'PA'
                      : (user.company_name || 'U')).substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {(user.role === 'admin' || user.role === 'super_admin')
                      ? 'Platform Admin'
                      : (user.company_name || 'Unknown Company')}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email || 'No email'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(user?.role === 'admin' ? '/admin/settings' : '/seller/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
