import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useLessons } from '@/hooks/useLessons'
import { PageShell } from '@/components/layout/PageShell'
import { LessonEditor } from '@/components/admin/LessonEditor'
import { LevelBadge } from '@/components/lessons/LevelBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Lesson } from '@/types'

export default function AdminLessons() {
  const { lessons, loading } = useLessons()
  const [editing, setEditing] = useState<Lesson | null | 'new'>(null)

  async function handleDelete(lesson: Lesson) {
    if (!confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return
    await deleteDoc(doc(db, 'lessons', lesson.id))
  }

  if (editing) {
    return (
      <PageShell>
        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{editing === 'new' ? 'New Lesson' : `Edit: ${editing.title}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <LessonEditor
                lesson={editing === 'new' ? undefined : editing}
                onDone={() => setEditing(null)}
              />
            </CardContent>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lessons</h1>
            <p className="text-muted-foreground mt-1">Manage reference lessons for students</p>
          </div>
          <Button onClick={() => setEditing('new')} className="gap-2">
            <Plus className="h-4 w-4" /> New lesson
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums w-6 shrink-0">
                    {String(lesson.order).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <LevelBadge level={lesson.level} />
                      <Badge variant={lesson.published ? 'secondary' : 'outline'} className="text-xs">
                        {lesson.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{lesson.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(lesson)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(lesson)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
