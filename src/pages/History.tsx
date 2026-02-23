import { Guitar } from 'lucide-react'
import { useSessions } from '@/hooks/useSessions'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MOOD_OPTIONS } from '@/lib/constants'
import type { SessionMood } from '@/types'

function MoodEmoji({ mood }: { mood: SessionMood }) {
  const opt = MOOD_OPTIONS.find((m) => m.value === mood)
  return <span className="text-base">{opt?.label.split(' ')[0] ?? '—'}</span>
}

export default function History() {
  const { sessions, loading } = useSessions(50)

  return (
    <PageShell>
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Practice History</h1>
          <p className="text-muted-foreground mt-1">All your completed sessions</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border rounded-xl border-dashed">
            <Guitar className="h-10 w-10 mb-3 opacity-30" />
            <p className="font-medium">No sessions yet</p>
            <p className="text-sm mt-1">Complete your first practice session to see history here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <Card key={s.id}>
                <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <MoodEmoji mood={s.mood} />
                    <div>
                      <p className="text-sm font-medium">{s.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.durationMinutes} min · {s.drills.length} drill{s.drills.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {s.drills.slice(0, 3).map((d, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{d.drillName}</Badge>
                    ))}
                    {s.drills.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{s.drills.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>
    </PageShell>
  )
}
