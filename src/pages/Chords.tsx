import { useState, useMemo } from 'react'
import { Music } from 'lucide-react'
import { useChords } from '@/hooks/useChords'
import { PageShell } from '@/components/layout/PageShell'
import { ChordCard } from '@/components/chords/ChordCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChordCategory, DifficultyLevel } from '@/types'

const CATEGORY_OPTIONS: { value: ChordCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'power', label: 'Power' },
  { value: 'seventh', label: '7th' },
]

const DIFFICULTY_OPTIONS: { value: DifficultyLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export default function Chords() {
  const { chords, loading } = useChords()
  const [category, setCategory] = useState<ChordCategory | 'all'>('all')
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all')

  const filtered = useMemo(() => {
    return chords.filter((c) => {
      if (category !== 'all' && c.category !== category) return false
      if (difficulty !== 'all' && c.difficulty !== difficulty) return false
      return true
    })
  }, [chords, category, difficulty])

  return (
    <PageShell>
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Chord Library</h1>
          <p className="text-muted-foreground mt-1">Reference diagrams for common guitar chords</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant={category === opt.value ? 'default' : 'outline'}
                onClick={() => setCategory(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant={difficulty === opt.value ? 'default' : 'outline'}
                onClick={() => setDifficulty(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border rounded-xl border-dashed">
            <Music className="h-10 w-10 mb-3 opacity-30" />
            <p className="font-medium">No chords found</p>
            <p className="text-sm mt-1">
              {chords.length === 0
                ? 'Chord library is empty — run the seed script to populate it.'
                : 'Try adjusting the filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filtered.map((c) => (
              <ChordCard key={c.id} chord={c} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {filtered.length} of {chords.length} chord{chords.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </PageShell>
  )
}
