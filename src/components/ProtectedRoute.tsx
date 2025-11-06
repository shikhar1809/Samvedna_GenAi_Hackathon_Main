import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  // Demo mode flag - check if user is in demo mode
  const isDemoMode = sessionStorage.getItem('demoMode') === 'true'

  if (loading && !isDemoMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access in demo mode or if user is authenticated
  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />
  }

  // Enable demo mode if accessing from dashboard without auth
  if (!user && !isDemoMode && location.pathname === '/dashboard') {
    sessionStorage.setItem('demoMode', 'true')
  }

  return (
    <>
      {/* Demo Mode Banner */}
      {isDemoMode && !user && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 text-center text-sm font-medium">
          🚀 Demo Mode - You're testing without authentication. Data won't be saved.
        </div>
      )}
      {children}
    </>
  )
}

