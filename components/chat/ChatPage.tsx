'use client';

import React, { useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { QuestionLimitBadge } from './QuestionLimitBadge';
import { ChatBackButton } from './ChatBackButton';
import { Message } from '@/types/chat';
import { useQuestionLimit } from '@/contexts/QuestionLimitContext';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { increment } = useQuestionLimit();
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleSend = async (question: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/mock/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (data.success) {
        const newMessage: Message = {
          id: Math.random().toString(36).substring(7),
          question,
          answer: data.answer,
          exploreUsed: data.exploreUsed,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        increment();
        showToast('Pergunta enviada com sucesso', 'success');
      } else {
        showToast('Erro ao processar pergunta', 'error');
      }
    } catch (error) {
      showToast('Erro ao enviar pergunta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-2 sm:p-4 flex items-center justify-between gap-2 shrink-0">
        <ChatBackButton />
        <QuestionLimitBadge />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-700">
            <p>Nenhuma mensagem ainda. Faça sua primeira pergunta!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} showDebug={user?.role === 'admin'} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
