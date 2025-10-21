import { useState, useEffect } from 'react'
import { User, AuthState } from '../types/AuthTypes'
import { authService } from '../services/authService'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: undefined,
  })

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const user = await authService.getUserFromToken(token)
        setState({ user, isLoading: false, error: undefined })
      } else {
        setState({ user: null, isLoading: false, error: undefined })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      setState({ user: null, isLoading: false, error: 'Falha na autenticação' })
    }
  }

  const login = async (token: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }))
      
      const user = await authService.getUserFromToken(token)
      localStorage.setItem('auth_token', token)
      
      setState({ user, isLoading: false, error: undefined })
    } catch (error) {
      console.error('Login failed:', error)
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Falha no login' 
      }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('looker_config')
    setState({ user: null, isLoading: false, error: undefined })
  }

  return {
    ...state,
    login,
    logout,
  }
}
