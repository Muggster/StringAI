import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { appUser, loading } = useAuth()

  if (loading) return <FullPageSpinner />
  if (!appUser) return <Navigate to="/login" replace />
  if (!appUser.onboardingComplete) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
