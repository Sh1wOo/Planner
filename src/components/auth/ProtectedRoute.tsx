import { Navigate } from 'react-router'
import { useMe } from '../../hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useMe()

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (isError || !user) return <Navigate to="/login" replace />

  return <>{children}</>
}
