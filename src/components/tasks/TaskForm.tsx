import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import {
	CalendarDays,
	ChevronDown,
	Check,
	Sparkles,
	FileText,
	Type,
} from "lucide-react"
import clsx from "clsx"
import type { Task, TaskCreate, TaskUpdate, Priority } from "../../types"

interface Props {
	initialValues?: Partial<Task>
	onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>
	onCancel: () => void
	submitLabel?: string
}

const AUTH_ACCENT = "#9a8689"
const AUTH_ACCENT_HOVER = "#8b777a"
const AUTH_ACCENT_ACTIVE = "#7c696d"
const AUTH_ACCENT_RING = "rgba(154,134,137,0.18)"

const PRIORITIES: Array<{
	value: Priority
	label: string
	hint: string
	dot: string
	bg: string
	text: string
	ring: string
}> = [
	{
		value: "low",
		label: "Низкий",
		hint: "Мягкий темп, можно без спешки",
		dot: "#6b9a3c",
		bg: "#e7f1dc",
		text: "#426c21",
		ring: "rgba(107,154,60,0.12)",
	},
	{
		value: "medium",
		label: "Средний",
		hint: "Стандартный рабочий приоритет",
		dot: "#c28a09",
		bg: "#f6ead0",
		text: "#8a5b00",
		ring: "rgba(194,138,9,0.12)",
	},
	{
		value: "high",
		label: "Высокий",
		hint: "Критично, лучше сделать сегодня",
		dot: "#c14b5d",
		bg: "#f7dde2",
		text: "#9b2f45",
		ring: "rgba(193,75,93,0.12)",
	},
]

export function TaskForm({
	initialValues,
	onSubmit,
	onCancel,
	submitLabel = "Создать задачу",
}: Props) {
	const today = new Date().toISOString().split("T")[0]

	const [title, setTitle] = useState(initialValues?.title ?? "")
	const [description, setDescription] = useState(
		initialValues?.description ?? "",
	)
	const [dueDate, setDueDate] = useState(initialValues?.due_date ?? today)
	const [priority, setPriority] = useState<Priority>(
		initialValues?.priority ?? "medium",
	)
	const [priorityOpen, setPriorityOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!priorityOpen) return

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setPriorityOpen(false)
		}

		document.addEventListener("keydown", onKeyDown)
		document.body.style.overflow = "hidden"

		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = ""
		}
	}, [priorityOpen])

	const currentPriority = useMemo(
		() =>
			PRIORITIES.find((item) => item.value === priority) ?? PRIORITIES[1],
		[priority],
	)

	const validate = () => {
		const next: Record<string, string> = {}
		if (!title.trim()) next.title = "Введите название задачи"
		if (!dueDate) next.dueDate = "Выберите дату"
		setErrors(next)
		return Object.keys(next).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		setLoading(true)
		try {
			await onSubmit({
				title: title.trim(),
				description: description.trim() || undefined,
				due_date: dueDate,
				priority,
			})
		} finally {
			setLoading(false)
		}
	}

	const fieldBase =
		"w-full rounded-[18px] border bg-white text-[#2f2b28] outline-none transition-all placeholder:text-[#b8b1a9] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-ring)]"

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className='space-y-4 px-0.5 sm:px-1'
			>
				<section className='rounded-[24px] border border-[rgba(40,37,29,0.08)] bg-[rgba(252,251,248,0.96)] p-4 shadow-[0_10px_28px_rgba(24,22,19,0.05)] sm:rounded-[28px] sm:p-5'>
					<div className='mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a29b92]'>
						<Sparkles className='h-3.5 w-3.5' />
						Task details
					</div>

					<div className='space-y-4'>
						<div>
							<label className='mb-2 flex items-center gap-2 text-[13px] font-medium text-[#5a5550]'>
								<Type className='h-3.5 w-3.5 text-[#9c958e]' />
								Название
							</label>

							<input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder='Например: подготовить презентацию'
								autoFocus
								className={clsx(
									fieldBase,
									"h-12 px-4 text-[15px]",
									errors.title
										? "border-[#d96b6b] focus:border-[#c14b5d] focus:ring-[rgba(193,75,93,0.12)]"
										: "border-[#ddd6ce]",
								)}
								style={
									{
										["--accent" as string]: AUTH_ACCENT,
										["--accent-ring" as string]:
											AUTH_ACCENT_RING,
									} as React.CSSProperties
								}
							/>

							{errors.title && (
								<p className='mt-1.5 px-1 text-[12px] text-[#b42318]'>
									{errors.title}
								</p>
							)}
						</div>

						<div>
							<label className='mb-2 flex items-center gap-2 text-[13px] font-medium text-[#5a5550]'>
								<FileText className='h-3.5 w-3.5 text-[#9c958e]' />
								Описание
							</label>

							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder='Добавь контекст, детали или небольшое примечание'
								rows={4}
								className={clsx(
									fieldBase,
									"min-h-[112px] resize-none px-4 py-3 text-[14px] leading-normal border-[#ddd6ce]",
								)}
								style={
									{
										["--accent" as string]: AUTH_ACCENT,
										["--accent-ring" as string]:
											AUTH_ACCENT_RING,
									} as React.CSSProperties
								}
							/>
						</div>
					</div>
				</section>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<section className='rounded-[24px] border border-[rgba(40,37,29,0.08)] bg-[rgba(252,251,248,0.96)] p-4 shadow-[0_10px_28px_rgba(24,22,19,0.05)] sm:rounded-[28px]'>
						<label className='mb-2 flex items-center gap-2 text-[13px] font-medium text-[#5a5550]'>
							<CalendarDays className='h-3.5 w-3.5 text-[#9c958e]' />
							Срок
						</label>

						<input
							type='date'
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className={clsx(
								fieldBase,
								"h-12 px-4 text-[14px]",
								errors.dueDate
									? "border-[#d96b6b] focus:border-[#c14b5d] focus:ring-[rgba(193,75,93,0.12)]"
									: "border-[#ddd6ce]",
							)}
							style={
								{
									["--accent" as string]: AUTH_ACCENT,
									["--accent-ring" as string]:
										AUTH_ACCENT_RING,
								} as React.CSSProperties
							}
						/>

						{errors.dueDate && (
							<p className='mt-1.5 px-1 text-[12px] text-[#b42318]'>
								{errors.dueDate}
							</p>
						)}
					</section>

					<section className='rounded-[24px] border border-[rgba(40,37,29,0.08)] bg-[rgba(252,251,248,0.96)] p-4 shadow-[0_10px_28px_rgba(24,22,19,0.05)] sm:rounded-[28px]'>
						<label className='mb-2 block text-[13px] font-medium text-[#5a5550]'>
							Приоритет
						</label>

						<button
							type='button'
							onClick={() => setPriorityOpen(true)}
							className='flex h-12 w-full items-center gap-3 rounded-[18px] border border-[#ddd6ce] bg-white px-4 text-left transition-all hover:border-[#cfc7bf] active:scale-[0.99] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-ring)]'
							style={
								{
									["--accent" as string]: AUTH_ACCENT,
									["--accent-ring" as string]:
										AUTH_ACCENT_RING,
								} as React.CSSProperties
							}
						>
							<span
								className='h-2.5 w-2.5 shrink-0 rounded-full'
								style={{ background: currentPriority.dot }}
							/>
							<div className='min-w-0 flex-1'>
								<div className='text-[14px] font-semibold text-[#2f2b28]'>
									{currentPriority.label}
								</div>
								<div
									className='truncate text-[12px]'
									style={{ color: currentPriority.text }}
								>
									{currentPriority.hint}
								</div>
							</div>
							<ChevronDown className='h-4 w-4 shrink-0 text-[#8d8781]' />
						</button>
					</section>
				</div>

				<div className='sticky bottom-0 z-10 -mx-1 mt-2 border-t border-[rgba(40,37,29,0.08)] bg-[rgba(246,244,240,0.92)] px-1 pb-[calc(env(safe-area-inset-bottom)+4px)] pt-3 backdrop-blur xl:static xl:mx-0 xl:border-0 xl:bg-transparent xl:px-1 xl:pb-0 xl:pt-1'>
					<div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
						<button
							type='button'
							onClick={onCancel}
							className='h-12 w-full rounded-full px-5 text-[14px] font-medium text-[#5a5550] transition-all hover:bg-[#efebe6] active:scale-[0.98] sm:h-11 sm:w-auto'
						>
							Отмена
						</button>

						<button
							type='submit'
							disabled={loading}
							className='h-12 w-full rounded-full px-5 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(154,134,137,0.20)] transition-all active:scale-[0.98] disabled:opacity-60 sm:h-11 sm:w-auto'
							style={{ background: AUTH_ACCENT }}
							onMouseEnter={(e) => {
								e.currentTarget.style.background =
									AUTH_ACCENT_HOVER
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = AUTH_ACCENT
							}}
							onMouseDown={(e) => {
								e.currentTarget.style.background =
									AUTH_ACCENT_ACTIVE
							}}
							onMouseUp={(e) => {
								e.currentTarget.style.background =
									AUTH_ACCENT_HOVER
							}}
						>
							{loading ? "Сохранение..." : submitLabel}
						</button>
					</div>
				</div>
			</form>

			{mounted &&
				priorityOpen &&
				createPortal(
					<>
						<div className='fixed inset-0 z-[80] bg-[rgba(30,27,24,0.28)] backdrop-blur-[2px]' />
						<div className='fixed inset-0 z-[81] flex items-end justify-center sm:items-center sm:p-4'>
							<button
								type='button'
								onClick={() => setPriorityOpen(false)}
								className='absolute inset-0'
								aria-label='Закрыть выбор приоритета'
							/>

							<div
								className='
								relative z-[82] w-full overflow-hidden
								rounded-t-[32px] border border-[rgba(40,37,29,0.08)]
								bg-[#f6f4f0]
								shadow-[0_-10px_40px_rgba(24,22,19,0.18)]
								sm:max-w-md sm:rounded-[32px]
								max-h-[85dvh]
								'
							>
								<div className='mx-auto mb-4 mt-3 h-1.5 w-10 rounded-full bg-[#d2cdc6] sm:hidden' />

								<div className='flex max-h-[85dvh] flex-col'>
									<div className='shrink-0 px-4 pb-3 sm:px-5'>
										<div className='flex items-center justify-between gap-3 px-1'>
											<div>
												<p className='text-[11px] uppercase tracking-[0.12em] text-[#aaa39b]'>
													Task setup
												</p>
												<h3 className='text-[18px] font-semibold tracking-[-0.03em] text-[#2f2b28]'>
													Выбор приоритета
												</h3>
											</div>

											<button
												type='button'
												onClick={() =>
													setPriorityOpen(false)
												}
												className='rounded-full px-3 py-1.5 text-[13px] font-medium text-[#7b746d] transition-colors hover:bg-white hover:text-[#2f2b28]'
											>
												Закрыть
											</button>
										</div>
									</div>

									<div className='min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] sm:px-5 sm:pb-5'>
										<div className='space-y-2'>
											{PRIORITIES.map((item) => {
												const active =
													item.value === priority

												return (
													<button
														key={item.value}
														type='button'
														onClick={() => {
															setPriority(
																item.value,
															)
															setPriorityOpen(
																false,
															)
														}}
														className={clsx(
															"flex w-full items-center justify-between gap-3 rounded-[22px] border bg-white px-4 py-4 text-left shadow-[0_8px_18px_rgba(24,22,19,0.04)] transition-all active:scale-[0.99]",
															active
																? "border-[#d7c9cb]"
																: "border-[#e7e1da] hover:border-[#d8d1c9]",
														)}
													>
														<span className='flex min-w-0 items-center gap-3'>
															<span
																className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full'
																style={{
																	background:
																		item.bg,
																	boxShadow: `0 0 0 1px ${item.ring}`,
																}}
															>
																<span
																	className='h-3 w-3 rounded-full'
																	style={{
																		background:
																			item.dot,
																	}}
																/>
															</span>

															<span className='min-w-0'>
																<span className='block text-[15px] font-semibold text-[#2f2b28]'>
																	{item.label}
																</span>
																<span
																	className='block text-[12px] leading-[1.4]'
																	style={{
																		color: item.text,
																	}}
																>
																	{item.hint}
																</span>
															</span>
														</span>

														<span
															className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all'
															style={{
																borderColor:
																	active
																		? AUTH_ACCENT
																		: "#d8d3cc",
																background:
																	active
																		? AUTH_ACCENT
																		: "#fff",
																boxShadow:
																	active
																		? `0 0 0 6px ${AUTH_ACCENT_RING}`
																		: "none",
															}}
														>
															{active && (
																<Check
																	className='h-4 w-4 text-white'
																	strokeWidth={
																		3
																	}
																/>
															)}
														</span>
													</button>
												)
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
						<style>{`
              @keyframes priorityDrawer {
                from {
                  transform: translateY(28px) scale(0.985);
                  opacity: 0;
                }
                to {
                  transform: translateY(0) scale(1);
                  opacity: 1;
                }
              }
            `}</style>
					</>,
					document.body,
				)}
		</>
	)
}
