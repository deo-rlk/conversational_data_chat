import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfig } from '../config/useConfig'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Settings, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, User, Lock, Globe } from 'lucide-react'
import { MESSAGES } from '../utils/constants'

type ConfigStep = 'demo' | 'url' | 'clientId' | 'clientSecret' | 'summary'

interface ConfigData {
  url: string
  clientId: string
  clientSecret: string
  useDemo: boolean
}

export default function ConfigPage() {
  const navigate = useNavigate()
  const { saveConfig, isLoading, error, isConnected } = useConfig()
  const [currentStep, setCurrentStep] = useState<ConfigStep>('demo')
  const [configData, setConfigData] = useState<ConfigData>({
    url: '',
    clientId: '',
    clientSecret: '',
    useDemo: false,
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const steps: { key: ConfigStep; title: string; description: string; icon: React.ReactNode }[] = [
    {
      key: 'demo',
      title: 'Modo de Teste',
      description: 'Escolha entre usar credenciais reais ou modo demo',
      icon: <User className="w-6 h-6" />
    },
    {
      key: 'url',
      title: 'URL do Looker',
      description: 'Endereço base da sua instância Looker',
      icon: <Globe className="w-6 h-6" />
    },
    {
      key: 'clientId',
      title: 'Client ID',
      description: 'Identificador do cliente fornecido pelo Looker para autenticação',
      icon: <Settings className="w-6 h-6" />
    },
    {
      key: 'clientSecret',
      title: 'Client Secret',
      description: 'Segredo do cliente fornecido pelo Looker para autenticação',
      icon: <Lock className="w-6 h-6" />
    },
    {
      key: 'summary',
      title: 'Resumo',
      description: 'Revise suas configurações antes de conectar',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ]

  const currentStepIndex = steps.findIndex(step => step.key === currentStep)
  const currentStepData = steps[currentStepIndex]

  const handleInputChange = (field: keyof ConfigData, value: string | boolean) => {
    let processedValue = value
    
    // Auto-add https:// to URL if not present
    if (field === 'url' && typeof value === 'string') {
      const trimmedValue = value.trim()
      if (trimmedValue && !trimmedValue.startsWith('http://') && !trimmedValue.startsWith('https://')) {
        processedValue = `https://${trimmedValue}`
      }
    }
    
    setConfigData(prev => ({ ...prev, [field]: processedValue }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {}

    switch (currentStep) {
      case 'url':
        if (!configData.url.trim()) {
          errors.url = 'URL do Looker é obrigatória'
        } else if (!isValidUrl(configData.url)) {
          errors.url = 'URL inválida'
        }
        break
      case 'clientId':
        if (!configData.clientId.trim()) {
          errors.clientId = 'Client ID é obrigatório'
        }
        break
      case 'clientSecret':
        if (!configData.clientSecret.trim()) {
          errors.clientSecret = 'Client Secret é obrigatório'
        }
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 'demo') {
      if (configData.useDemo) {
        // Skip to summary if using demo mode
        setCurrentStep('summary')
      } else {
        setCurrentStep('url')
      }
      return
    }

    if (!validateCurrentStep()) {
      return
    }

    const stepOrder: ConfigStep[] = ['demo', 'url', 'clientId', 'clientSecret', 'summary']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const stepOrder: ConfigStep[] = ['demo', 'url', 'clientId', 'clientSecret', 'summary']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    if (configData.useDemo) {
      // Use demo credentials
      const demoConfig = {
        url: 'https://demo.looker.com',
        clientId: 'demo_client_id',
        clientSecret: 'demo_client_secret',
      }
      
      try {
        const success = await saveConfig(demoConfig)
        if (success) {
          navigate('/loading')
        }
      } catch (error) {
        console.error('Demo config error:', error)
      }
    } else {
      try {
        const success = await saveConfig({
          url: configData.url,
          clientId: configData.clientId,
          clientSecret: configData.clientSecret,
        })
        if (success) {
          navigate('/loading')
        }
      } catch (error) {
        console.error('Config save error:', error)
      }
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

  const canProceed = () => {
    switch (currentStep) {
      case 'demo':
        return true
      case 'url':
        return configData.url.trim() !== '' && isValidUrl(configData.url)
      case 'clientId':
        return configData.clientId.trim() !== ''
      case 'clientSecret':
        return configData.clientSecret.trim() !== ''
      case 'summary':
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'demo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como você gostaria de continuar?
              </h3>
              <p className="text-gray-600">
                Escolha entre usar suas credenciais reais do Looker ou testar com dados demo
              </p>
            </div>
            
            <div className="grid gap-4">
              <button
                onClick={() => handleInputChange('useDemo', false)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  !configData.useDemo 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Credenciais Reais</h4>
                    <p className="text-sm text-gray-600">Use suas credenciais do Looker</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleInputChange('useDemo', true)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  configData.useDemo 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Modo Demo</h4>
                    <p className="text-sm text-gray-600">Teste a aplicação com dados simulados</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )

      case 'url':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                URL do Looker
              </h3>
              <p className="text-gray-600">
                Endereço base da sua instância Looker
              </p>
            </div>
            
            <Input
              label="URL do Looker"
              type="url"
              placeholder="https://seu-looker.exemplo.com"
              value={configData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              error={validationErrors.url}
              required
            />
          </div>
        )

      case 'clientId':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Client ID
              </h3>
              <p className="text-gray-600">
                Identificador do cliente fornecido pelo Looker para autenticação
              </p>
            </div>
            
            <Input
              label="Client ID"
              type="text"
              placeholder="Seu Client ID do Looker"
              value={configData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              error={validationErrors.clientId}
              required
            />
          </div>
        )

      case 'clientSecret':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Client Secret
              </h3>
              <p className="text-gray-600">
                Segredo do cliente fornecido pelo Looker para autenticação
              </p>
            </div>
            
            <Input
              label="Client Secret"
              type="password"
              placeholder="Seu Client Secret do Looker"
              value={configData.clientSecret}
              onChange={(e) => handleInputChange('clientSecret', e.target.value)}
              error={validationErrors.clientSecret}
              required
            />
          </div>
        )

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Resumo da Configuração
              </h3>
              <p className="text-gray-600">
                Revise suas configurações antes de conectar
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {configData.useDemo ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-primary-600 mb-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Modo Demo Ativado</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    A aplicação será executada com dados simulados para demonstração
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">URL do Looker</p>
                      <p className="text-sm text-gray-600">{configData.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Client ID</p>
                      <p className="text-sm text-gray-600">{configData.clientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Client Secret</p>
                      <p className="text-sm text-gray-600">••••••••••••••••</p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Verify SSL</p>
                  <p className="text-sm text-gray-600">Desabilitado (configuração automática)</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index <= currentStepIndex
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : index === currentStepIndex + 1
                    ? 'border-primary-600 text-primary-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md mb-6">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isConnected && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md mb-6">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-600">Conectado com sucesso!</p>
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 'demo'}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              {currentStep === 'summary' ? (
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? 'Conectando...' : 'Conectar ao MCP'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
