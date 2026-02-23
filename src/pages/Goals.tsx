import { useState } from 'react'
import { Target, Plus, CheckCircle2 } from 'lucide-react'
import { useGoals } from '@/hooks/useGoals'
import { PageShell } from '@/components/layout/PageShell'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm } from '@/components/goals/GoalForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Goals() {
  const { goals, loading } = useGoals()
  const [showForm, setShowForm] = useState(false)

  const active = goals.filter((g) => !g.completed)
  const completed = goals.filter((g) => g.completed)

  return (
    <PageShell>
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Goals</h1>
            <p className="text-muted-foreground mt-1">
              Set targets and let your AI coach build toward them
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New goal
            </Button>
          )}
        </div>

        {/* New goal form */}
        {showForm && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Add a new goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GoalForm onDone={() => setShowForm(false)} />
            </CardContent>
          </Card>
        )}

        {/* Active goals */}
        <section>
          <h2 className="font-semibold text-base mb-3">
            Active goals <span className="text-muted-foreground font-normal">({active.length})</span>
          </h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-xl border-dashed">
              <Target className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No active goals</p>
              <p className="text-sm mt-1">Add a goal and your AI coach will practice toward it.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {active.map((g) => <GoalCard key={g.id} goal={g} />)}
            </div>
          )}
        </section>

        {/* Completed goals */}
        {completed.length > 0 && (
          <section>
            <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Completed <span className="text-muted-foreground font-normal">({completed.length})</span>
            </h2>
            <div className="flex flex-col gap-3">
              {completed.map((g) => <GoalCard key={g.id} goal={g} />)}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  )
}
