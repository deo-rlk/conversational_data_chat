import { LookerConfig } from '../types/ConfigTypes'

export interface WebSocketMessage {
  status: 'loading' | 'installing' | 'done' | 'error'
  message: string
  progress: number
  step: string
}

export interface WebSocketCallbacks {
  onStatusUpdate: (message: WebSocketMessage) => void
  onError: (error: string) => void
  onComplete: () => void
}

class WebSocketService {
  private ws: WebSocket | null = null
  private callbacks: WebSocketCallbacks | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(callbacks: WebSocketCallbacks): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.callbacks = callbacks
        
        // Add timeout for connection
        const connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close()
            reject(new Error('WebSocket connection timeout'))
          }
        }, 5000)

        this.ws = new WebSocket('ws://localhost:8001/ws')

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          clearTimeout(connectionTimeout)
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.callbacks?.onStatusUpdate(message)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason)
          clearTimeout(connectionTimeout)
          this.ws = null
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnect()
          } else if (event.code !== 1000) {
            this.callbacks?.onError('Conexão com o servidor perdida')
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          clearTimeout(connectionTimeout)
          this.callbacks?.onError('Erro de conexão com o servidor')
          reject(new Error('WebSocket connection failed'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private reconnect() {
    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      if (this.callbacks) {
        this.connect(this.callbacks).catch(console.error)
      }
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  startConfiguration(config: LookerConfig) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected')
    }

    this.ws.send(JSON.stringify({
      type: 'start_config',
      config: {
        url: config.url,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        use_demo: config.useDemo || false
      }
    }))
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.callbacks = null
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const websocketService = new WebSocketService()
