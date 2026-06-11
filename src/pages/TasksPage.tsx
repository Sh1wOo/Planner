import { useMemo, useState, type ReactNode } from "react"
import clsx from "clsx"
import {
	Plus,
	SlidersHorizontal,
	ClipboardList,
	Sparkles,
	X,
	CalendarDays,
} from "lucide-react"

import { useTasks, useCreateTask } from "../hooks/useTasks"
import { TaskCard } from "../components/tasks/TaskCard"
import { TaskSkeleton } from "../components/ui/Skeleton"
import { Modal } from "../components/ui/Modal"
import { TaskForm } from "../components/tasks/TaskForm"
import { useToast } from "../components/ui/Toast"
import type { TaskCreate, Priority } from "../types"

type PriorityFilter = Priority | "all"
type CompletedFilter = "all" | "active" | "done"

const AUTH_ACCENT = "#9a8689"
const AUTH_ACCENT_HOVER = "#8b777a"
const AUTH_ACCENT_SOFT = "rgba(154,134,137,0.14)"
const AUTH_ACCENT_RING = "rgba(154,134,137,0.18)"
const AUTH_ACCENT_TEXT = "#dbc8cb"

const PRIORITY_OPTIONS: Array<{
	value: PriorityFilter
	label: string
	activeColor: string
	dotColor: string
}> = [
	{ value: "all", label: "Все", activeColor: "#2c2825", dotColor: "" },
	{
		value: "high",
		label: "Высокий",
		activeColor: "#8d3654",
		dotColor: "#d163a7",
	},
	{
		value: "medium",
		label: "Средний",
		activeColor: "#7d6123",
		dotColor: "#e8af34",
	},
	{
		value: "low",
		label: "Низкий",
		activeColor: "#345128",
		dotColor: "#6daa45",
	},
]

const STATUS_OPTIONS = [
	{ value: "all", label: "Все", Icon: ClipboardList },
	{ value: "active", label: "Активные", Icon: Sparkles },
	{ value: "done", label: "Выполненные", Icon: CalendarDays },
] as const

function Stat({
	label,
	value,
	tone = "default",
}: {
	label: string
	value: number
	tone?: "default" | "accent" | "dark"
}) {
	return (
		<div
			className={clsx(
				"rounded-3xl border px-4 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl",
				tone === "dark" &&
					"border-white/10 bg-[rgba(255,255,255,0.04)] text-white",
				tone === "default" &&
					"border-white/10 bg-[rgba(255,255,255,0.04)]",
			)}
			style={
				tone === "accent"
					? {
							borderColor: "rgba(154,134,137,0.24)",
							background: AUTH_ACCENT_SOFT,
						}
					: undefined
			}
		>
			<p
				className='text-[10px] font-bold uppercase tracking-[0.16em]'
				style={{
					color:
						tone === "accent"
							? AUTH_ACCENT_TEXT
							: "rgba(255,255,255,0.38)",
				}}
			>
				{label}
			</p>
			<p className='mt-3 text-[32px] font-semibold leading-none tracking-tighter text-white'>
				{value}
			</p>
		</div>
	)
}

function FilterChip({
	active,
	onClick,
	children,
	activeColor = "#2c2825",
}: {
	active: boolean
	onClick: () => void
	children: ReactNode
	activeColor?: string
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			style={active ? { background: activeColor } : undefined}
			className={clsx(
				"inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-all",
				active
					? "border-transparent text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)]"
					: "border-white/10 bg-white/4 text-white/70 hover:bg-white/[0.07] hover:text-white",
			)}
		>
			{children}
		</button>
	)
}

export function TasksPage() {
	const [priorityF, setPriorityF] = useState<PriorityFilter>("all")
	const [completedF, setCompletedF] = useState<CompletedFilter>("all")
	const [dateF, setDateF] = useState("")
	const [createOpen, setCreateOpen] = useState(false)
	const [filtersOpen, setFiltersOpen] = useState(false)
	const toast = useToast()

	const params = {
		priority: priorityF !== "all" ? priorityF : undefined,
		completed: completedF === "all" ? undefined : completedF === "done",
		due_date: dateF || undefined,
	}

	const { data: tasksData, isLoading } = useTasks(params)
	const tasks = Array.isArray(tasksData) ? tasksData : []
	const create = useCreateTask()

	const stats = useMemo(() => {
		const total = tasks.length
		const done = tasks.filter((task) => task.completed).length
		return { total, done, active: total - done }
	}, [tasks])

	const handleCreate = async (
		data: TaskCreate | import("../types").TaskUpdate,
	) => {
		await create.mutateAsync(data as TaskCreate)
		toast.success("Задача создана")
		setCreateOpen(false)
	}

	const activeCount = [
		priorityF !== "all",
		completedF !== "all",
		!!dateF,
	].filter(Boolean).length

	return (
		<div className='min-h-full text-white'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-1'>
				<section className='rounded-4xl border border-white/10 bg-[rgba(20,18,16,0.78)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl'>
					<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
						<div>
							<p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35'>
								Все задачи
							</p>
							<h1 className='mt-2 text-[34px] font-semibold tracking-[-0.04em] text-white'>
								Управление задачами
							</h1>
							<p className='mt-3 max-w-2xl text-[15px] leading-7 text-white/55'>
								Следи за активными задачами, фильтруй по
								приоритету и срокам и держи весь список под
								контролем.
							</p>
						</div>

						<div className='flex flex-wrap items-center gap-3'>
							<button
								type='button'
								onClick={() => setFiltersOpen((prev) => !prev)}
								className={clsx(
									"inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
									filtersOpen
										? "text-white"
										: "border-white/10 bg-white/4 text-white/72 hover:bg-white/[0.07] hover:text-white",
								)}
								style={
									filtersOpen
										? {
												borderColor:
													"rgba(154,134,137,0.24)",
												background: AUTH_ACCENT_SOFT,
												color: AUTH_ACCENT_TEXT,
											}
										: undefined
								}
							>
								<SlidersHorizontal className='h-4 w-4' />
								Фильтры
								{activeCount > 0 && (
									<span className='ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a12c7b] px-2 text-[11px] font-bold text-white'>
										{activeCount}
									</span>
								)}
							</button>

							<button
								type='button'
								onClick={() => setCreateOpen(true)}
								className='inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition'
								style={{
									background: AUTH_ACCENT,
									boxShadow:
										"0 14px 28px rgba(154,134,137,0.22)",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background =
										AUTH_ACCENT_HOVER
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background =
										AUTH_ACCENT
								}}
							>
								<Plus className='h-4 w-4' />
								Добавить задачу
							</button>
						</div>
					</div>

					<div className='mt-6 grid gap-4 sm:grid-cols-3'>
						<Stat
							label='Всего'
							value={stats.total}
						/>
						<Stat
							label='Активные'
							value={stats.active}
							tone='accent'
						/>
						<Stat
							label='Готово'
							value={stats.done}
							tone='dark'
						/>
					</div>

					{filtersOpen && (
						<div className='mt-6 rounded-[28px] border border-white/10 bg-white/4 p-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl'>
							<div className='grid gap-5 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.5fr_1fr]'>
								<div>
									<p className='mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/35'>
										Приоритет
									</p>
									<div className='flex flex-wrap gap-2'>
										{PRIORITY_OPTIONS.map((option) => (
											<FilterChip
												key={option.value}
												active={
													priorityF === option.value
												}
												onClick={() =>
													setPriorityF(option.value)
												}
												activeColor={option.activeColor}
											>
												{option.dotColor ? (
													<span
														className='h-2 w-2 rounded-full'
														style={{
															background:
																priorityF ===
																option.value
																	? "rgba(255,255,255,0.75)"
																	: option.dotColor,
														}}
													/>
												) : null}
												{option.label}
											</FilterChip>
										))}
									</div>
								</div>

								<div>
									<p className='mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/35'>
										Статус
									</p>
									<div className='grid grid-cols-3 gap-2'>
										{STATUS_OPTIONS.map(
											({ value, label, Icon }) => {
												const active =
													completedF === value

												return (
													<button
														key={value}
														type='button'
														onClick={() =>
															setCompletedF(value)
														}
														className={clsx(
															"flex h-20 flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-[13px] font-medium transition-all",
															active
																? "text-white"
																: "border-white/10 bg-white/4 text-white/65 hover:bg-white/[0.07] hover:text-white",
														)}
														style={
															active
																? {
																		borderColor:
																			"rgba(154,134,137,0.24)",
																		background:
																			AUTH_ACCENT_SOFT,
																		color: AUTH_ACCENT_TEXT,
																	}
																: undefined
														}
													>
														<Icon className='h-4 w-4' />
														{label}
													</button>
												)
											},
										)}
									</div>
								</div>

								<div className='lg:col-span-2'>
									<p className='mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/35'>
										Дата
									</p>
									<div className='flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4'>
										<CalendarDays className='h-4 w-4 text-white/35' />
										<input
											type='date'
											value={dateF}
											onChange={(e) =>
												setDateF(e.target.value)
											}
											className='flex-1 bg-transparent text-[14px] text-white outline-none'
										/>
										{dateF && (
											<button
												type='button'
												onClick={() => setDateF("")}
												className='flex h-8 w-8 items-center justify-center rounded-full text-white/35 hover:bg-white/[0.07] hover:text-white'
											>
												<X className='h-4 w-4' />
											</button>
										)}
									</div>
								</div>
							</div>

							{activeCount > 0 && (
								<button
									type='button'
									onClick={() => {
										setPriorityF("all")
										setCompletedF("all")
										setDateF("")
									}}
									className='mt-5 h-11 rounded-full border border-white/10 bg-white/4 px-5 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white'
								>
									Сбросить фильтры
								</button>
							)}
						</div>
					)}
				</section>

				<section className='rounded-4xl border border-white/10 bg-[rgba(20,18,16,0.78)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<p className='text-sm font-medium text-white/42'>
								{isLoading
									? "Загрузка…"
									: `${stats.total} ${stats.total === 1 ? "задача" : stats.total < 5 ? "задачи" : "задач"}`}
							</p>
							<h2 className='mt-2 text-[28px] font-semibold tracking-[-0.04em] text-white'>
								Список задач
							</h2>
						</div>

						<button
							type='button'
							onClick={() => setCreateOpen(true)}
							className='inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/6 px-4 text-sm font-semibold text-white transition hover:bg-white/10'
						>
							<Plus className='h-4 w-4' />
							Новая задача
						</button>
					</div>

					<div className='mt-6 space-y-4'>
						{isLoading ? (
							<div className='space-y-3'>
								{[1, 2, 3].map((index) => (
									<TaskSkeleton key={index} />
								))}
							</div>
						) : tasks.length === 0 ? (
							<div className='rounded-[28px] border border-white/10 bg-white/4 px-6 py-14 text-center shadow-[0_18px_50px_rgba(0,0,0,0.16)]'>
								<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white/25'>
									<ClipboardList className='h-8 w-8' />
								</div>
								<h3 className='text-[20px] font-semibold text-white'>
									Список пуст
								</h3>
								<p className='mt-2 text-[14px] text-white/50'>
									Нет задач по выбранным фильтрам. Создайте
									задачу или сбросьте фильтры.
								</p>
							</div>
						) : (
							<div className='grid gap-4'>
								{tasks.map((task) => (
									<TaskCard
										key={task.id}
										task={task}
									/>
								))}
							</div>
						)}
					</div>
				</section>
			</div>

			<Modal
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				title='Новая задача'
			>
				<TaskForm
					onSubmit={handleCreate}
					onCancel={() => setCreateOpen(false)}
				/>
			</Modal>
		</div>
	)
}
