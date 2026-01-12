'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { QuestionLimitProvider } from '@/contexts/QuestionLimitContext';
import { ToastProvider } from '@/components/ui/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QuestionLimitProvider>
        <ToastProvider>{children}</ToastProvider>
      </QuestionLimitProvider>
    </AuthProvider>
  );
}
