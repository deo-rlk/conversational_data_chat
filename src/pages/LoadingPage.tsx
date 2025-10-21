import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Header } from '../components/Header'
import { Loader2, CheckCircle, AlertCircle, Settings, Database, Zap, MessageSquare } from 'lucide-react'
import { MESSAGES } from '../utils/constants'

interface LoadingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: number
  status: 'pending' | 'loading' | 'completed' | 'error'
}

export default function LoadingPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: 'gemini',
      title: 'Configurando ambiente Gemini...',
      description: 'Instalando e configurando o Gemini CLI',
      icon: <Settings className="w-5 h-5" />,
      duration: 3000,
      status: 'pending'
    },
    {
      id: 'looker',
      title: 'Conectando ao Looker...',
      description: 'Estabelecendo conexão segura com sua instância Looker',
      icon: <Database className="w-5 h-5" />,
      duration: 4000,
      status: 'pending'
    },
    {
      id: 'mcp',
      title: 'Configurando MCP...',
      description: 'Configurando Model Context Protocol para integração',
      icon: <Zap className="w-5 h-5" />,
      duration: 3000,
      status: 'pending'
    },
    {
      id: 'interface',
      title: 'Preparando interface conversacional...',
      description: 'Finalizando configuração da interface de chat',
      icon: <MessageSquare className="w-5 h-5" />,
      duration: 2000,
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Concluído!',
      description: 'Tudo pronto para começar a conversar com seus dados',
      icon: <CheckCircle className="w-5 h-5" />,
      duration: 1000,
      status: 'pending'
    }
  ])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let stepTimeout: NodeJS.Timeout

    const startStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) return

      // Update current step to loading
      setSteps(prev => prev.map((step, index) => 
        index === stepIndex 
          ? { ...step, status: 'loading' }
          : step
      ))

      // Simulate step completion after duration
      stepTimeout = setTimeout(() => {
        // Mark current step as completed
        setSteps(prev => prev.map((step, index) => 
          index === stepIndex 
            ? { ...step, status: 'completed' }
            : step
        ))

        // Move to next step
        setCurrentStepIndex(stepIndex + 1)
        
        if (stepIndex + 1 < steps.length) {
          startStep(stepIndex + 1)
        } else {
          // All steps completed, navigate to chat
          setTimeout(() => {
            navigate('/chat')
          }, 1000)
        }
      }, steps[stepIndex].duration)
    }

    // Start progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    // Start first step
    startStep(0)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepTimeout)
    }
  }, [navigate, steps])

  const currentStep = steps[currentStepIndex]
  const completedSteps = steps.filter(step => step.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showLogout={false} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-2xl w-full mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {MESSAGES.LOADING.TITLE}
            </h1>
            
            <p className="text-gray-600 mb-8">
              {MESSAGES.LOADING.SUBTITLE}
            </p>

            {/* Progress Bar */}
            <div className="space-y-4 mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>{completedSteps} de {steps.length} etapas concluídas</span>
                <span>{progress}% concluído</span>
              </div>
            </div>
          </div>

          {/* Current Step */}
          {currentStep && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep.status === 'loading' 
                    ? 'bg-primary-100 text-primary-600' 
                    : currentStep.status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentStep.status === 'loading' ? (
                    <LoadingSpinner size="sm" />
                  ) : currentStep.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    currentStep.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {currentStep.title}
                  </h3>
                  <p className="text-gray-600">
                    {currentStep.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  step.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : step.status === 'loading'
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : step.status === 'loading' ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : step.status === 'loading'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      step.status === 'completed' || step.status === 'loading'
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${
                      step.status === 'completed' || step.status === 'loading'
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warning Message */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Atenção:</strong> Este processo pode levar de 5 a 10 minutos, 
                  dependendo do ambiente. Não feche esta janela durante a configuração.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
