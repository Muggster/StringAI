import { useAuth } from '@/context/AuthContext'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { PageShell } from '@/components/layout/PageShell'
import { UserTable } from '@/components/admin/UserTable'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminUsers() {
  const { appUser } = useAuth()
  const { users, loading } = useAdminUsers()

  return (
    <PageShell>
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles and view activity — {users.length} total
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        ) : (
          <UserTable users={users} currentUid={appUser?.uid ?? ''} />
        )}
      </div>
    </PageShell>
  )
}
