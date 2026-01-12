'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function ConfigurePage() {
  const router = useRouter();

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-2 sm:p-4 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin')}
          aria-label="Voltar"
        >
          ← Voltar
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <div className="max-w-md w-full space-y-3 sm:space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-8 text-gray-900">Configure</h1>
          <Link href="/admin/configure/environments" className="block">
            <Button className="w-full" size="lg">
              Environments
            </Button>
          </Link>
          <Link href="/admin/configure/environments/new" className="block">
            <Button className="w-full" size="lg" variant="outline">
              New Environment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
