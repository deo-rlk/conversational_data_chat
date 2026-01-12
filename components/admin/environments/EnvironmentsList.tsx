'use client';

import React, { useState, useEffect } from 'react';
import { Environment } from '@/types/environment';
import { EnvironmentCard } from './EnvironmentCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';

export function EnvironmentsList() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Load environments from localStorage or seed data
    const loadEnvironments = () => {
      try {
        const stored = localStorage.getItem('environments');
        if (stored) {
          setEnvironments(JSON.parse(stored));
        } else {
          // Load from seed data
          fetch('/data/seed.json')
            .then((res) => res.json())
            .then((data) => {
              setEnvironments(data.environments || []);
              localStorage.setItem('environments', JSON.stringify(data.environments || []));
            })
            .catch(() => {
              setEnvironments([]);
            });
        }
      } catch (error) {
        console.error(error);
        setEnvironments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironments();
  }, []);

  const handleDelete = (id: string) => {
    const updated = environments.filter((env) => env.id !== id);
    setEnvironments(updated);
    localStorage.setItem('environments', JSON.stringify(updated));
    showToast('Ambiente excluído com sucesso', 'success');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (environments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">Nenhum ambiente configurado ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-4">
        {environments.map((env) => (
          <EnvironmentCard key={env.id} environment={env} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
