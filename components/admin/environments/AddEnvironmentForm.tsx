'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Environment, Explore } from '@/types/environment';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmButton } from '@/components/admin/shared/ConfirmButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';

const AVAILABLE_EXPLORES: Explore[] = ['finance_transactions', 'ab_inventory', 'marketing_campaigns'];

export function AddEnvironmentForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    instanceUrl: '',
    clientId: '',
    clientSecret: '',
  });
  const [selectedExplores, setSelectedExplores] = useState<Explore[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestConnection = async () => {
    if (!formData.instanceUrl || !formData.clientId || !formData.clientSecret) {
      showToast('Preencha todos os campos de conexão', 'error');
      return;
    }

    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/mock/looker/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceUrl: formData.instanceUrl,
          clientId: formData.clientId,
          clientSecret: formData.clientSecret,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConnectionSuccess(true);
        showToast('Conexão testada com sucesso', 'success');
      } else {
        setConnectionSuccess(false);
        showToast(data.message || 'Falha na conexão', 'error');
      }
    } catch (error) {
      setConnectionSuccess(false);
      showToast('Erro ao testar conexão', 'error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionSuccess) {
      showToast('Teste a conexão antes de salvar', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newEnvironment: Environment = {
        id: `env-${Date.now()}`,
        ...formData,
        createdBy: user?.id || 'unknown',
        explores: selectedExplores,
        users: [],
      };

      const stored = localStorage.getItem('environments');
      const environments = stored ? JSON.parse(stored) : [];
      environments.push(newEnvironment);
      localStorage.setItem('environments', JSON.stringify(environments));

      showToast('Ambiente criado com sucesso', 'success');
      router.push('/admin/configure/environments');
    } catch (error) {
      showToast('Erro ao criar ambiente', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExplore = (explore: Explore) => {
    setSelectedExplores((prev) =>
      prev.includes(explore) ? prev.filter((e) => e !== explore) : [...prev, explore]
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4">
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 sm:pb-4 gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            aria-label="Cancelar"
          >
            ✕
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Novo Ambiente</h1>
          <ConfirmButton type="submit" disabled={!connectionSuccess || isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Confirmar'}
          </ConfirmButton>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Nome
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="instanceUrl" className="block text-sm font-medium text-gray-900 mb-2">
              Link da instância Looker
            </label>
            <Input
              id="instanceUrl"
              type="url"
              value={formData.instanceUrl}
              onChange={(e) => setFormData({ ...formData, instanceUrl: e.target.value })}
              placeholder="https://looker.example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-900 mb-2">
              Client ID
            </label>
            <Input
              id="clientId"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-900 mb-2">
              Client Secret
            </label>
            <Input
              id="clientSecret"
              type="password"
              value={formData.clientSecret}
              onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Explores</label>
            <div className="space-y-2 border rounded-md p-4 bg-white">
              {AVAILABLE_EXPLORES.map((explore) => (
                <label key={explore} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedExplores.includes(explore)}
                    onChange={() => toggleExplore(explore)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-900">{explore}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Test Connection */}
          <div className="border-t pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              variant="outline"
              className="w-full"
            >
              {isTestingConnection ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Testando conexão...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            {connectionSuccess && (
              <p className="mt-2 text-sm text-green-600">✓ Conexão bem-sucedida</p>
            )}
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
