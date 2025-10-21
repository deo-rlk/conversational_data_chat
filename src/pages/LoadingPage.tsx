import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Header } from '../components/Header'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { MESSAGES } from '../utils/constants'

export default function LoadingPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    'Validando credenciais...',
    'Estabelecendo conexão com o Looker...',
    'Configurando MCP...',
    'Preparando interface conversacional...',
    'Concluído!'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            navigate('/chat')
          }, 1000)
          return 100
        }
        return prev + 2
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showLogout={false} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {MESSAGES.LOADING.TITLE}
            </h1>
            
            <p className="text-gray-600 mb-8">
              {MESSAGES.LOADING.SUBTITLE}
            </p>

            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-sm text-gray-500">
                {progress}% concluído
              </p>
            </div>

            <div className="mt-8 space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 text-sm ${
                    index <= currentStep
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : index === currentStep ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Este processo pode levar alguns segundos. 
                Aguarde enquanto configuramos tudo para você.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
