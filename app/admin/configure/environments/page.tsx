'use client';

import React from 'react';
import Link from 'next/link';
import { EnvironmentsList } from '@/components/admin/environments/EnvironmentsList';
import { Button } from '@/components/ui/Button';

export default function EnvironmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <Link href="/admin/configure">
            <Button variant="ghost" size="sm" aria-label="Voltar">
              ← Voltar
            </Button>
          </Link>
        </div>
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1 sm:mb-2">Environments</h1>
          <p className="text-sm sm:text-base text-gray-600 text-center">Gerencie seus ambientes configurados</p>
        </div>
        <EnvironmentsList />
      </div>
    </div>
  );
}
