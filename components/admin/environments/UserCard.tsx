'use client';

import React from 'react';
import { EnvironmentUser } from '@/types/environment';
import { RoleBadge } from '@/components/admin/shared/RoleBadge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface UserCardProps {
  user: EnvironmentUser;
  onRemove: (userId: string) => void;
  canRemove: boolean;
}

export function UserCard({ user, onRemove, canRemove }: UserCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-medium text-gray-900">{user.lookerUser}</p>
          <RoleBadge role={user.role} />
        </div>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onRemove(user.id)}
        aria-label={`Remover usuário ${user.lookerUser}`}
      >
        -
      </Button>
    </div>
  );
}
