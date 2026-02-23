import { Link, useNavigate } from 'react-router-dom'
import { Guitar, LogOut, Settings, ShieldCheck, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarContent } from './Sidebar'

export function Navbar() {
  const { appUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const initials = appUser?.displayName
    ? appUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : appUser?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile sidebar toggle */}
        {appUser?.onboardingComplete && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <Link to={appUser ? '/dashboard' : '/'} className="flex items-center gap-2 font-semibold">
          <Guitar className="h-5 w-5 text-primary" />
          <span>StringAI</span>
        </Link>

        <div className="flex-1" />

        {/* Right side */}
        {appUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{appUser.displayName ?? 'Student'}</p>
                <p className="text-xs text-muted-foreground truncate">{appUser.email}</p>
              </div>
              <DropdownMenuSeparator />
              {appUser.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Admin panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/goals" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Goals & settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
