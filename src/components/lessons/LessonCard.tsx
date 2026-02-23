import { Link } from 'react-router-dom'
import { Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { LevelBadge } from './LevelBadge'
import type { Lesson } from '@/types'

interface LessonCardProps {
  lesson: Lesson
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="py-4 px-5">
        <Link to={`/lessons/${lesson.id}`} className="flex items-start justify-between gap-3 group">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-muted-foreground tabular-nums font-medium">
                {String(lesson.order).padStart(2, '0')}
              </span>
              <LevelBadge level={lesson.level} />
            </div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {lesson.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{lesson.description}</p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3" />
              {lesson.estimatedMinutes} min read
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
        </Link>
      </CardContent>
    </Card>
  )
}
