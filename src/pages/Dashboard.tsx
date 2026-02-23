import { Link } from 'react-router-dom'
import { Guitar, Flame, Clock, TrendingUp, ChevronRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSessions } from '@/hooks/useSessions'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MOOD_OPTIONS } from '@/lib/constants'
import type { SessionMood } from '@/types'

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MoodBadge({ mood }: { mood: SessionMood }) {
  const opt = MOOD_OPTIONS.find((m) => m.value === mood)
  return <span className="text-base">{opt?.label.split(' ')[0] ?? '—'}</span>
}

export default function Dashboard() {
  const { appUser } = useAuth()
  const { sessions, loading } = useSessions(5)

  const stats = appUser?.stats
  const firstName = appUser?.displayName?.split(' ')[0] ?? 'there'

  const hoursPracticed = Math.round((stats?.totalMinutes ?? 0) / 60 * 10) / 10

  return (
    <PageShell>
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-8">

        {/* Greeting */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Hey, {firstName} 👋</h1>
            <p className="text-muted-foreground mt-1">
              {stats?.currentStreak
                ? `You're on a ${stats.currentStreak}-day streak. Keep it going.`
                : "Ready to start your first session?"}
            </p>
          </div>
          <Button asChild size="lg" className="gap-2 glow-amber">
            <Link to="/practice">
              <Guitar className="h-4 w-4" />
              {stats?.totalSessions ? "Today's practice" : 'Start practicing'}
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Flame}
            label="Current streak"
            value={stats?.currentStreak ?? 0}
            sub={`Best: ${stats?.longestStreak ?? 0} days`}
          />
          <StatCard
            icon={Guitar}
            label="Sessions"
            value={stats?.totalSessions ?? 0}
            sub="total"
          />
          <StatCard
            icon={Clock}
            label="Hours practiced"
            value={hoursPracticed}
            sub={`${stats?.totalMinutes ?? 0} min total`}
          />
          <StatCard
            icon={TrendingUp}
            label="Skill level"
            value={appUser?.preferences.difficulty ?? '—'}
          />
        </div>

        {/* Today's Practice CTA (if no sessions yet today) */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Your AI coach is ready</p>
                <p className="text-sm text-muted-foreground">
                  Get a personalized {appUser?.preferences.dailyPracticeMinutes}-minute plan generated for today
                </p>
              </div>
            </div>
            <Button asChild variant="default">
              <Link to="/practice" className="flex items-center gap-1.5">
                View plan <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent sessions</h2>
            {sessions.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/history">View all</Link>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-xl border-dashed">
              <Guitar className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No sessions yet</p>
              <p className="text-sm mt-1">Complete your first practice to see history here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((s) => (
                <Card key={s.id}>
                  <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <MoodBadge mood={s.mood} />
                      <div>
                        <p className="text-sm font-medium">{s.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.durationMinutes} min · {s.drills.length} drill{s.drills.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {s.drills.slice(0, 3).map((d, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {d.drillName}
                        </Badge>
                      ))}
                      {s.drills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{s.drills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
