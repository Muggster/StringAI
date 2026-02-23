import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Guitar,
  Dumbbell,
  BookOpen,
  Music2,
  MessageSquare,
  Target,
  History,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/practice', label: 'Practice', icon: Guitar },
  { to: '/history', label: 'History', icon: History },
  { to: '/coaching', label: 'AI Coaching', icon: Sparkles },
  { to: '/goals', label: 'Goals', icon: Target },
]

const referenceLinks = [
  { to: '/drills', label: 'Drills', icon: Dumbbell },
  { to: '/chords', label: 'Chords', icon: Music2 },
  { to: '/lessons', label: 'Lessons', icon: BookOpen },
  { to: '/tutor', label: 'Ask the Tutor', icon: MessageSquare },
]

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: ShieldCheck },
  { to: '/admin/drills', label: 'Drills', icon: Dumbbell },
  { to: '/admin/lessons', label: 'Lessons', icon: BookOpen },
  { to: '/admin/users', label: 'Users', icon: ShieldCheck },
]

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  )
}

export function SidebarContent() {
  const { appUser } = useAuth()

  return (
    <div className="flex flex-col gap-1 p-4 h-full">
      <nav className="flex flex-col gap-1">
        {studentLinks.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </nav>

      <div className="mt-4">
        <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Reference
        </p>
        <nav className="flex flex-col gap-1 mt-1">
          {referenceLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
      </div>

      {appUser?.role === 'admin' && (
        <div className="mt-4">
          <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin
          </p>
          <nav className="flex flex-col gap-1 mt-1">
            {adminLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 shrink-0 border-r flex-col">
      <SidebarContent />
    </aside>
  )
}
