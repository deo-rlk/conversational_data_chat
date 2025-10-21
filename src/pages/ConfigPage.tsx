import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfig } from '../config/useConfig'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Settings, AlertCircle, CheckCircle } from 'lucide-react'
import { MESSAGES } from '../utils/constants'

export default function ConfigPage() {
  const navigate = useNavigate()
  const { saveConfig, isLoading, error, isConnected } = useConfig()
  const [formData, setFormData] = useState({
    url: '',
    clientId: '',
    clientSecret: '',
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.url.trim()) {
      errors.url = 'URL do Looker é obrigatória'
    } else if (!isValidUrl(formData.url)) {
      errors.url = 'URL inválida'
    }

    if (!formData.clientId.trim()) {
      errors.clientId = 'Client ID é obrigatório'
    }

    if (!formData.clientSecret.trim()) {
      errors.clientSecret = 'Client Secret é obrigatório'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const success = await saveConfig(formData)
      if (success) {
        navigate('/loading')
      }
    } catch (error) {
      console.error('Config save error:', error)
    }
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {MESSAGES.CONFIG.TITLE}
          </h1>
          <p className="mt-2 text-gray-600">
            {MESSAGES.CONFIG.SUBTITLE}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Credenciais do Looker</CardTitle>
            <CardDescription>
              Insira as informações necessárias para conectar ao MCP Looker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {isConnected && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-600">Conectado com sucesso!</p>
                </div>
              )}

              <Input
                label="URL do Looker"
                type="url"
                placeholder="https://seu-looker.exemplo.com"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                error={validationErrors.url}
                required
              />

              <Input
                label="Client ID"
                type="text"
                placeholder="Seu Client ID do Looker"
                value={formData.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                error={validationErrors.clientId}
                required
              />

              <Input
                label="Client Secret"
                type="password"
                placeholder="Seu Client Secret do Looker"
                value={formData.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                error={validationErrors.clientSecret}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> A conexão SSL será configurada automaticamente como desabilitada.
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Conectando...' : 'Conectar ao MCP'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
