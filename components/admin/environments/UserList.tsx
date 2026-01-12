'use client';

import React, { useState, useEffect } from 'react';
import { EnvironmentUser } from '@/types/environment';
import { UserCard } from './UserCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Environment } from '@/types/environment';

interface UserListProps {
  environmentId: string;
  environment: Environment | null;
}

export function UserList({ environmentId, environment }: UserListProps) {
  const [users, setUsers] = useState<EnvironmentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const canRemove = currentUser?.id === environment?.createdBy;

  useEffect(() => {
    const loadUsers = () => {
      try {
        const stored = localStorage.getItem(`environment_users_${environmentId}`);
        if (stored) {
          setUsers(JSON.parse(stored));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [environmentId]);

  const handleRemove = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    localStorage.setItem(`environment_users_${environmentId}`, JSON.stringify(updated));
  };

  // Update users list when new user is added (listen for storage events)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(`environment_users_${environmentId}`);
      if (stored) {
        setUsers(JSON.parse(stored));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check on focus in case of same-window updates
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [environmentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-700">
        <p>Nenhum usuário associado a este ambiente ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onRemove={handleRemove}
            canRemove={canRemove || false}
          />
        ))}
      </div>
    </div>
  );
}
