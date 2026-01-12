'use client';

import React from 'react';
import { Message } from '@/types/chat';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageProps {
  message: Message;
  showDebug?: boolean;
}

export function ChatMessage({ message, showDebug = false }: ChatMessageProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-2">
      {/* Question */}
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
          <p className="text-sm">{message.question}</p>
          <p className="text-xs opacity-75 mt-1">{formatDate(message.timestamp)}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="flex justify-start">
        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-[80%]">
          <p className="text-sm">{message.answer}</p>
          {isAdmin && showDebug && message.exploreUsed && (
            <div className="mt-2">
              <Badge variant="default">Explore: {message.exploreUsed}</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
