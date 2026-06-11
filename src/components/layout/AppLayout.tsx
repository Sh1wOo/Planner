import { Link, useLocation, useNavigate } from "react-router"
import { LayoutDashboard, List, LogOut, User, ChevronRight } from "lucide-react"
import { clsx } from "clsx"
import { useMe, useLogout } from "../../hooks/useAuth"
import { useToast } from "../ui/Toast"
import dashboardBg from "../../assets/dashboard.jpeg"
import logo from "../../assets/logo.png"

const AUTH_ACCENT = "#9a8689"
const AUTH_ACCENT_HOVER = "#8b777a"
const AUTH_ACCENT_SOFT = "rgba(154,134,137,0.14)"
const AUTH_ACCENT_SOFT_STRONG = "rgba(154,134,137,0.18)"
const AUTH_ACCENT_TEXT = "#7e696d"

const nav = [
	{ to: "/dashboard", icon: LayoutDashboard, label: "Сегодня" },
	{ to: "/tasks", icon: List, label: "Все задачи" },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
	const { data: user } = useMe()
	const logout = useLogout()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const toast = useToast()

	const handleLogout = async () => {
		await logout.mutateAsync()
		toast.success("Вы вышли из аккаунта")
		navigate("/login")
	}

	const initial = user?.username?.[0]?.toUpperCase() ?? "?"

	return (
		<div className='relative min-h-dvh overflow-hidden text-text'>
			<div className='absolute inset-0 -z-20'>
				<img
					src={dashboardBg}
					alt=''
					className='h-full w-full object-cover'
				/>
			</div>

			<div className='absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(247,246,242,0.72)_0%,rgba(247,246,242,0.82)_32%,rgba(247,246,242,0.92)_100%)]' />

			<div className='relative z-10 min-h-dvh'>
				<div className='mx-auto flex min-h-dvh max-w-400 gap-3 p-3 md:gap-4 md:p-4'>
					<aside className='hidden md:flex md:w-68 md:shrink-0'>
						<div
							className='
                flex min-h-full w-full flex-col
                rounded-[28px]
                border border-[rgba(40,37,29,0.08)]
                bg-[rgba(252,251,248,0.78)]
                shadow-[0_10px_30px_rgba(24,22,19,0.06)]
                backdrop-blur-xl
              '
						>
							<div className='px-5 pt-5 pb-4'>
								<div className='flex items-center gap-3 rounded-2xl'>
									<div
										className='flex h-15 w-15 items-center justify-center rounded-2xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
										style={{ background: AUTH_ACCENT }}
									>
										<img
											src={logo}
											alt='logo'
											className='h-15 w-15 rounded-2xl'
										/>
									</div>

									<div className='min-w-0'>
										<p className='text-[15px] font-semibold tracking-[-0.03em] text-text'>
											Planner
										</p>
										<p className='text-xs text-muted'>
											Focus on what matters
										</p>
									</div>
								</div>
							</div>

							<div className='px-3'>
								<div className='h-px bg-[rgba(40,37,29,0.08)]' />
							</div>

							<nav className='flex-1 px-3 py-4'>
								<div className='mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a968f]'>
									Навигация
								</div>

								<div className='space-y-1'>
									{nav.map(({ to, icon: Icon, label }) => {
										const active = pathname.startsWith(to)

										return (
											<Link
												key={to}
												to={to}
												className={clsx(
													"group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
													active
														? "shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
														: "text-[#6f6c66] hover:bg-[#f1eee8] hover:text-text",
												)}
												style={
													active
														? {
																background:
																	AUTH_ACCENT_SOFT,
																color: AUTH_ACCENT_TEXT,
															}
														: undefined
												}
											>
												<div
													className={clsx(
														"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
														active
															? "bg-white/70 shadow-[0_1px_2px_rgba(24,22,19,0.04)]"
															: "bg-transparent text-[#8b8781] group-hover:bg-white/70 group-hover:text-text",
													)}
													style={
														active
															? {
																	color: AUTH_ACCENT,
																}
															: undefined
													}
												>
													<Icon className='h-4.5 w-4.5' />
												</div>

												<span className='flex-1 truncate'>
													{label}
												</span>

												<ChevronRight
													className={clsx(
														"h-4 w-4 transition-all duration-200",
														active
															? "translate-x-0 opacity-100"
															: "-translate-x-1 opacity-0 text-[#9a968f] group-hover:translate-x-0 group-hover:opacity-100",
													)}
													style={
														active
															? {
																	color: AUTH_ACCENT,
																}
															: undefined
													}
												/>
											</Link>
										)
									})}
								</div>
							</nav>

							<div className='px-3 pb-3'>
								<div className='h-px bg-[rgba(40,37,29,0.08)]' />
							</div>

							<div className='p-3 pt-0'>
								<div className='rounded-[22px] bg-[#f3f0ec] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'>
									<div className='flex items-center gap-3'>
										<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2f2b28] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'>
											<span className='text-sm font-semibold'>
												{initial}
											</span>
										</div>

										<div className='min-w-0 flex-1'>
											<p className='truncate text-sm font-semibold text-text'>
												{user?.username ||
													"Пользователь"}
											</p>
											<p className='truncate text-xs text-muted'>
												{user?.email || "Нет почты"}
											</p>
										</div>

										<button
											onClick={handleLogout}
											className='
                        flex h-10 w-10 items-center justify-center rounded-xl
                        text-muted transition-all duration-200
                        hover:bg-white hover:text-text
                        active:scale-[0.98]
                      '
											aria-label='Выйти'
										>
											<LogOut className='h-4 w-4' />
										</button>
									</div>
								</div>
							</div>
						</div>
					</aside>

					<main className='min-w-0 flex-1'>
						<div
							className='
                min-h-[calc(100dvh-24px)]
                rounded-[28px]
                border border-[rgba(40,37,29,0.06)]
                bg-[rgba(251,250,247,0.68)]
                shadow-[0_12px_40px_rgba(24,22,19,0.05)]
                backdrop-blur-md
                p-3 pb-28 md:min-h-[calc(100dvh-32px)] md:p-4 md:pb-4
              '
						>
							{children}
						</div>
					</main>
				</div>

				<nav
					className='fixed inset-x-0 bottom-0 z-50 md:hidden'
					style={{
						paddingBottom: "env(safe-area-inset-bottom, 0px)",
					}}
				>
					<div className='mx-3 mb-3'>
						<div
							className='
                overflow-hidden rounded-[28px]
                border border-[rgba(255,255,255,0.65)]
                bg-[rgba(247,246,242,0.76)]
                shadow-[0_10px_40px_rgba(24,22,19,0.12),inset_0_1px_0_rgba(255,255,255,0.82)]
                backdrop-blur-2xl
              '
						>
							<div className='grid grid-cols-3'>
								{nav.map(({ to, icon: Icon, label }) => {
									const active = pathname.startsWith(to)

									return (
										<Link
											key={to}
											to={to}
											className='flex flex-col items-center justify-center gap-1 px-2 py-3.5 active:scale-[0.98]'
										>
											<div
												className={clsx(
													"flex h-9 w-9 items-center justify-center rounded-[14px] transition-all duration-200",
													active
														? "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
														: "text-[#8e8a85]",
												)}
												style={
													active
														? {
																background:
																	AUTH_ACCENT_SOFT_STRONG,
																color: AUTH_ACCENT,
															}
														: undefined
												}
											>
												<Icon className='h-4.5 w-4.5' />
											</div>

											<span
												className={clsx(
													"text-[11px] font-semibold tracking-[-0.01em] transition-colors",
													active
														? ""
														: "text-[#8e8a85]",
												)}
												style={
													active
														? { color: AUTH_ACCENT }
														: undefined
												}
											>
												{label}
											</span>
										</Link>
									)
								})}

								<button
									onClick={handleLogout}
									className='flex flex-col items-center justify-center gap-1 px-2 py-3.5 active:scale-[0.98]'
									aria-label='Выйти'
								>
									<div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#2f2b28] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'>
										{user?.username ? (
											<span className='text-[13px] font-bold leading-none'>
												{initial}
											</span>
										) : (
											<User className='h-4 w-4' />
										)}
									</div>

									<span className='text-[11px] font-semibold tracking-[-0.01em] text-[#8e8a85]'>
										Выйти
									</span>
								</button>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</div>
	)
}
