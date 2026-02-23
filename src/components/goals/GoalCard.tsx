import { CheckCircle2, Circle, Target, Music, Zap, Calendar } from 'lucide-react'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Goal } from '@/types'

const GOAL_TYPE_ICONS = {
  tempo: Zap,
  technique: Target,
  song: Music,
  consistency: Calendar,
}

const GOAL_TYPE_LABELS = {
  tempo: 'Tempo',
  technique: 'Technique',
  song: 'Song',
  consistency: 'Consistency',
}

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const Icon = GOAL_TYPE_ICONS[goal.type]

  async function toggleComplete() {
    const nowComplete = !goal.completed
    await updateDoc(doc(db, 'goals', goal.id), {
      completed: nowComplete,
      completedAt: nowComplete ? serverTimestamp() : null,
    })
  }

  return (
    <Card className={goal.completed ? 'opacity-60' : undefined}>
      <CardContent className="py-4 px-5 flex items-start gap-4">
        <button
          onClick={toggleComplete}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
          title={goal.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {goal.completed
            ? <CheckCircle2 className="h-5 w-5 text-primary" />
            : <Circle className="h-5 w-5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-xs gap-1">
              <Icon className="h-3 w-3" />
              {GOAL_TYPE_LABELS[goal.type]}
            </Badge>
            {goal.completed && (
              <Badge variant="secondary" className="text-xs">Done</Badge>
            )}
          </div>
          <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
            {goal.description}
          </p>
          {/* Target details */}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
            {goal.target.bpm && (
              <span className="text-xs text-muted-foreground">Target: {goal.target.bpm} BPM</span>
            )}
            {goal.target.technique && (
              <span className="text-xs text-muted-foreground">Focus: {goal.target.technique}</span>
            )}
            {goal.target.songTitle && (
              <span className="text-xs text-muted-foreground">Song: {goal.target.songTitle}</span>
            )}
            {goal.target.sessionsPerWeek && (
              <span className="text-xs text-muted-foreground">{goal.target.sessionsPerWeek}×/week</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
