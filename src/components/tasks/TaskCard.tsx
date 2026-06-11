import { useMemo, useState } from "react"
import { Pencil, Trash2, CalendarDays, Check } from "lucide-react"
import clsx from "clsx"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Modal } from "../ui/Modal"
import { TaskForm } from "./TaskForm"
import { useUpdateTask, useDeleteTask } from "../../hooks/useTasks"
import { useToast } from "../ui/Toast"
import type { Task, TaskUpdate } from "../../types"

const AUTH_ACCENT = "#9a8689"
const AUTH_ACCENT_SOFT = "#eadfe1"
const AUTH_ACCENT_TONE = "#7e696d"
const AUTH_ACCENT_RING = "rgba(154, 134, 137, 0.16)"
const AUTH_ACCENT_HOVER = "rgba(154, 134, 137, 0.12)"

const priorityMap: Record<
	Task["priority"],
	{
		label: string
		tone: string
		soft: string
		ring: string
		dot: string
	}
> = {
	low: {
		label: "Низкий",
		tone: "#3f6a1f",
		soft: "#e5f2d8",
		ring: "rgba(99, 146, 53, 0.14)",
		dot: "#6b9a3c",
	},
	medium: {
		label: "Средний",
		tone: "#8a5b00",
		soft: "#f6ead0",
		ring: "rgba(209, 153, 0, 0.14)",
		dot: "#c28a09",
	},
	high: {
		label: "Высокий",
		tone: "#9b2f45",
		soft: "#f7dde2",
		ring: "rgba(161, 53, 68, 0.14)",
		dot: "#c14b5d",
	},
}

export function TaskCard({ task }: { task: Task }) {
	const [editOpen, setEditOpen] = useState(false)
	const update = useUpdateTask()
	const remove = useDeleteTask()
	const toast = useToast()

	const priority = priorityMap[task.priority] ?? priorityMap.medium

	const formattedDate = useMemo(() => {
		if (!task.due_date) return "Без даты"
		try {
			return format(new Date(`${task.due_date}T12:00:00`), "d MMMM", {
				locale: ru,
			})
		} catch {
			return task.due_date
		}
	}, [task.due_date])

	const handleToggle = async () => {
		await update.mutateAsync({
			id: task.id,
			data: { completed: !task.completed },
		})
		toast.success(
			task.completed ? "Задача снова активна" : "Задача завершена",
		)
	}

	const handleUpdate = async (data: TaskUpdate) => {
		await update.mutateAsync({ id: task.id, data })
		toast.success("Изменения сохранены")
		setEditOpen(false)
	}

	const handleDelete = async () => {
		if (!confirm("Удалить задачу?")) return
		await remove.mutateAsync(task.id)
		toast.success("Задача удалена")
	}

	return (
		<>
			<article
				className={clsx(
					"group w-full rounded-[26px] border border-[rgba(40,37,29,0.08)] bg-[rgba(252,251,248,0.9)] shadow-[0_10px_30px_rgba(24,22,19,0.05)] transition-all duration-200",
					"hover:-translate-y-px hover:shadow-[0_16px_40px_rgba(24,22,19,0.08)]",
					task.completed && "bg-[rgba(248,247,244,0.92)]",
				)}
			>
				<div className='flex items-start gap-3 p-3 sm:gap-4 sm:p-4'>
					<button
						type='button'
						onClick={handleToggle}
						className={clsx(
							"mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-[0.97]",
							task.completed
								? "text-white"
								: "border-[rgba(40,37,29,0.14)] bg-white text-transparent hover:bg-[#f8f7f4]",
						)}
						style={
							task.completed
								? {
										borderColor: AUTH_ACCENT,
										background: AUTH_ACCENT,
										boxShadow: `0 0 0 4px ${AUTH_ACCENT_RING}`,
									}
								: {
										borderColor: "rgba(40,37,29,0.14)",
									}
						}
						onMouseEnter={(e) => {
							if (!task.completed) {
								e.currentTarget.style.borderColor = AUTH_ACCENT
								e.currentTarget.style.background =
									AUTH_ACCENT_HOVER
							}
						}}
						onMouseLeave={(e) => {
							if (!task.completed) {
								e.currentTarget.style.borderColor =
									"rgba(40,37,29,0.14)"
								e.currentTarget.style.background = "#ffffff"
							}
						}}
						aria-label={
							task.completed
								? "Сделать невыполненной"
								: "Отметить выполненной"
						}
					>
						<Check
							className='h-5 w-5'
							strokeWidth={3}
						/>
					</button>

					<div className='min-w-0 flex-1'>
						<div className='flex items-start justify-between gap-3'>
							<div className='min-w-0'>
								<h3
									className={clsx(
										"wrap-break-word text-[17px] font-semibold leading-[1.3] tracking-[-0.03em] text-text transition-colors",
										task.completed &&
											"text-[#8e8a85] line-through",
									)}
								>
									{task.title}
								</h3>

								<div className='mt-3 flex flex-wrap items-center gap-2'>
									<div className='inline-flex items-center gap-1.5 rounded-full bg-[#f3f0ec] px-3 py-1.5 text-[12px] font-medium text-[#6f6c66] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'>
										<CalendarDays className='h-3.5 w-3.5 shrink-0' />
										<span>{formattedDate}</span>
									</div>

									<div
										className='inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
										style={{
											background: priority.soft,
											color: priority.tone,
											boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 0 0 1px ${priority.ring}`,
										}}
									>
										<span
											className='h-2 w-2 rounded-full'
											style={{ background: priority.dot }}
										/>
										<span>{priority.label}</span>
									</div>

									{task.completed && (
										<div
											className='inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
											style={{
												background: AUTH_ACCENT_SOFT,
												color: AUTH_ACCENT_TONE,
												boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 0 0 1px ${AUTH_ACCENT_RING}`,
											}}
										>
											<Check className='h-3.5 w-3.5' />
											<span>Выполнено</span>
										</div>
									)}
								</div>
							</div>

							<div className='flex shrink-0 items-center gap-1 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
								<button
									type='button'
									onClick={() => setEditOpen(true)}
									className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ec] text-[#6f6c66] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-200 hover:bg-white hover:text-text active:scale-[0.95]'
									aria-label='Редактировать'
								>
									<Pencil className='h-4 w-4' />
								</button>

								<button
									type='button'
									onClick={handleDelete}
									className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ec] text-[#7a6b69] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-200 hover:bg-[#f7dde2] hover:text-[#9b2f45] active:scale-[0.95]'
									aria-label='Удалить'
								>
									<Trash2 className='h-4 w-4' />
								</button>
							</div>
						</div>
					</div>
				</div>
			</article>

			<Modal
				open={editOpen}
				onClose={() => setEditOpen(false)}
				title='Редактировать задачу'
			>
				<TaskForm
					initialValues={task}
					onSubmit={handleUpdate}
					onCancel={() => setEditOpen(false)}
					submitLabel='Сохранить'
				/>
			</Modal>
		</>
	)
}
