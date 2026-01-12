'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';

export function DevRoleToggle() {
  const { user, updateRole } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV === 'production' || !user) return null;

  const toggleRole = () => {
    const newRole: Role = user.role === 'admin' ? 'user' : 'admin';
    updateRole(newRole);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-sm">
      <p className="font-semibold mb-2">DEV MODE</p>
      <button
        onClick={toggleRole}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
        aria-label="Toggle role"
      >
        Toggle Role: {user.role === 'admin' ? 'Admin' : 'User'}
      </button>
    </div>
  );
}
