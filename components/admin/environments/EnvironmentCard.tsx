'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Environment } from '@/types/environment';
import { Button } from '@/components/ui/Button';
import { ModalConfirm } from '@/components/ui/ModalConfirm';
import { useAuth } from '@/contexts/AuthContext';

interface EnvironmentCardProps {
  environment: Environment;
  onDelete: (id: string) => void;
}

export function EnvironmentCard({ environment, onDelete }: EnvironmentCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const { user } = useAuth();
  const canDelete = user?.id === environment.createdBy;

  useEffect(() => {
    const loadUserCount = () => {
      try {
        const stored = localStorage.getItem(`environment_users_${environment.id}`);
        if (stored) {
          const users = JSON.parse(stored);
          setUserCount(users.length || 0);
        } else {
          setUserCount(0);
        }
      } catch (error) {
        console.error(error);
        setUserCount(0);
      }
    };

    loadUserCount();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadUserCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [environment.id]);

  return (
    <>
      <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{environment.name}</h3>
          <p className="text-sm text-gray-700">{environment.instanceUrl}</p>
          <p className="text-xs text-gray-600 mt-1">
            {environment.explores.length} explore(s) configurado(s)
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {userCount} usuário(s) configurado(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/configure/environments/${environment.id}`}>
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              aria-label={`Abrir ambiente ${environment.name}`}
            >
              →
            </Button>
          </Link>
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              aria-label={`Excluir ambiente ${environment.name}`}
            >
              -
            </Button>
          )}
        </div>
      </div>

      <ModalConfirm
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(environment.id)}
        title="Excluir Ambiente"
        message={`Tem certeza que deseja excluir o ambiente "${environment.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="destructive"
      />
    </>
  );
}
