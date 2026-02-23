import { useState, useEffect, useCallback } from 'react'
import { Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { startMetronome, stopMetronome, setBpm, isRunning } from '@/lib/metronome'
import { cn } from '@/lib/utils'

interface MetronomeProps {
  initialBpm?: number
  minBpm?: number
  maxBpm?: number
}

export function Metronome({ initialBpm = 80, minBpm = 40, maxBpm = 200 }: MetronomeProps) {
  const [bpm, setBpmState] = useState(initialBpm)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(false)

  // Flash the beat indicator
  const onBeat = useCallback(() => {
    setBeat(true)
    setTimeout(() => setBeat(false), 80)
  }, [])

  function toggleMetronome() {
    if (isRunning()) {
      stopMetronome()
      setRunning(false)
    } else {
      startMetronome(bpm, onBeat)
      setRunning(true)
    }
  }

  function handleBpmChange(val: number[]) {
    const newBpm = val[0]
    setBpmState(newBpm)
    setBpm(newBpm)
    // Restart with new BPM if already running
    if (isRunning()) {
      stopMetronome()
      startMetronome(newBpm, onBeat)
    }
  }

  // Stop on unmount
  useEffect(() => () => stopMetronome(), [])

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-card border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Metronome</span>
        {/* Beat flash indicator */}
        <div
          className={cn(
            'h-3 w-3 rounded-full transition-all duration-75',
            running ? (beat ? 'bg-primary scale-125' : 'bg-primary/30') : 'bg-muted',
          )}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant={running ? 'default' : 'outline'}
          size="sm"
          onClick={toggleMetronome}
          className="shrink-0 w-20"
        >
          {running ? (
            <><Square className="h-3 w-3 mr-1.5 fill-current" /> Stop</>
          ) : (
            <><Play className="h-3 w-3 mr-1.5 fill-current" /> Start</>
          )}
        </Button>

        <div className="flex-1 flex items-center gap-3">
          <Slider
            value={[bpm]}
            onValueChange={handleBpmChange}
            min={minBpm}
            max={maxBpm}
            step={1}
            className="flex-1"
          />
          <div className="text-right min-w-[4rem]">
            <span className="text-lg font-bold tabular-nums">{bpm}</span>
            <span className="text-xs text-muted-foreground ml-1">BPM</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minBpm}</span>
        <span className="text-center">
          {bpm < 66 ? 'Largo' : bpm < 76 ? 'Adagio' : bpm < 108 ? 'Andante' : bpm < 120 ? 'Moderato' : bpm < 156 ? 'Allegro' : 'Presto'}
        </span>
        <span>{maxBpm}</span>
      </div>
    </div>
  )
}
