'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { EnvironmentUser } from '@/types/environment';

interface AddUserFormProps {
  environmentId: string;
}

export function AddUserForm({ environmentId }: AddUserFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [lookerUser, setLookerUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookerUser.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/mock/looker/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environmentId,
          lookerUser: lookerUser.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save user to localStorage
        const stored = localStorage.getItem(`environment_users_${environmentId}`);
        const users: EnvironmentUser[] = stored ? JSON.parse(stored) : [];
        
        const newUser: EnvironmentUser = {
          id: data.userId,
          lookerUser: lookerUser.trim(),
          role: data.role as 'user' | 'admin',
          environmentId,
        };

        users.push(newUser);
        localStorage.setItem(`environment_users_${environmentId}`, JSON.stringify(users));
        
        // Trigger storage event for same-window listeners
        window.dispatchEvent(new Event('storage'));

        showToast(`Usuário ${lookerUser} adicionado — role: Apenas perguntar`, 'success');
        router.push(`/admin/configure/environments/${environmentId}`);
      } else {
        showToast('Erro ao adicionar usuário', 'error');
      }
    } catch (error) {
      showToast('Erro ao adicionar usuário', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Adicionar Usuário</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lookerUser" className="block text-sm font-medium text-gray-900 mb-2">
            Usuário Looker
          </label>
          <Input
            id="lookerUser"
            value={lookerUser}
            onChange={(e) => setLookerUser(e.target.value)}
            placeholder="usuario.looker"
            required
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isLoading || !lookerUser.trim()}
          aria-label="Adicionar usuário"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Adicionando...
            </>
          ) : (
            <>+ Adicionar</>
          )}
        </Button>
      </form>
    </div>
  );
}
