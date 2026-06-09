import { Link, useLocation, useNavigate } from 'react-router'
import { LayoutDashboard, Calendar, List, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useMe, useLogout } from '../../hooks/useAuth'
import { useToast } from '../ui/Toast'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Сегодня' },
  { to: '/tasks', icon: List, label: 'Все задачи' },
  { to: '/calendar', icon: Calendar, label: 'Календарь' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useMe()
  const logout = useLogout()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = async () => {
    await logout.mutateAsync()
    toast.success('Вы вышли из аккаунта')
    navigate('/login')
  }

  return (
    <div className="min-h-dvh flex bg-[#f6f5f2]">
      {/* ── Sidebar (desktop) ── */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col bg-white border-r border-[#e2e0db] px-5">
        <div className="p-5 border-b border-[#e2e0db]">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 28 28" className="w-7 h-7 shrink-0" fill="none" aria-label="Planner logo">
              <rect width="28" height="28" rx="7" fill="#01696f"/>
              <rect x="7" y="8" width="14" height="2" rx="1" fill="white"/>
              <rect x="7" y="13" width="10" height="2" rx="1" fill="white"/>
              <rect x="7" y="18" width="12" height="2" rx="1" fill="white"/>
            </svg>
            <span className="font-semibold text-[#28251d] text-base">Planner</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname.startsWith(to)
                  ? 'bg-[#cedcd8] text-[#0c4e54]'
                  : 'text-[#7a7974] hover:bg-[#f3f0ec] hover:text-[#28251d]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[#e2e0db]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#cedcd8] flex items-center justify-center shrink-0 text-[13px] font-semibold text-[#01696f]">
              {user?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#28251d] truncate">{user?.username}</p>
              <p className="text-xs text-[#7a7974] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-[#f3f0ec] transition-colors"
              aria-label="Выйти"
            >
              <LogOut className="w-4 h-4 text-[#7a7974]" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Liquid Glass Bottom Nav (mobile) ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Outer blur shell */}
        <div
          className="mx-[10px] mb-[10px] rounded-[28px] overflow-hidden"
          style={{
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            background: 'rgba(246, 245, 242, 0.72)',
            boxShadow:
              '0 8px 32px rgba(46,43,39,0.10), 0 1.5px 0 rgba(255,255,255,0.55) inset, 0 -1px 0 rgba(46,43,39,0.06) inset',
            border: '1px solid rgba(255,255,255,0.45)',
          }}
        >
          <div className="flex items-center">
            {nav.map(({ to, icon: Icon, label }) => {
              const active = pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex-1 flex flex-col items-center gap-1 py-3 transition-all active:scale-95"
                >
                  <div
                    className={clsx(
                      'flex items-center justify-center w-10 h-8 rounded-[14px] transition-all duration-200',
                      active
                        ? 'bg-[rgba(1,105,111,0.12)] shadow-[0_1px_4px_rgba(1,105,111,0.15)]'
                        : 'bg-transparent'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'w-5 h-5 transition-colors',
                        active ? 'text-[#01696f]' : 'text-[#8e8a85]'
                      )}
                    />
                  </div>
                  <span
                    className={clsx(
                      'text-[11px] font-medium tracking-[-0.01em] transition-colors',
                      active ? 'text-[#01696f]' : 'text-[#8e8a85]'
                    )}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex-1 flex flex-col items-center gap-1 py-3 active:scale-95 transition-all"
              aria-label="Выйти"
            >
              <div className="flex items-center justify-center w-10 h-8 rounded-[14px]">
                <LogOut className="w-5 h-5 text-[#8e8a85]" />
              </div>
              <span className="text-[11px] font-medium tracking-[-0.01em] text-[#8e8a85]">Выйти</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main
        className="flex-1 min-w-0 md:pb-0 py-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }}
      >
        {children}
      </main>
    </div>
  )
}