
import React from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { QueryProvider } from '../lib/providers/QueryProvider';
import { Toaster } from '../components/ui/toaster';
import RoleBasedRedirect from '../components/RoleBasedRedirect';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: {
    default: 'SOLISTEO - Enterprise E-commerce Analytics',
    template: '%s | SOLISTEO',
  },
  description: 'AI-powered analytics platform for Amazon sellers. Real-time intelligence, automated reporting, and smart alerts.',
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="bg-white text-slate-900 antialiased selection:bg-blue-100 font-sans">
        <QueryProvider>
          <AuthProvider>
            <RoleBasedRedirect />
            <MaintenanceGuard />
            {children}
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
