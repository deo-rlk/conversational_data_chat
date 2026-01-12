import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Role } from '@/types/auth';

interface RoleBadgeProps {
  role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge variant={role === 'admin' ? 'default' : 'success'}>
      {role === 'admin' ? 'Admin' : 'User'}
    </Badge>
  );
}
