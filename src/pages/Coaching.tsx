import { Sparkles, Brain } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCoaching } from '@/hooks/useCoaching'
import { PageShell } from '@/components/layout/PageShell'
import { CoachingReport } from '@/components/coaching/CoachingReport'
import { SkillProfileBar } from '@/components/coaching/SkillProfileBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Coaching() {
  const { appUser } = useAuth()
  const { reports, loading } = useCoaching()

  const postSession = reports.filter((r) => r.type === 'post-session')
  const weekly = reports.filter((r) => r.type === 'weekly')

  return (
    <PageShell>
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">AI Coaching</h1>
          <p className="text-muted-foreground mt-1">
            Personalized insights and recommendations from your AI coach
          </p>
        </div>

        {/* Skill profile */}
        {appUser && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Your skill profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkillProfileBar skillProfile={appUser.skillProfile} />
              <p className="text-xs text-muted-foreground mt-3">
                Scores update as you practice and receive coaching feedback.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Weekly reports */}
        {(weekly.length > 0 || loading) && (
          <section>
            <h2 className="font-semibold text-lg mb-3">Weekly summaries</h2>
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {weekly.map((r) => <CoachingReport key={r.id} report={r} />)}
              </div>
            )}
          </section>
        )}

        {/* Post-session reports */}
        <section>
          <h2 className="font-semibold text-lg mb-3">Session reports</h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
            </div>
          ) : postSession.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-xl border-dashed">
              <Sparkles className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No coaching reports yet</p>
              <p className="text-sm mt-1">Complete a practice session to receive your first report.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {postSession.map((r) => <CoachingReport key={r.id} report={r} />)}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}
