import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useDrills } from '@/hooks/useDrills'
import { PageShell } from '@/components/layout/PageShell'
import { DrillEditor } from '@/components/admin/DrillEditor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Drill } from '@/types'

export default function AdminDrills() {
  const { drills, loading } = useDrills()
  const [editing, setEditing] = useState<Drill | null | 'new'>(null)

  async function handleDelete(drill: Drill) {
    if (!confirm(`Delete "${drill.name}"? This cannot be undone.`)) return
    await deleteDoc(doc(db, 'drills', drill.id))
  }

  if (editing) {
    return (
      <PageShell>
        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{editing === 'new' ? 'New Drill' : `Edit: ${editing.name}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <DrillEditor
                drill={editing === 'new' ? undefined : editing}
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
            <h1 className="text-2xl font-bold">Drill Library</h1>
            <p className="text-muted-foreground mt-1">Manage practice drills available to students</p>
          </div>
          <Button onClick={() => setEditing('new')} className="gap-2">
            <Plus className="h-4 w-4" /> New drill
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {drills.map((drill) => (
              <Card key={drill.id}>
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{drill.name}</p>
                      <Badge variant="outline" className="text-xs">{drill.category}</Badge>
                      <Badge variant={drill.published ? 'secondary' : 'outline'}
                        className="text-xs">
                        {drill.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{drill.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(drill)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(drill)}>
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
