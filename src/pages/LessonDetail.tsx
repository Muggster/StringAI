import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Clock } from 'lucide-react'
import { useLesson } from '@/hooks/useLesson'
import { PageShell } from '@/components/layout/PageShell'
import { LessonSection } from '@/components/lessons/LessonSection'
import { LevelBadge } from '@/components/lessons/LevelBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lesson, loading } = useLesson(id)

  if (loading) {
    return (
      <PageShell>
        <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </PageShell>
    )
  }

  if (!lesson) {
    return (
      <PageShell>
        <div className="p-8 text-center text-muted-foreground">
          <p>Lesson not found.</p>
          <Button variant="ghost" onClick={() => navigate('/lessons')} className="mt-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to lessons
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/lessons')} className="self-start -ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> All lessons
        </Button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs text-muted-foreground tabular-nums font-medium">
              Lesson {String(lesson.order).padStart(2, '0')}
            </span>
            <LevelBadge level={lesson.level} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {lesson.estimatedMinutes} min
            </span>
          </div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground mt-1">{lesson.description}</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5">
          {lesson.sections.map((section, i) => (
            <LessonSection key={i} section={section} />
          ))}
        </div>
      </div>
    </PageShell>
  )
}
