import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider } from '../auth/GoogleAuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card'
import { MessageSquare, AlertCircle } from 'lucide-react'
import { MESSAGES } from '../utils/constants'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleAuthSuccess = (token: string) => {
    setError(null)
    navigate('/config')
  }

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {MESSAGES.LOGIN.TITLE}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {MESSAGES.LOGIN.SUBTITLE}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Use sua conta Google para acessar a interface conversacional do Looker
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <GoogleAuthProvider
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Ao continuar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  )
}
