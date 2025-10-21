import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card'
import { Button } from '../components/Button'
import { MessageSquare, Settings, Database } from 'lucide-react'

export default function WelcomePage() {
  const navigate = useNavigate()

  const handleStartDemo = () => {
    navigate('/config')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Looker Conversational Interface
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Interface de demonstração para conversar com dados do Looker
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Demo</CardTitle>
            <CardDescription>
              Esta é uma versão de demonstração da interface conversacional do Looker.
              Você pode testar todas as funcionalidades sem necessidade de credenciais reais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Configuração Automática</h4>
                  <p className="text-sm text-blue-700">Setup automático do Gemini CLI e MCP</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Database className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Modo Demo</h4>
                  <p className="text-sm text-green-700">Teste com dados simulados do Looker</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-purple-900">Chat Inteligente</h4>
                  <p className="text-sm text-purple-700">Interface conversacional com IA</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> Esta é uma versão de demonstração. 
                A autenticação Google foi temporariamente desabilitada para facilitar os testes.
              </p>
            </div>

            <Button
              onClick={handleStartDemo}
              className="w-full"
              size="lg"
            >
              Iniciar Demonstração
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Versão de demonstração - Looker Conversational Interface
          </p>
        </div>
      </div>
    </div>
  )
}
