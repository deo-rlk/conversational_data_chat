'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function AdminHome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center mb-8">Admin Dashboard</h1>
        <Link href="/chat" className="block">
          <Button className="w-full" size="lg">
            Chat
          </Button>
        </Link>
        <Link href="/admin/configure" className="block">
          <Button className="w-full" size="lg" variant="outline">
            Configure
          </Button>
        </Link>
      </div>
    </div>
  );
}
