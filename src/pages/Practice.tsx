import { Link } from 'react-router-dom'
import { Sparkles, Clock, Target, ChevronRight, RefreshCw, AlertCircle, Youtube } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useDrills } from '@/hooks/useDrills'
import { useSessions } from '@/hooks/useSessions'
import { useGoals } from '@/hooks/useGoals'
import { usePracticePlan } from '@/hooks/usePracticePlan'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORY_LABELS } from '@/lib/constants'

export default function Practice() {
  const { appUser } = useAuth()
  const { drills, loading: drillsLoading } = useDrills()
  const { sessions } = useSessions(7)
  const { goals } = useGoals(true)
  const { plan, loading, generating, error, generatePlan } = usePracticePlan(
    drills,
    sessions,
    goals,
  )

  const isLoading = loading || drillsLoading

  return (
    <PageShell>
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Today's Practice</h1>
          <p className="text-muted-foreground mt-1">
            {appUser?.preferences.dailyPracticeMinutes}-minute personalized plan for{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {/* No plan yet */}
        {!isLoading && !plan && !generating && (
          <Card className="border-dashed border-primary/40">
            <CardContent className="flex flex-col items-center text-center py-12 gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg mb-1">No plan yet for today</CardTitle>
                <CardDescription className="max-w-xs">
                  Your AI coach will build a personalized{' '}
                  {appUser?.preferences.dailyPracticeMinutes}-minute routine based on your
                  skill profile and goals.
                </CardDescription>
              </div>
              {drills.length === 0 ? (
                <p className="text-sm text-muted-foreground border rounded-lg px-4 py-2">
                  No drills in the library yet — an admin needs to add some first.
                </p>
              ) : (
                <Button onClick={generatePlan} className="gap-2 mt-2" size="lg">
                  <Sparkles className="h-4 w-4" />
                  Generate today's plan
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generating */}
        {generating && (
          <Card>
            <CardContent className="flex flex-col items-center py-12 gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Building your plan…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Analysing your skill profile and goals
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive flex-1">{error}</p>
              <Button variant="ghost" size="sm" onClick={generatePlan}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Plan exists */}
        {plan && (
          <>
            {/* AI notes */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-3">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{plan.aiNotes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Drill sections */}
            <div className="flex flex-col gap-3">
              {plan.sections.map((section, i) => (
                <Card key={i}>
                  <CardContent className="py-4 px-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h3 className="font-semibold">{section.drillName}</h3>
                        </div>
                        {/* Drill description — what it actually is */}
                        {drills.find((d) => d.id === section.drillId)?.description && (
                          <p className="text-xs text-muted-foreground/80 mb-1">
                            {drills.find((d) => d.id === section.drillId)?.description}
                          </p>
                        )}
                        {/* AI focus note for this session */}
                        <p className="text-sm text-muted-foreground italic">{section.focus}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {section.duration} min
                          </span>
                          {section.targetTempo && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Target className="h-3 w-3" />
                              {section.targetTempo.min}–{section.targetTempo.max} BPM
                            </span>
                          )}
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(section.drillName + ' guitar tutorial')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Youtube className="h-3 w-3" />
                            Watch example
                          </a>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {CATEGORY_LABELS[
                          drills.find((d) => d.id === section.drillId)?.category ?? ''
                        ] ?? 'Drill'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button asChild size="lg" className="flex-1 gap-2">
                <Link to={`/session/${plan.id}`}>
                  Start session <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              {!plan.completed && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={generatePlan}
                  disabled={generating}
                  title="Regenerate plan"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>

            {plan.completed && (
              <p className="text-center text-sm text-muted-foreground">
                ✓ Today's session complete — great work!
              </p>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
