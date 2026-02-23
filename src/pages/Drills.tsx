import { useState, useMemo } from 'react'
import { Dumbbell } from 'lucide-react'
import { useDrills } from '@/hooks/useDrills'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import type { DrillCategory, DifficultyLevel } from '@/types'

const CATEGORY_OPTIONS: { value: DrillCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'warmup', label: 'Warm-up' },
  { value: 'scale', label: 'Scale' },
  { value: 'technique', label: 'Technique' },
  { value: 'chord', label: 'Chord' },
  { value: 'song', label: 'Song' },
]

const DIFF_OPTIONS: { value: DifficultyLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export default function Drills() {
  const { drills, loading } = useDrills()
  const [category, setCategory] = useState<DrillCategory | 'all'>('all')
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all')

  const filtered = useMemo(() => {
    return drills.filter((d) => {
      if (category !== 'all' && d.category !== category) return false
      if (difficulty !== 'all' && d.difficulty !== difficulty) return false
      return true
    })
  }, [drills, category, difficulty])

  return (
    <PageShell>
      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Drill Library</h1>
          <p className="text-muted-foreground mt-1">
            Browse available practice exercises — your AI coach selects from these when building your plan
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORY_OPTIONS.map((opt) => (
              <Button key={opt.value} size="sm"
                variant={category === opt.value ? 'default' : 'outline'}
                onClick={() => setCategory(opt.value)}>
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {DIFF_OPTIONS.map((opt) => (
              <Button key={opt.value} size="sm"
                variant={difficulty === opt.value ? 'default' : 'outline'}
                onClick={() => setDifficulty(opt.value)}>
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border rounded-xl border-dashed">
            <Dumbbell className="h-10 w-10 mb-3 opacity-30" />
            <p className="font-medium">No drills found</p>
            <p className="text-sm mt-1">
              {drills.length === 0
                ? 'No drills in the library yet — run npm run seed:drills to populate.'
                : 'Try adjusting the filters.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((drill) => (
              <Card key={drill.id}>
                <CardContent className="py-4 px-5 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm">{drill.name}</h3>
                      <Badge variant="outline" className="text-xs">{CATEGORY_LABELS[drill.category]}</Badge>
                      <Badge variant="secondary" className="text-xs capitalize">{DIFFICULTY_LABELS[drill.difficulty]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{drill.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {drill.techniques.map((t) => (
                        <span key={t} className="text-xs text-muted-foreground border rounded px-1.5 py-0.5">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold tabular-nums text-primary">{drill.defaultTempo}</p>
                    <p className="text-xs text-muted-foreground">BPM</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            {filtered.length} of {drills.length} drill{drills.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </PageShell>
  )
}
