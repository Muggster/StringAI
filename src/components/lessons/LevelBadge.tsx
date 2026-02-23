import { Badge } from '@/components/ui/badge'
import type { DifficultyLevel } from '@/types'

const LEVEL_STYLES: Record<DifficultyLevel, string> = {
  beginner: 'bg-green-500/15 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/15 text-red-400 border-red-500/20',
}

interface LevelBadgeProps {
  level: DifficultyLevel
}

export function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <Badge variant="outline" className={`text-xs capitalize ${LEVEL_STYLES[level]}`}>
      {level}
    </Badge>
  )
}
