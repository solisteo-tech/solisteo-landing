'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Public pages that don't require authentication
    const publicPages = [
      '/',
      '/login',
      '/register',
      '/docs',
      '/about',
      '/blog',
      '/careers',
      '/contact',
      '/privacy',
      '/terms',
      '/system',
      '/security',
      '/forgot-password',
      '/reset-password',
      '/syncbot',
      '/syncbot/login',
      '/vision'
    ];

    // Check if current page is public
    const isPublicPage = publicPages.some(page => pathname === page || (page !== '/' && pathname.startsWith(page + '/')));

    // If it's a public page and user is not logged in, allow access
    if (!user && isPublicPage) {
      return;
    }

    // If user is not logged in and not on a public page, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is logged in and on auth pages, redirect to appropriate dashboard
    // But allow them to visit the homepage
    if (user && (pathname === '/login' || pathname === '/register')) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'seller') {
        router.push('/seller/dashboard');
      }
      return;
    }

    // If user is logged in but trying to access wrong role's pages
    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        if (pathname.startsWith('/seller/')) {
          router.push('/admin/dashboard');
        }
      } else if (user.role === 'seller') {
        if (pathname.startsWith('/admin/')) {
          router.push('/seller/dashboard');
        }
      }
    }
  }, [user, isLoading, router, pathname]);

  return null;
}
