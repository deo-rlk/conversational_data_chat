import { useState, useCallback } from 'react'
import { ChatMessage, SendMessageParams } from '../types/ChatTypes'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Como posso ajudá-lo com seus dados do Looker hoje?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async ({ content, userId }: SendMessageParams) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simular resposta do assistente
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Esta é uma resposta simulada. Em breve, esta interface se conectará ao MCP Looker para fornecer respostas reais baseadas nos seus dados.',
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: 'Olá! Como posso ajudá-lo com seus dados do Looker hoje?',
        role: 'assistant',
        timestamp: new Date(),
      }
    ])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
