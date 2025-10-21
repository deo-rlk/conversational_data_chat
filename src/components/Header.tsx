import React from 'react'
// import { useAuthContext } from '../auth/AuthContext'
import { Button } from './Button'
import { LogOut, MessageSquare, User } from 'lucide-react'

interface HeaderProps {
  title?: string
  showLogout?: boolean
}

export function Header({ title = 'Looker Conversational Interface', showLogout = true }: HeaderProps) {
  // Temporarily bypass authentication for demo purposes
  // const { user, logout } = useAuthContext()

  const handleLogout = () => {
    // Clear any stored data and redirect to welcome page
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Usuário Demo</p>
          </div>
        </div>
        
        {showLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Reiniciar</span>
          </Button>
        )}
      </div>
    </header>
  )
}
