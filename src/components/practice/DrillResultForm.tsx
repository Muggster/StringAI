import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { DrillResult, PlanSection } from '@/types'
import { cn } from '@/lib/utils'

interface DrillResultFormProps {
  section: PlanSection
  onSubmit: (result: Omit<DrillResult, 'drillId' | 'drillName'>) => void
}

export function DrillResultForm({ section, onSubmit }: DrillResultFormProps) {
  const defaultBpm = section.targetTempo?.min ?? 80
  const [bpm, setBpm] = useState(defaultBpm)
  const [accuracy, setAccuracy] = useState(75)
  const [difficulty, setDifficulty] = useState(3)
  const [notes, setNotes] = useState('')

  const DIFFICULTY_LABELS = ['', 'Very easy', 'Easy', 'Just right', 'Hard', 'Very hard']

  function handleSubmit() {
    const trimmed = notes.trim()
    onSubmit({ bpm, accuracy, difficulty, ...(trimmed ? { notes: trimmed } : {}) })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* BPM achieved */}
      <div className="flex flex-col gap-2">
        <Label className="flex items-center justify-between">
          <span>BPM achieved</span>
          <span className="font-bold tabular-nums text-primary">{bpm} BPM</span>
        </Label>
        <Slider
          value={[bpm]}
          onValueChange={([v]) => setBpm(v)}
          min={20}
          max={240}
          step={1}
        />
        {section.targetTempo && (
          <p className="text-xs text-muted-foreground">
            Target: {section.targetTempo.min}–{section.targetTempo.max} BPM
          </p>
        )}
      </div>

      {/* Accuracy */}
      <div className="flex flex-col gap-2">
        <Label className="flex items-center justify-between">
          <span>Accuracy</span>
          <span className="font-bold tabular-nums text-primary">{accuracy}%</span>
        </Label>
        <Slider
          value={[accuracy]}
          onValueChange={([v]) => setAccuracy(v)}
          min={0}
          max={100}
          step={5}
        />
        <p className="text-xs text-muted-foreground">
          How cleanly did you hit the notes?
        </p>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-2">
        <Label>Felt difficulty</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                'py-2 rounded-md text-xs font-medium border-2 transition-colors',
                difficulty === d
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40',
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{DIFFICULTY_LABELS[difficulty]}</p>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="drill-notes">Notes (optional)</Label>
        <Textarea
          id="drill-notes"
          placeholder="What clicked? What didn't? Any observations…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="resize-none text-sm"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Log drill & continue
      </Button>
    </div>
  )
}
