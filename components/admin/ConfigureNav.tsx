'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function ConfigureNav() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex gap-4">
        <Link href="/admin/configure/environments">
          <Button
            variant={pathname?.includes('/environments') ? 'default' : 'outline'}
            className={cn(pathname?.includes('/environments') && 'bg-blue-600')}
          >
            Environments
          </Button>
        </Link>
        <Link href="/admin/configure/environments/new">
          <Button
            variant={pathname?.includes('/new') ? 'default' : 'outline'}
            className={cn(pathname?.includes('/new') && 'bg-blue-600')}
          >
            New Environment
          </Button>
        </Link>
      </div>
    </div>
  );
}
