import React from 'react'
import { ChatMessage as ChatMessageType } from '../types/ChatTypes'
import { formatTime } from '../utils/formatDate'
import { User, Bot } from 'lucide-react'
import { clsx } from 'clsx'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div
      className={clsx(
        'flex gap-3 p-4',
        isUser && 'flex-row-reverse',
        isSystem && 'justify-center'
      )}
    >
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser && 'bg-primary-600',
          !isUser && !isSystem && 'bg-gray-600',
          isSystem && 'bg-yellow-500'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isSystem ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div
        className={clsx(
          'flex-1 max-w-3xl',
          isUser && 'flex flex-col items-end',
          isSystem && 'text-center'
        )}
      >
        <div
          className={clsx(
            'rounded-lg px-4 py-2 text-sm',
            isUser && 'bg-primary-600 text-white',
            !isUser && !isSystem && 'bg-gray-100 text-gray-900',
            isSystem && 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div
          className={clsx(
            'text-xs text-gray-500 mt-1',
            isUser && 'text-right',
            isSystem && 'text-center'
          )}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
