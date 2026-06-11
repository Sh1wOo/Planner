import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
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
} from "date-fns";
import { ru } from "date-fns/locale";
import clsx from "clsx";
import { useTasks, useCreateTask } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskSkeleton } from "../components/ui/Skeleton";
import { Modal } from "../components/ui/Modal";
import { TaskForm } from "../components/tasks/TaskForm";
import { useToast } from "../components/ui/Toast";
import type { Task, TaskCreate } from "../types";
import bgImage from "../assets/dashboard.jpeg";

const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;

export function CalendarPage(): JSX.Element {
  const [current, setCurrent] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date>(new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const toast = useToast();
  const create = useCreateTask();

  const selectedStr = format(selected, "yyyy-MM-dd");

  const { data: dayTasksRaw, isLoading } = useTasks({ due_date: selectedStr });
  const dayTasks = Array.isArray(dayTasksRaw) ? (dayTasksRaw as Task[]) : [];

  const { data: allTasksRaw } = useTasks();
  const allTasks = Array.isArray(allTasksRaw) ? (allTasksRaw as Task[]) : [];

  const viewYear = current.getFullYear();
  const viewMonth = current.getMonth();

  const incompleteDays = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach((task) => {
      if (task.completed) return;
      if (!task.due_date) return;
      const dueDate = new Date(task.due_date);
      if (dueDate.getFullYear() === viewYear && dueDate.getMonth() === viewMonth) {
        set.add(format(dueDate, "yyyy-MM-dd"));
      }
    });
    return set;
  }, [allTasks, viewYear, viewMonth]);

  const calStart = startOfWeek(startOfMonth(current), { weekStartsOn: 1 });
  const calEnd = endOfWeek(endOfMonth(current), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const prevMonth = () => setCurrent((prev) => subMonths(prev, 1));
  const nextMonth = () => setCurrent((prev) => addMonths(prev, 1));

  const handleCreate = async (data: TaskCreate | import("../types").TaskUpdate): Promise<void> => {
    await create.mutateAsync({ ...(data as TaskCreate), due_date: selectedStr });
    toast.success("Задача добавлена");
    setCreateOpen(false);
  };

  const incompleteDayTasks = useMemo(() => dayTasks.filter((task) => !task.completed), [dayTasks]);

  return (
    <div className="relative min-h-screen bg-[#f6f5f2] text-[#2e2b27]">
      <img src={bgImage} alt="Фон" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-[#f6f5f2]/90 backdrop-blur-sm" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-[#e6dfd7] bg-white/95 p-6 shadow-[0_24px_80px_rgba(46,43,39,0.12)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#9a9187]">Планер</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold text-[#2f2b28]" style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}>
                  {format(current, "LLLL", { locale: ru })}
                </h1>
                <span className="text-base font-medium text-[#7a756f]">{format(current, "yyyy")}</span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e675f]">
                Календарь на весь экран: всё центрировано, цветовая палитра сохранена, лишние эффекты убраны.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2f2b28] px-4 text-sm font-semibold text-white transition hover:bg-[#3d3a35]"
            >
              <Plus className="h-4 w-4" />
              Добавить задачу
            </button>
          </div>

          <div className="sm:hidden mt-8 rounded-[28px] border border-[#e3ddd6] bg-[#faf7f3] p-4 shadow-[0_18px_50px_rgba(46,43,39,0.08)]">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b857d]">Календарь</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#2f2b28]">Выберите дату</h2>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a5550] transition hover:bg-[#e8e6e1]"
                  aria-label="Предыдущий месяц"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="rounded-[20px] border border-[#d8d2cb] bg-white px-3 py-2 text-sm font-medium text-[#2f2b28]">
                  {format(current, "LLLL yyyy", { locale: ru })}
                </div>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a5550] transition hover:bg-[#e8e6e1]"
                  aria-label="Следующий месяц"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-[0.16em] text-[#8b857d]">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const dayStr = format(day, "yyyy-MM-dd");
                  const isCurrentMonth = day.getMonth() === current.getMonth();
                  const isSelected = isSameDay(day, selected);
                  const isCurrentDay = isToday(day);
                  const hasMarker = incompleteDays.has(dayStr) && isCurrentMonth;

                  return (
                    <button
                      key={dayStr}
                      type="button"
                      onClick={() => setSelected(day)}
                      className={clsx(
                        "flex h-14 flex-col items-center justify-center rounded-3xl border px-1 text-center transition-all",
                        isSelected
                          ? "border-[#01696f] bg-[#e9f6f6] text-[#0f2424] shadow-[0_8px_24px_rgba(1,105,111,0.16)]"
                          : isCurrentDay
                          ? "border-[#2f2b28] bg-[#2f2b28] text-white"
                          : "border-transparent bg-white text-[#706c68]",
                        !isCurrentMonth && "bg-white/60 text-[#b3ada4]"
                      )}
                      aria-pressed={isSelected}
                      aria-label={format(day, "d MMMM yyyy", { locale: ru })}
                    >
                      <span className="text-sm font-semibold">{format(day, "d")}</span>
                      <span className={clsx("mt-2 h-1.5 w-1.5 rounded-full", hasMarker ? "bg-[#01696f]" : "bg-transparent")} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden sm:block mt-8 overflow-hidden rounded-[28px] border border-[#e3ddd6] bg-[#faf7f3] p-4 shadow-[0_18px_50px_rgba(46,43,39,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b857d]">Календарь</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#2f2b28]">Выберите дату</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a5550] transition hover:bg-[#e8e6e1]"
                  aria-label="Предыдущий месяц"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a5550] transition hover:bg-[#e8e6e1]"
                  aria-label="Следующий месяц"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-2 px-1 text-center text-[11px] uppercase tracking-[0.18em] text-[#8b857d]">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2 px-1">
              {days.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const isCurrentMonth = day.getMonth() === current.getMonth();
                const isSelected = isSameDay(day, selected);
                const isCurrentDay = isToday(day);
                const hasMarker = incompleteDays.has(dayStr) && isCurrentMonth;

                return (
                  <button
                    key={dayStr}
                    type="button"
                    onClick={() => setSelected(day)}
                    className={clsx(
                      "flex h-16 flex-col items-center justify-center rounded-3xl border transition-all",
                      isSelected
                        ? "border-[#01696f] bg-[#e9f6f6] text-[#0f2424] shadow-[0_8px_24px_rgba(1,105,111,0.16)]"
                        : isCurrentDay
                        ? "border-[#2f2b28] bg-[#2f2b28] text-white"
                        : "border-transparent bg-white text-[#706c68]",
                      !isCurrentMonth && "bg-white/60 text-[#b3ada4]"
                    )}
                    aria-pressed={isSelected}
                    aria-label={format(day, "d MMMM yyyy", { locale: ru })}
                  >
                    <span className="text-sm font-semibold">{format(day, "d")}</span>
                    <span className={clsx("mt-2 h-1.5 w-1.5 rounded-full", hasMarker ? "bg-[#01696f]" : "bg-transparent")} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#e6dfd7] bg-white/95 p-6 shadow-[0_24px_80px_rgba(46,43,39,0.12)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b857d]">{format(selected, "EEEE", { locale: ru })}</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#2f2b28]" style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}>
                {format(selected, "d MMMM", { locale: ru })}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2f2b28] px-4 text-sm font-semibold text-white transition hover:bg-[#3d3a35]"
            >
              <Plus className="h-4 w-4" />
              Добавить задачу
            </button>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((index) => (
                  <TaskSkeleton key={index} />
                ))}
              </div>
            ) : incompleteDayTasks.length === 0 ? (
              <div className="rounded-[28px] border border-[#e3ddd6] bg-[#faf7f3] px-6 py-10 text-center shadow-[0_18px_50px_rgba(46,43,39,0.08)]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f0ec] text-[#c4c0bb]">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <p className="text-[14px] font-medium text-[#5a5550]">
                  {dayTasks.length > 0 ? "Все задачи выполнены 🎉" : "На этот день планов нет"}
                </p>
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="mt-4 text-[13px] font-semibold text-[#01696f] hover:underline underline-offset-4"
                >
                  + Добавить задачу
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {incompleteDayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новая задача">
        <TaskForm initialValues={{ due_date: selectedStr } as Partial<Task>} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}
