'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href={user.role === 'admin' ? '/admin' : '/chat'} className="text-lg font-semibold text-gray-900">
          Conversational Data Chat
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-800">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
}
