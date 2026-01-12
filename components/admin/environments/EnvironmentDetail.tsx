'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Environment } from '@/types/environment';
import { Button } from '@/components/ui/Button';
import { UserList } from './UserList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface EnvironmentDetailProps {
  environmentId: string;
}

export function EnvironmentDetail({ environmentId }: EnvironmentDetailProps) {
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadEnvironment = () => {
      try {
        const stored = localStorage.getItem('environments');
        if (stored) {
          const environments: Environment[] = JSON.parse(stored);
          const env = environments.find((e) => e.id === environmentId);
          setEnvironment(env || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironment();
  }, [environmentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!environment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">Ambiente não encontrado.</p>
        <Button onClick={() => router.push('/admin/configure/environments')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/configure/environments')}
          aria-label="Voltar para lista de ambientes"
        >
          ← Voltar
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">{environment.name}</h1>
        <Link href={`/admin/configure/environments/${environmentId}/add-user`}>
          <Button className="bg-green-600 hover:bg-green-700" aria-label="Adicionar novo usuário">
            + New User
          </Button>
        </Link>
      </div>

      {/* Users List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuários Associados</h2>
        <UserList environmentId={environmentId} environment={environment} />
      </div>
    </div>
  );
}
