import { Navigate } from 'react-router'
import { useMe } from '../../hooks/useAuth'

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe()
  if (isLoading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
