import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { generatePostSessionReport } from '@/lib/gemini'
import { TODAY } from '@/lib/constants'
import { PageShell } from '@/components/layout/PageShell'
import { Metronome } from '@/components/practice/Metronome'
import { SessionTimer } from '@/components/practice/SessionTimer'
import { DrillResultForm } from '@/components/practice/DrillResultForm'
import { SessionMoodPicker } from '@/components/practice/SessionMoodPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FullPageSpinner } from '@/components/auth/ProtectedRoute'
import { ChevronLeft, CheckCircle2, Sparkles, Youtube } from 'lucide-react'
import { useDrills } from '@/hooks/useDrills'
import type { PracticePlan, DrillResult, SessionMood } from '@/types'

type Phase = 'drill' | 'logging' | 'mood' | 'done'

function updateStreak(
  stats: { currentStreak: number; longestStreak: number; totalSessions: number; totalMinutes: number; lastSessionDate: string | null },
  durationMinutes: number,
) {
  const today = TODAY()
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })()

  let newStreak = 1
  if (stats.lastSessionDate === today) newStreak = stats.currentStreak
  else if (stats.lastSessionDate === yesterday) newStreak = stats.currentStreak + 1

  return {
    totalSessions: stats.totalSessions + 1,
    totalMinutes: stats.totalMinutes + durationMinutes,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    lastSessionDate: today,
  }
}

export default function Session() {
  const { planId } = useParams<{ planId: string }>()
  const { appUser, refreshAppUser } = useAuth()
  const navigate = useNavigate()

  const { drills } = useDrills()
  const [plan, setPlan] = useState<PracticePlan | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('drill')
  const [drillResults, setDrillResults] = useState<DrillResult[]>([])
  const [mood, setMood] = useState<SessionMood | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!planId) return
    getDoc(doc(db, 'practicePlans', planId)).then((snap) => {
      if (snap.exists()) setPlan({ id: snap.id, ...snap.data() } as PracticePlan)
      setLoadingPlan(false)
    })
  }, [planId])

  const currentSection = plan?.sections[currentIndex]
  const totalSections = plan?.sections.length ?? 0
  const progress = totalSections > 0 ? ((currentIndex) / totalSections) * 100 : 0

  function handleDrillLogged(result: Omit<DrillResult, 'drillId' | 'drillName'>) {
    if (!currentSection) return
    const fullResult: DrillResult = {
      drillId: currentSection.drillId,
      drillName: currentSection.drillName,
      ...result,
    }
    const newResults = [...drillResults, fullResult]
    setDrillResults(newResults)

    if (currentIndex + 1 < totalSections) {
      setCurrentIndex((i) => i + 1)
      setPhase('drill')
    } else {
      setPhase('mood')
    }
  }

  const handleElapsed = useCallback((s: number) => setElapsedSeconds(s), [])

  async function submitSession() {
    if (!appUser || !plan || !mood) return
    setSubmitting(true)
    try {
      const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60))

      // Write session doc
      const sessionRef = await addDoc(collection(db, 'practiceSessions'), {
        userId: appUser.uid,
        planId: plan.id,
        date: TODAY(),
        durationMinutes,
        drills: drillResults,
        mood,
        createdAt: serverTimestamp(),
      })

      // Mark plan completed
      await updateDoc(doc(db, 'practicePlans', plan.id), { completed: true })

      // Update user stats + streak
      const newStats = updateStreak(appUser.stats, durationMinutes)
      await updateDoc(doc(db, 'users', appUser.uid), {
        stats: newStats,
      })

      // Generate post-session coaching report (fire and forget — don't block)
      const session = {
        id: sessionRef.id,
        userId: appUser.uid,
        planId: plan.id,
        date: TODAY(),
        durationMinutes,
        drills: drillResults,
        mood,
        createdAt: serverTimestamp() as never,
      }
      generatePostSessionReport(session, appUser)
        .then((report) =>
          addDoc(collection(db, 'aiCoaching'), {
            ...report,
            userId: appUser.uid,
            createdAt: serverTimestamp(),
          }),
        )
        .catch((err) => console.error('Coaching report failed (non-critical):', err))

      await refreshAppUser()
      setPhase('done')
    } catch (err) {
      console.error('Session submit failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingPlan) return <FullPageSpinner />

  if (!plan) {
    return (
      <PageShell>
        <div className="p-8 text-center text-muted-foreground">
          <p>Session not found.</p>
          <Button variant="ghost" onClick={() => navigate('/practice')} className="mt-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to practice
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="p-4 md:p-6 max-w-xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/practice')}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <SessionTimer running={phase === 'drill' || phase === 'logging'} onElapsed={handleElapsed} />
        </div>

        {/* Progress bar */}
        {phase !== 'done' && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {phase === 'mood'
                  ? 'All drills complete'
                  : `Drill ${currentIndex + 1} of ${totalSections}`}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={phase === 'mood' ? 100 : progress} />
          </div>
        )}

        {/* ── Drill phase ── */}
        {phase === 'drill' && currentSection && (
          <Card>
            <CardHeader className="pb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Drill {currentIndex + 1} / {totalSections}
              </div>
              <CardTitle className="text-xl">{currentSection.drillName}</CardTitle>
              {drills.find((d) => d.id === currentSection.drillId)?.description && (
                <p className="text-xs text-muted-foreground/80 mt-0.5">
                  {drills.find((d) => d.id === currentSection.drillId)?.description}
                </p>
              )}
              <CardDescription className="text-sm italic mt-1">{currentSection.focus}</CardDescription>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentSection.drillName + ' guitar tutorial')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors w-fit mt-1"
              >
                <Youtube className="h-3 w-3" />
                Watch example
              </a>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Metronome
                initialBpm={currentSection.targetTempo?.min ?? 80}
                minBpm={Math.max(20, (currentSection.targetTempo?.min ?? 60) - 20)}
                maxBpm={Math.min(240, (currentSection.targetTempo?.max ?? 120) + 20)}
              />
              <Button onClick={() => setPhase('logging')} className="w-full">
                Done with this drill — log it
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Logging phase ── */}
        {phase === 'logging' && currentSection && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Log: {currentSection.drillName}</CardTitle>
              <CardDescription>How did it go?</CardDescription>
            </CardHeader>
            <CardContent>
              <DrillResultForm section={currentSection} onSubmit={handleDrillLogged} />
            </CardContent>
          </Card>
        )}

        {/* ── Mood phase ── */}
        {phase === 'mood' && (
          <Card>
            <CardHeader>
              <CardTitle>Session complete! 🎸</CardTitle>
              <CardDescription>
                You finished all {totalSections} drill{totalSections !== 1 ? 's' : ''} in{' '}
                {Math.round(elapsedSeconds / 60)} min. One last thing:
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SessionMoodPicker value={mood} onChange={setMood} />
              <Button
                onClick={submitSession}
                disabled={!mood || submitting}
                size="lg"
                className="w-full gap-2"
              >
                {submitting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Saving & generating report…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Finish session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Done phase ── */}
        {phase === 'done' && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center text-center py-10 gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Great session!</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Your AI coach is generating a personalised report.
                </p>
                {appUser?.stats.currentStreak && appUser.stats.currentStreak > 1 && (
                  <p className="text-primary font-semibold mt-2">
                    🔥 {appUser.stats.currentStreak}-day streak!
                  </p>
                )}
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <Button asChild>
                  <a href="/coaching">View coaching report</a>
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
