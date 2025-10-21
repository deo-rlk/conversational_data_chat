export interface LookerConfig {
  url: string
  clientId: string
  clientSecret: string
  ssl: boolean // Sempre false
  useDemo?: boolean
}

export interface ConfigState {
  config: LookerConfig | null
  isLoading: boolean
  error?: string
  isConnected: boolean
}

export interface ConfigValidation {
  isValid: boolean
  errors: {
    url?: string
    clientId?: string
    clientSecret?: string
  }
}
