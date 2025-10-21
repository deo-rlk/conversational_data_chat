import { User } from '../types/AuthTypes'

class AuthService {
  async getUserFromToken(token: string): Promise<User> {
    try {
      // Decodificar o JWT token do Google
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      throw new Error('Token inválido')
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      return payload.exp > currentTime
    } catch (error) {
      return false
    }
  }
}

export const authService = new AuthService()
