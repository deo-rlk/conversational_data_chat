'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { QUESTION_LIMITS } from '@/lib/constants';
import { useAuth } from './AuthContext';

interface QuestionLimitContextType {
  count: number;
  limit: number;
  remaining: number;
  increment: () => void;
  reset: () => void;
}

const QuestionLimitContext = createContext<QuestionLimitContextType | undefined>(undefined);

export function QuestionLimitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const role = user?.role || 'user';
  const limit = QUESTION_LIMITS[role];
  
  const [count, setCount] = useLocalStorage<number>(`question_count_${user?.id || 'default'}`, 0);

  const increment = () => {
    setCount(count + 1);
  };

  const reset = () => {
    setCount(0);
  };

  const remaining = Math.max(0, limit - count);

  return (
    <QuestionLimitContext.Provider value={{ count, limit, remaining, increment, reset }}>
      {children}
    </QuestionLimitContext.Provider>
  );
}

export function useQuestionLimit() {
  const context = useContext(QuestionLimitContext);
  if (context === undefined) {
    throw new Error('useQuestionLimit must be used within a QuestionLimitProvider');
  }
  return context;
}
