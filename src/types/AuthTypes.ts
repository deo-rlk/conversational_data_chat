export interface User {
  id: string
  name: string
  email: string
  picture?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error?: string
}

export interface GoogleAuthResponse {
  credential: string
  select_by: string
}
