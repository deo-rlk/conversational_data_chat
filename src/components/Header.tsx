import React from 'react'
import { useAuthContext } from '../auth/AuthContext'
import { Button } from './Button'
import { LogOut, MessageSquare } from 'lucide-react'

interface HeaderProps {
  title?: string
  showLogout?: boolean
}

export function Header({ title = 'Looker Conversational Interface', showLogout = true }: HeaderProps) {
  const { user, logout } = useAuthContext()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {user && (
              <p className="text-sm text-gray-500">Olá, {user.name}</p>
            )}
          </div>
        </div>
        
        {showLogout && user && (
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </Button>
        )}
      </div>
    </header>
  )
}
