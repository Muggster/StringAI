import { Users, BookOpen, Dumbbell, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useDrills } from '@/hooks/useDrills'
import { useLessons } from '@/hooks/useLessons'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardContent } from '@/components/ui/card'

function StatCard({ icon: Icon, label, value, href }: {
  icon: React.ElementType; label: string; value: number; href: string
}) {
  return (
    <Link to={href}>
      <Card className="hover:border-primary/40 transition-colors cursor-pointer">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function AdminDashboard() {
  const { users, loading: usersLoading } = useAdminUsers()
  const { drills, loading: drillsLoading } = useDrills()
  const { lessons, loading: lessonsLoading } = useLessons()

  const totalSessions = users.reduce((sum, u) => sum + (u.stats?.totalSessions ?? 0), 0)

  return (
    <PageShell>
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of StringAI content and users</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total users"
            value={usersLoading ? 0 : users.length}
            href="/admin/users"
          />
          <StatCard
            icon={BarChart3}
            label="Total sessions"
            value={usersLoading ? 0 : totalSessions}
            href="/admin/users"
          />
          <StatCard
            icon={Dumbbell}
            label="Drills"
            value={drillsLoading ? 0 : drills.length}
            href="/admin/drills"
          />
          <StatCard
            icon={BookOpen}
            label="Lessons"
            value={lessonsLoading ? 0 : lessons.length}
            href="/admin/lessons"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground font-medium">Quick links</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/drills" className="text-sm text-primary hover:underline">Manage drills →</Link>
            <Link to="/admin/lessons" className="text-sm text-primary hover:underline">Manage lessons →</Link>
            <Link to="/admin/users" className="text-sm text-primary hover:underline">Manage users →</Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
