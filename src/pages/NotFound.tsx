import { useNavigate } from 'react-router-dom'
import { Guitar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 p-8">
      <Guitar className="h-16 w-16 text-primary opacity-40" />
      <div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground mt-2">This page doesn't exist — maybe it's still being written.</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    </div>
  )
}
