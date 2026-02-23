import { BookOpen } from 'lucide-react'
import { useLessons } from '@/hooks/useLessons'
import { PageShell } from '@/components/layout/PageShell'
import { LessonCard } from '@/components/lessons/LessonCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function Lessons() {
  const { lessons, loading } = useLessons()

  return (
    <PageShell>
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Reference Lessons</h1>
          <p className="text-muted-foreground mt-1">
            Beginner-friendly guides on chords, theory, and technique
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border rounded-xl border-dashed">
            <BookOpen className="h-10 w-10 mb-3 opacity-30" />
            <p className="font-medium">No lessons published yet</p>
            <p className="text-sm mt-1">An admin needs to publish lessons first.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lessons.map((l) => <LessonCard key={l.id} lesson={l} />)}
          </div>
        )}
      </div>
    </PageShell>
  )
}
