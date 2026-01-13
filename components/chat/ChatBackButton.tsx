'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function ChatBackButton() {
  const router = useRouter();
  const { user } = useAuth();

  const handleBack = () => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      // Use browser back navigation for regular users
      router.back();
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Voltar">
      ← Voltar
    </Button>
  );
}
