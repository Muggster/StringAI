import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

interface SessionTimerProps {
  running: boolean
  onElapsed?: (seconds: number) => void
}

export function SessionTimer({ running, onElapsed }: SessionTimerProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    onElapsed?.(seconds)
  }, [seconds, onElapsed])

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const display = h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Timer className="h-4 w-4" />
      <span className="font-mono text-sm tabular-nums">{display}</span>
    </div>
  )
}
