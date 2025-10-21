import React, { useEffect, useRef } from 'react'
import { useAuthContext } from './AuthContext'

interface GoogleAuthProviderProps {
  onSuccess: (token: string) => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    google: any
  }
}

export function GoogleAuthProvider({ onSuccess, onError }: GoogleAuthProviderProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const { login } = useAuthContext()

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'pt-BR',
          })
        }
      }
    }

    const handleCredentialResponse = async (response: any) => {
      try {
        await login(response.credential)
        onSuccess(response.credential)
      } catch (error) {
        console.error('Google auth error:', error)
        onError('Falha na autenticação com Google')
      }
    }

    // Carregar o script do Google se ainda não estiver carregado
    if (!window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleAuth
      document.head.appendChild(script)
    } else {
      initializeGoogleAuth()
    }
  }, [login, onSuccess, onError])

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full" />
    </div>
  )
}
