import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Guitar, Clock, Music, Target, ChevronRight, ChevronLeft } from 'lucide-react'
import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { DifficultyLevel, MusicStyle, GoalType } from '@/types'
import { MUSIC_STYLES, PRACTICE_DURATIONS } from '@/lib/constants'

const STEPS = ['Experience', 'Practice time', 'Music styles', 'First goal']

const LEVELS: { value: DifficultyLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Complete beginner', description: "I've never played or just started" },
  { value: 'intermediate', label: 'Some experience', description: "I know a few chords and can strum along" },
  { value: 'advanced', label: 'Experienced player', description: "I've been playing for years" },
]

export default function Onboarding() {
  const { appUser, refreshAppUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner')
  const [dailyMinutes, setDailyMinutes] = useState(20)
  const [styles, setStyles] = useState<MusicStyle[]>([])
  const [goalType, setGoalType] = useState<GoalType>('technique')
  const [goalDescription, setGoalDescription] = useState('')

  function toggleStyle(style: MusicStyle) {
    setStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    )
  }

  async function finish() {
    if (!appUser) return
    setSaving(true)
    try {
      const userRef = doc(db, 'users', appUser.uid)
      await updateDoc(userRef, {
        'preferences.difficulty': difficulty,
        'preferences.dailyPracticeMinutes': dailyMinutes,
        'preferences.styles': styles,
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      })

      if (goalDescription.trim()) {
        await addDoc(collection(db, 'goals'), {
          userId: appUser.uid,
          type: goalType,
          description: goalDescription.trim(),
          target: {},
          completed: false,
          createdAt: serverTimestamp(),
        })
      }

      await refreshAppUser()
      navigate('/dashboard')
    } catch (err) {
      console.error('Onboarding save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Guitar className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Let's set up your practice</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </div>

        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-6" />

        <Card>
          <CardContent className="pt-6">
            {/* Step 0 — Experience level */}
            {step === 0 && (
              <div className="flex flex-col gap-3">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Guitar className="h-5 w-5 text-primary" /> How much guitar experience do you have?
                  </CardTitle>
                  <CardDescription>This helps us calibrate your practice plans.</CardDescription>
                </CardHeader>
                {LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setDifficulty(level.value)}
                    className={cn(
                      'flex flex-col items-start p-4 rounded-lg border-2 text-left transition-colors',
                      difficulty === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50',
                    )}
                  >
                    <span className="font-medium">{level.label}</span>
                    <span className="text-sm text-muted-foreground">{level.description}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1 — Practice time */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> How long can you practice each day?
                  </CardTitle>
                  <CardDescription>Even 10 minutes daily beats an hour once a week.</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-3 gap-2">
                  {PRACTICE_DURATIONS.map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDailyMinutes(mins)}
                      className={cn(
                        'py-3 rounded-lg border-2 font-medium text-sm transition-colors',
                        dailyMinutes === mins
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Music styles */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" /> What styles interest you?
                  </CardTitle>
                  <CardDescription>Pick as many as you like — this shapes what songs and techniques we focus on.</CardDescription>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {MUSIC_STYLES.map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={styles.includes(value) ? 'default' : 'outline'}
                      className="cursor-pointer select-none px-3 py-1.5 text-sm"
                      onClick={() => toggleStyle(value)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {styles.length === 0 ? 'Select at least one style (or skip)' : `${styles.length} selected`}
                </p>
              </div>
            )}

            {/* Step 3 — First goal */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> What's one thing you want to achieve?
                  </CardTitle>
                  <CardDescription>Your AI coach will build practice plans around this goal. You can change it anytime.</CardDescription>
                </CardHeader>

                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: 'technique', label: 'Master a technique' },
                      { value: 'song', label: 'Learn a song' },
                      { value: 'tempo', label: 'Hit a tempo goal' },
                      { value: 'consistency', label: 'Practice consistently' },
                    ] as { value: GoalType; label: string }[]
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setGoalType(value)}
                      className={cn(
                        'py-2.5 px-3 rounded-lg border-2 text-sm font-medium text-left transition-colors',
                        goalType === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="goalDesc">Describe your goal</Label>
                  <Input
                    id="goalDesc"
                    placeholder={
                      goalType === 'song'
                        ? 'e.g. Learn Wonderwall by Oasis'
                        : goalType === 'tempo'
                          ? 'e.g. Play G-to-C transition at 100 BPM'
                          : goalType === 'technique'
                            ? 'e.g. Nail barre chords without buzzing'
                            : 'e.g. Practice every day for 30 days'
                    }
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optional — you can skip and add goals later.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={saving}>
              {saving ? 'Saving…' : "Let's go!"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
