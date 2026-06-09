import { Navigate } from 'react-router'
import { useMe } from '../../hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useMe()

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#f7f6f2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#01696f]/30 border-t-[#01696f] animate-spin" />
          <p className="text-sm text-[#7a7974]">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (isError || !user) return <Navigate to="/login" replace />

  return <>{children}</>
}
