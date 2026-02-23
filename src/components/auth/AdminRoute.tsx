import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { FullPageSpinner } from './ProtectedRoute'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { appUser, loading } = useAuth()

  if (loading) return <FullPageSpinner />
  if (!appUser) return <Navigate to="/login" replace />
  if (appUser.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
