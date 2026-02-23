import { updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AppUser } from '@/types'

interface UserTableProps {
  users: AppUser[]
  currentUid: string
}

export function UserTable({ users, currentUid }: UserTableProps) {
  async function toggleRole(user: AppUser) {
    const newRole = user.role === 'admin' ? 'student' : 'admin'
    await updateDoc(doc(db, 'users', user.uid), { role: newRole })
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">User</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Role</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Sessions</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Level</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-sm">{user.displayName ?? '—'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </td>
              <td className="px-4 py-3 tabular-nums text-sm">
                {user.stats?.totalSessions ?? 0}
              </td>
              <td className="px-4 py-3 text-sm capitalize">
                {user.preferences?.difficulty ?? '—'}
              </td>
              <td className="px-4 py-3 text-right">
                {user.uid !== currentUid && (
                  <Button variant="ghost" size="sm" onClick={() => toggleRole(user)}
                    className="text-xs h-7">
                    {user.role === 'admin' ? 'Demote' : 'Make admin'}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
