import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Calendar, List, LogOut, User } from "lucide-react";
import { clsx } from "clsx";
import { useMe, useLogout } from "../../hooks/useAuth";
import { useToast } from "../ui/Toast";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Сегодня" },
  { to: "/tasks", icon: List, label: "Все задачи" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useMe();
  const logout = useLogout();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    await logout.mutateAsync();
    toast.success("Вы вышли из аккаунта");
    navigate("/login");
  };

  const initial = user?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-dvh flex bg-[#f6f5f2]">
      {/* ── Desktop sidebar ── */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col bg-white/80 border-r border-[#e2e0db] backdrop-blur-xl px-5">
        <div className="py-5 border-b border-[#e2e0db]">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 28 28"
              className="w-7 h-7 shrink-0"
              fill="none"
              aria-label="Planner logo"
            >
              <rect width="28" height="28" rx="7" fill="#01696f" />
              <rect x="7" y="8" width="14" height="2" rx="1" fill="white" />
              <rect x="7" y="13" width="10" height="2" rx="1" fill="white" />
              <rect x="7" y="18" width="12" height="2" rx="1" fill="white" />
            </svg>
            <span className="font-semibold text-[#28251d] text-base tracking-[-0.02em]">
              Planner
            </span>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname.startsWith(to)
                  ? "bg-[#cedcd8] text-[#0c4e54]"
                  : "text-[#7a7974] hover:bg-[#f3f0ec] hover:text-[#28251d]",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="py-4 border-t border-[#e2e0db]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#2f2b28] flex items-center justify-center shrink-0">
              <span className="text-[13px] font-semibold text-white">
                {initial}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#28251d] truncate">
                {user?.username}
              </p>
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

      {/* ── Main content ── */}
      <main className="flex w-screen min-w-0 mb-48 md:pb-0 p-2 justify-center">{children}</main>

      {/* ── Mobile bottom nav — Liquid Glass ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div
          className="mx-[12px] mb-[12px] rounded-[26px] flex items-stretch overflow-hidden"
          style={{
            background: "rgba(246,245,242,0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow:
              "0 8px 32px rgba(46,43,39,0.14), 0 0 0 1px rgba(255,255,255,0.55) inset, 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          {nav.map(({ to, icon: Icon, label }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all active:scale-95"
              >
                <div
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-[12px] transition-all duration-200",
                    active
                      ? "bg-[rgba(1,105,111,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                      : "",
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-[18px] h-[18px] transition-colors",
                      active ? "text-[#01696f]" : "text-[#8e8a85]",
                    )}
                  />
                </div>
                <span
                  className={clsx(
                    "text-[10px] font-semibold tracking-[-0.01em] transition-colors",
                    active ? "text-[#01696f]" : "text-[#8e8a85]",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Avatar / logout */}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all active:scale-95"
            aria-label="Выйти"
          >
            <div className="h-8 w-8 rounded-full bg-[#2f2b28] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              {user?.username ? (
                <span className="text-[13px] font-bold text-white leading-none">
                  {initial}
                </span>
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-[-0.01em] text-[#8e8a85]">
              Выйти
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
