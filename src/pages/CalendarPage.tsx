import { useMemo, useState } from "react"
import {
	ChevronLeft,
	ChevronRight,
	Plus,
	Calendar as CalendarIcon,
} from "lucide-react"
import {
	format,
	eachDayOfInterval,
	isSameDay,
	isToday,
	startOfWeek,
	endOfWeek,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
} from "date-fns"
import { ru } from "date-fns/locale"
import clsx from "clsx"
import { useTasks, useCreateTask } from "../hooks/useTasks"
import { TaskCard } from "../components/tasks/TaskCard"
import { TaskSkeleton } from "../components/ui/Skeleton"
import { Modal } from "../components/ui/Modal"
import { TaskForm } from "../components/tasks/TaskForm"
import { useToast } from "../components/ui/Toast"
import type { Task, TaskCreate } from "../types"

const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const

const AUTH_ACCENT = "#9a8689"
const AUTH_ACCENT_HOVER = "#8b777a"
const AUTH_ACCENT_SOFT = "rgba(154,134,137,0.14)"
const AUTH_ACCENT_RING = "rgba(154,134,137,0.16)"
const AUTH_ACCENT_TEXT = "#dbc8cb"

export function CalendarPage(): JSX.Element {
	const [current, setCurrent] = useState<Date>(new Date())
	const [selected, setSelected] = useState<Date>(new Date())
	const [createOpen, setCreateOpen] = useState(false)
	const toast = useToast()
	const create = useCreateTask()

	const selectedStr = format(selected, "yyyy-MM-dd")

	const { data: dayTasksRaw, isLoading } = useTasks({ due_date: selectedStr })
	const dayTasks = Array.isArray(dayTasksRaw) ? (dayTasksRaw as Task[]) : []

	const { data: allTasksRaw } = useTasks()
	const allTasks = Array.isArray(allTasksRaw) ? (allTasksRaw as Task[]) : []

	const viewYear = current.getFullYear()
	const viewMonth = current.getMonth()

	const incompleteDays = useMemo(() => {
		const set = new Set<string>()
		allTasks.forEach((task) => {
			if (task.completed || !task.due_date) return
			const dueDate = new Date(task.due_date)
			if (
				dueDate.getFullYear() === viewYear &&
				dueDate.getMonth() === viewMonth
			) {
				set.add(format(dueDate, "yyyy-MM-dd"))
			}
		})
		return set
	}, [allTasks, viewYear, viewMonth])

	const calStart = startOfWeek(startOfMonth(current), { weekStartsOn: 1 })
	const calEnd = endOfWeek(endOfMonth(current), { weekStartsOn: 1 })
	const days = eachDayOfInterval({ start: calStart, end: calEnd })

	const prevMonth = () => setCurrent((prev) => subMonths(prev, 1))
	const nextMonth = () => setCurrent((prev) => addMonths(prev, 1))

	const handleCreate = async (
		data: TaskCreate | import("../types").TaskUpdate,
	): Promise<void> => {
		await create.mutateAsync({
			...(data as TaskCreate),
			due_date: selectedStr,
		})
		toast.success("Задача добавлена")
		setCreateOpen(false)
	}

	const incompleteDayTasks = useMemo(
		() => dayTasks.filter((task) => !task.completed),
		[dayTasks],
	)

	return (
		<div className='min-h-full text-white'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-4 px-0 py-0 sm:gap-5'>
				<section className='overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(20,18,16,0.78)] shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:rounded-[32px] sm:shadow-[0_24px_80px_rgba(0,0,0,0.24)]'>
					<div className='grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-7'>
						<div>
							<p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 sm:text-[11px]'>
								Calendar overview
							</p>

							<h1 className='mt-2 text-[28px] font-semibold tracking-[-0.05em] text-white sm:mt-3 sm:text-[34px]'>
								{format(current, "LLLL yyyy", { locale: ru })}
							</h1>

							<p className='mt-3 max-w-md text-[14px] leading-6 text-white/55 sm:max-w-xl sm:text-[15px] sm:leading-7'>
								Следи за дедлайнами, быстро переключайся между
								днями и держи весь месяц перед глазами без
								визуального шума.
							</p>

							<div className='mt-5 flex items-center gap-2 sm:mt-6 sm:gap-3'>
								<button
									type='button'
									onClick={prevMonth}
									className='flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.97]'
									aria-label='Предыдущий месяц'
								>
									<ChevronLeft className='h-4 w-4' />
								</button>

								<button
									type='button'
									onClick={nextMonth}
									className='flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.97]'
									aria-label='Следующий месяц'
								>
									<ChevronRight className='h-4 w-4' />
								</button>

								<button
									type='button'
									onClick={() => {
										setCurrent(new Date())
										setSelected(new Date())
									}}
									className='ml-auto inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition active:scale-[0.98] sm:ml-0 sm:px-5'
									style={{
										background: AUTH_ACCENT,
										boxShadow:
											"0 10px 22px rgba(154,134,137,0.20)",
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
									Сегодня
								</button>
							</div>
						</div>

						<div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
							<div className='rounded-[22px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[24px]'>
								<p className='text-[10px] uppercase tracking-[0.14em] text-white/35 sm:text-[11px]'>
									Выбрано
								</p>
								<p className='mt-2 text-base font-semibold text-white sm:text-lg'>
									{format(selected, "d MMMM", { locale: ru })}
								</p>
							</div>

							<div
								className='rounded-[22px] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[24px]'
								style={{
									borderColor: "rgba(154,134,137,0.24)",
									background: AUTH_ACCENT_SOFT,
								}}
							>
								<p
									className='text-[10px] uppercase tracking-[0.14em] sm:text-[11px]'
									style={{ color: AUTH_ACCENT_TEXT }}
								>
									Активных задач
								</p>
								<p className='mt-2 text-base font-semibold text-white sm:text-lg'>
									{incompleteDayTasks.length}
								</p>
							</div>

							<button
								type='button'
								onClick={() => setCreateOpen(true)}
								className='col-span-2 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left text-white transition hover:bg-white/[0.08] active:scale-[0.99] sm:rounded-[24px] lg:col-span-1'
							>
								<p className='text-[10px] uppercase tracking-[0.14em] text-white/42 sm:text-[11px]'>
									Quick action
								</p>
								<p className='mt-2 text-base font-semibold sm:text-lg'>
									Добавить задачу
								</p>
							</button>
						</div>
					</div>
				</section>

				<section className='rounded-[28px] border border-white/10 bg-[rgba(20,18,16,0.78)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:rounded-[32px] sm:p-6 sm:shadow-[0_20px_60px_rgba(0,0,0,0.22)]'>
					<div className='grid grid-cols-7 gap-1.5 px-0.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:gap-2 sm:px-1 sm:text-[11px] sm:tracking-[0.16em]'>
						{WEEKDAYS.map((day) => (
							<div
								key={day}
								className='py-2'
							>
								{day}
							</div>
						))}
					</div>

					<div className='mt-2 grid grid-cols-7 gap-1.5 px-0.5 sm:gap-2 sm:px-1'>
						{days.map((day) => {
							const dayStr = format(day, "yyyy-MM-dd")
							const isCurrentMonth =
								day.getMonth() === current.getMonth()
							const isSelected = isSameDay(day, selected)
							const isCurrentDay = isToday(day)
							const hasMarker =
								incompleteDays.has(dayStr) && isCurrentMonth

							return (
								<button
									key={dayStr}
									type='button'
									onClick={() => setSelected(day)}
									className={clsx(
										"relative flex h-[60px] min-h-[60px] flex-col items-center justify-center rounded-[18px] border text-[13px] font-semibold transition-all duration-200 active:scale-[0.97] sm:h-16 sm:min-h-16 sm:rounded-[22px] sm:text-sm",
										isSelected
											? "text-white"
											: isCurrentDay
												? "border-white/18 bg-white/[0.10] text-white"
												: "border-white/8 bg-white/[0.03] text-white/72 hover:bg-white/[0.06]",
										!isCurrentMonth && "text-white/28",
									)}
									style={
										isSelected
											? {
													borderColor:
														"rgba(154,134,137,0.26)",
													background:
														AUTH_ACCENT_SOFT,
													boxShadow: `0 10px 24px ${AUTH_ACCENT_RING}`,
												}
											: undefined
									}
									aria-pressed={isSelected}
									aria-label={format(day, "d MMMM yyyy", {
										locale: ru,
									})}
								>
									<span>{format(day, "d")}</span>
									<span
										className='mt-1.5 h-1.5 w-1.5 rounded-full sm:mt-2'
										style={{
											background: hasMarker
												? isSelected
													? AUTH_ACCENT_TEXT
													: isCurrentDay
														? "#ffffff"
														: AUTH_ACCENT
												: "transparent",
										}}
									/>
								</button>
							)
						})}
					</div>
				</section>

				<section className='rounded-[28px] border border-white/10 bg-[rgba(20,18,16,0.78)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:rounded-[32px] sm:p-6 sm:shadow-[0_24px_80px_rgba(0,0,0,0.24)]'>
					<div className='flex flex-col gap-4'>
						<div>
							<p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 sm:text-[11px]'>
								{format(selected, "EEEE", { locale: ru })}
							</p>
							<h2 className='mt-2 text-[24px] font-semibold tracking-[-0.05em] text-white sm:text-[30px]'>
								{format(selected, "d MMMM", { locale: ru })}
							</h2>
						</div>

						<button
							type='button'
							onClick={() => setCreateOpen(true)}
							className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition active:scale-[0.98] sm:h-11 sm:w-auto sm:self-start'
							style={{ background: AUTH_ACCENT }}
							onMouseEnter={(e) => {
								e.currentTarget.style.background =
									AUTH_ACCENT_HOVER
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = AUTH_ACCENT
							}}
						>
							<Plus className='h-4 w-4' />
							Добавить задачу
						</button>
					</div>

					<div className='mt-5 sm:mt-6'>
						{isLoading ? (
							<div className='space-y-3'>
								{[1, 2].map((index) => (
									<TaskSkeleton key={index} />
								))}
							</div>
						) : incompleteDayTasks.length === 0 ? (
							<div className='rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-10 text-center shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:rounded-[28px] sm:px-6 sm:py-12'>
								<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/25'>
									<CalendarIcon className='h-6 w-6' />
								</div>
								<p className='text-[15px] font-medium text-white/72'>
									{dayTasks.length > 0
										? "Все задачи выполнены"
										: "На этот день планов нет"}
								</p>
								<button
									type='button'
									onClick={() => setCreateOpen(true)}
									className='mt-4 text-[13px] font-semibold underline-offset-4 hover:underline'
									style={{ color: AUTH_ACCENT_TEXT }}
								>
									+ Добавить задачу
								</button>
							</div>
						) : (
							<div className='grid gap-3 sm:gap-4'>
								{incompleteDayTasks.map((task) => (
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
					initialValues={{ due_date: selectedStr } as Partial<Task>}
					onSubmit={handleCreate}
					onCancel={() => setCreateOpen(false)}
				/>
			</Modal>
		</div>
	)
}
