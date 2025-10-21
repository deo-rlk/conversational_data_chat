import { LookerConfig, ConfigValidation } from '../types/ConfigTypes'

class ConfigService {
  validateConfig(config: Partial<LookerConfig>): ConfigValidation {
    const errors: ConfigValidation['errors'] = {}

    if (!config.url?.trim()) {
      errors.url = 'URL do Looker é obrigatória'
    } else if (!this.isValidUrl(config.url)) {
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
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  formatConfigForMCP(config: Omit<LookerConfig, 'ssl'>): LookerConfig {
    return {
      ...config,
      ssl: false, // Sempre false conforme especificado
    }
  }
}

export const configService = new ConfigService()
