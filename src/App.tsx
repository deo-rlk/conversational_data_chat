import { Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider } from './auth/AuthContext'
// import { useAuth } from './auth/useAuth'
// import LoginPage from './pages/LoginPage'
import WelcomePage from './pages/WelcomePage'
import ConfigPage from './pages/ConfigPage'
import LoadingPage from './pages/LoadingPage'
import ChatPage from './pages/ChatPage'

function AppRoutes() {
  // Temporarily bypass authentication for demo purposes
  // const { user, isLoading } = useAuth()

  // if (isLoading) {
  //   return <LoadingPage />
  // }

  // if (!user) {
  //   return <LoginPage />
  // }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/config" element={<ConfigPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    // Temporarily bypass AuthProvider for demo purposes
    // <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    // </AuthProvider>
  )
}

export default App
