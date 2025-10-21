export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  isLoading?: boolean
}

export interface ChatUser {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error?: string
}

export interface SendMessageParams {
  content: string
  userId: string
}
