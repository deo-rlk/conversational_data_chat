import React, { useEffect, useRef } from 'react'
import { useChat } from '../hooks/useChat'
// import { useAuthContext } from '../auth/AuthContext'
import { Header } from '../components/Header'
import { ChatMessage } from '../components/ChatMessage'
import { ChatInput } from '../components/ChatInput'
import { Button } from '../components/Button'
import { MessageSquare, Trash2, Bot } from 'lucide-react'
import { MESSAGES } from '../utils/constants'

export default function ChatPage() {
  // Temporarily bypass authentication for demo purposes
  // const { user } = useAuthContext()
  const { messages, isLoading, sendMessage, clearMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    // Use demo user ID for demo purposes
    sendMessage({ content, userId: 'demo-user' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={MESSAGES.CHAT.TITLE} />
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Assistente Looker</h2>
                <p className="text-sm text-gray-500">Conectado e pronto para ajudar</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Chat
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bem-vindo ao Chat Conversacional
                </h3>
                <p className="text-gray-600 max-w-md">
                  {MESSAGES.CHAT.SUBTITLE}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 p-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={MESSAGES.CHAT.PLACEHOLDER}
        />
      </div>
    </div>
  )
}
