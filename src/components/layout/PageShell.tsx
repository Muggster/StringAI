import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/context/AuthContext'

interface PageShellProps {
  children: ReactNode
  /** Pass true on pages that should NOT show the sidebar (Landing, Login, etc.) */
  plain?: boolean
}

export function PageShell({ children, plain = false }: PageShellProps) {
  const { appUser } = useAuth()
  const showSidebar = !plain && appUser?.onboardingComplete

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
