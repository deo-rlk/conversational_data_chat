'use client';

import React, { useState } from 'react';
import { CHAT_INPUT_MAX_LENGTH } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useQuestionLimit } from '@/contexts/QuestionLimitContext';

interface ChatInputProps {
  onSend: (question: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [question, setQuestion] = useState('');
  const { remaining } = useQuestionLimit();
  const charactersLeft = CHAT_INPUT_MAX_LENGTH - question.length;
  const canSend = question.trim().length > 0 && 
                  charactersLeft >= 0 && 
                  remaining > 0 && 
                  !disabled;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    
    onSend(question.trim());
    setQuestion('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 sm:p-4">
      <div className="flex gap-2 items-start">
        <div className="flex-1 min-w-0">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Escreva uma frase clara e direta sobre o que deseja saber"
            maxLength={CHAT_INPUT_MAX_LENGTH}
            disabled={disabled || remaining === 0}
            aria-label="Pergunta"
            className="text-sm sm:text-base"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-700">
              {charactersLeft >= 0 ? `${charactersLeft} caracteres restantes` : 'Limite excedido'}
            </p>
            {remaining === 0 && (
              <p className="text-xs text-red-600">Limite de perguntas atingido</p>
            )}
          </div>
        </div>
        <Button type="submit" disabled={!canSend} aria-label="Enviar pergunta">
          Enviar
        </Button>
      </div>
    </form>
  );
}
