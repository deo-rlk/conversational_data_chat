'use client';

import React from 'react';
import { useQuestionLimit } from '@/contexts/QuestionLimitContext';
import { Badge } from '@/components/ui/Badge';

export function QuestionLimitBadge() {
  const { remaining, limit } = useQuestionLimit();
  const variant = remaining > 3 ? 'success' : remaining > 0 ? 'warning' : 'destructive';

  return (
    <Badge variant={variant}>
      Perguntas restantes: {remaining}/{limit}
    </Badge>
  );
}
