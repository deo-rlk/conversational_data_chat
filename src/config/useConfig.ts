import { useState, useCallback } from 'react'
import { LookerConfig, ConfigState, ConfigValidation } from '../types/ConfigTypes'
import { lookerService } from '../services/lookerService'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { websocketService, WebSocketMessage } from '../services/websocketService'

export function useConfig() {
  const [config, setConfig] = useLocalStorage<LookerConfig | null>('looker_config', null)
  const [state, setState] = useState<ConfigState>({
    config,
    isLoading: false,
    error: undefined,
    isConnected: false,
  })

  const validateConfig = useCallback((config: Partial<LookerConfig>): ConfigValidation => {
    const errors: ConfigValidation['errors'] = {}

    if (!config.url?.trim()) {
      errors.url = 'URL do Looker é obrigatória'
    } else if (!isValidUrl(config.url)) {
      errors.url = 'URL inválida'
    }

    if (!config.clientId?.trim()) {
      errors.clientId = 'Client ID é obrigatório'
    }

    if (!config.clientSecret?.trim()) {
      errors.clientSecret = 'Client Secret é obrigatório'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }, [])

  const saveConfig = useCallback(async (newConfig: Omit<LookerConfig, 'ssl'>) => {
    const configWithSSL: LookerConfig = {
      ...newConfig,
      ssl: false, // Sempre false conforme especificado
    }

    const validation = validateConfig(configWithSSL)
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: 'Configuração inválida',
      }))
      return false
    }

    setState(prev => ({ ...prev, isLoading: true, error: undefined }))

    try {
      // Try to connect to WebSocket for real-time updates
      try {
        await websocketService.connect({
          onStatusUpdate: (message: WebSocketMessage) => {
            console.log('WebSocket status update:', message)
            // You can emit events or update state here if needed
          },
          onError: (error: string) => {
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: error,
            }))
          },
          onComplete: () => {
            setConfig(configWithSSL)
            setState({
              config: configWithSSL,
              isLoading: false,
              error: undefined,
              isConnected: true,
            })
          }
        })

        // Start configuration process
        websocketService.startConfiguration(configWithSSL)
        
        return true
      } catch (wsError) {
        console.warn('WebSocket connection failed, using fallback mode:', wsError)
        
        // Fallback: simulate configuration without backend
        console.log('WebSocket connection failed, using fallback mode')
        
        if (configWithSSL.useDemo) {
          // For demo mode, simulate success immediately
          console.log('Demo mode: simulating configuration success')
          setTimeout(() => {
            setConfig(configWithSSL)
            setState({
              config: configWithSSL,
              isLoading: false,
              error: undefined,
              isConnected: true,
            })
          }, 2000)
          return true
        } else {
          // For real credentials, show error about backend
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Backend não está rodando. Para usar credenciais reais, inicie o servidor Python com: python backend/simple_ws_backend.py',
          }))
          return false
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }))
      return false
    }
  }, [validateConfig, setConfig])

  const clearConfig = useCallback(() => {
    setConfig(null)
    setState({
      config: null,
      isLoading: false,
      error: undefined,
      isConnected: false,
    })
  }, [setConfig])

  return {
    ...state,
    saveConfig,
    clearConfig,
    validateConfig,
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
