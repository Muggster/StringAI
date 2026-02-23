import { MOOD_OPTIONS } from '@/lib/constants'
import type { SessionMood } from '@/types'
import { cn } from '@/lib/utils'

interface SessionMoodPickerProps {
  value: SessionMood | null
  onChange: (mood: SessionMood) => void
}

export function SessionMoodPicker({ value, onChange }: SessionMoodPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">How did that feel?</p>
      <div className="grid grid-cols-4 gap-2">
        {MOOD_OPTIONS.map(({ value: mood, label }) => (
          <button
            key={mood}
            onClick={() => onChange(mood)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-sm transition-colors',
              value === mood
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/40',
            )}
          >
            <span className="text-xl">{label.split(' ')[0]}</span>
            <span className="text-xs text-muted-foreground">{label.split(' ')[1]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
