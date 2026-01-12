export const QUESTION_LIMITS = {
  user: 10,
  admin: 25,
} as const;

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const CHAT_INPUT_MAX_LENGTH = 300;

export const LOADING_STEPS = [
  { id: 1, label: 'Conectando ao MCP', duration: 800 },
  { id: 2, label: 'Validando roles', duration: 600 },
  { id: 3, label: 'Pronto', duration: 400 },
] as const;
