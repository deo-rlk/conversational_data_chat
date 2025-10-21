export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  LOOKER_CONFIG: 'looker_config',
} as const

export const ROUTES = {
  LOGIN: '/',
  CONFIG: '/config',
  LOADING: '/loading',
  CHAT: '/chat',
} as const

export const MESSAGES = {
  LOGIN: {
    TITLE: 'Bem-vindo ao Looker Conversational Interface',
    SUBTITLE: 'Faça login com sua conta Google para continuar',
  },
  CONFIG: {
    TITLE: 'Configuração do Looker',
    SUBTITLE: 'Insira suas credenciais para conectar ao MCP Looker',
    SUCCESS: 'Configuração salva com sucesso!',
    ERROR: 'Erro ao salvar configuração',
  },
  LOADING: {
    TITLE: 'Conectando ao Looker...',
    SUBTITLE: 'Aguarde enquanto estabelecemos a conexão com o MCP',
  },
  CHAT: {
    TITLE: 'Chat Conversacional',
    SUBTITLE: 'Converse com seus dados do Looker',
    PLACEHOLDER: 'Digite sua pergunta sobre os dados...',
  },
} as const

export const VALIDATION = {
  URL: {
    REQUIRED: 'URL do Looker é obrigatória',
    INVALID: 'URL inválida',
  },
  CLIENT_ID: {
    REQUIRED: 'Client ID é obrigatório',
  },
  CLIENT_SECRET: {
    REQUIRED: 'Client Secret é obrigatório',
  },
} as const
