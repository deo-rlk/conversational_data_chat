'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './Navbar';
import { DevRoleToggle } from '@/components/auth/DevRoleToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Determine route requirements based on pathname
  const isLoginPage = pathname === '/login';
  const isAuthCallback = pathname?.startsWith('/auth/callback');
  const isAdminRoute = pathname?.startsWith('/admin');
  const isPublicRoute = isLoginPage || isAuthCallback;

  useEffect(() => {
    if (isLoading) return;

    // Public routes - redirect authenticated users away from login
    if (isPublicRoute && user) {
      router.push(user.role === 'admin' ? '/admin' : '/chat');
      return;
    }

    // Protected routes - redirect unauthenticated users to login
    if (!isPublicRoute && !user) {
      router.push('/login');
      return;
    }

    // Admin routes - redirect non-admin users
    if (isAdminRoute && user?.role !== 'admin') {
      router.push('/chat');
      return;
    }
  }, [user, isLoading, isPublicRoute, isAdminRoute, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render layout for login/auth callback pages
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Don't render if not authenticated or unauthorized
  if (!user) {
    return null;
  }

  if (isAdminRoute && user.role !== 'admin') {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <DevRoleToggle />
    </div>
  );
}
