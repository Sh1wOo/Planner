import { useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
} from "lucide-react";
import {
  format, eachDayOfInterval, isSameDay,
  isToday, startOfWeek, endOfWeek, addMonths, subMonths,
  startOfMonth, endOfMonth,
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

const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;

export function CalendarPage(): JSX.Element {
  const [current, setCurrent] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date>(new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const toast = useToast();
  const create = useCreateTask();

  const selectedStr = format(selected, "yyyy-MM-dd");

  // Tasks for the selected day (shown in the panel below)
  const { data: dayTasksRaw, isLoading } = useTasks({ due_date: selectedStr });
  const dayTasks = useMemo<Task[]>(
    () => (Array.isArray(dayTasksRaw) ? (dayTasksRaw as unknown as Task[]) : []),
    [dayTasksRaw]
  );

  // ALL tasks — used to build dot indicators on calendar cells
  const { data: allTasksRaw } = useTasks();
  const allTasks = useMemo<Task[]>(
    () => (Array.isArray(allTasksRaw) ? (allTasksRaw as unknown as Task[]) : []),
    [allTasksRaw]
  );

  const viewYear = current.getFullYear();
  const viewMonth = current.getMonth();

  // Set of "yyyy-MM-dd" strings that have at least one INCOMPLETE task in viewed month
  const incompleteDays = useMemo<Set<string>>(() => {
    const s = new Set<string>();
    for (const task of allTasks) {
      if (task.completed) continue; // skip completed
      const raw = task.due_date;
      if (!raw) continue;
      const d = new Date(raw);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        s.add(format(d, "yyyy-MM-dd"));
      }
    }
    return s;
  }, [allTasks, viewYear, viewMonth]);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const handleCreate = async (data: TaskCreate): Promise<void> => {
    await create.mutateAsync({ ...data, due_date: selectedStr });
    toast.success("Задача добавлена!");
    setCreateOpen(false);
  };

  // Incomplete tasks for the selected day
  const incompleteDayTasks = useMemo(
    () => dayTasks.filter(t => !t.completed),
    [dayTasks]
  );

  return (
    <div className="min-h-screen bg-[#f6f5f2] pb-24 text-[#2e2b27]">
      <div className="mx-auto w-full max-w-[430px] px-[10px] pt-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="rounded-[24px] bg-[#dddddb] px-5 py-3">
            <h1 className="flex items-center gap-2 text-[20px] font-semibold tracking-[-0.03em] text-white">
              <CalendarIcon className="h-5 w-5" />
              Календарь
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#dddddb] text-[#3b3834] transition-all hover:bg-[#d4d1cc] active:scale-95"
            aria-label="Добавить задачу"
          >
            <Plus className="h-5 w-5 stroke-2" />
          </button>
        </div>

        {/* Calendar */}
        <section className="mb-10">
          {/* Month title + nav */}
          <div className="mb-6 flex items-end justify-between">
            <h2
              className="text-[38px] uppercase leading-none tracking-[-0.04em] text-[#2f2b28]"
              style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}
            >
              {format(current, "LLLL", { locale: ru })}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-light tracking-[-0.02em] text-[#44403b] mr-1">
                {format(current, "yyyy")}
              </span>
              <button
                type="button"
                onClick={() => setCurrent(prev => subMonths(prev, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e6e1] text-[#7a7974] transition-colors hover:bg-[#dddddb] active:scale-95"
                aria-label="Предыдущий месяц"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrent(prev => addMonths(prev, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e6e1] text-[#7a7974] transition-colors hover:bg-[#dddddb] active:scale-95"
                aria-label="Следующий месяц"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="mb-3 grid grid-cols-7">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[12px] font-medium tracking-[0.02em] text-[#8e8a85]">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-2">
            {days.map(day => {
              const dayStr = format(day, "yyyy-MM-dd");
              const isCurrentMonth = day.getMonth() === current.getMonth();
              const isSelected = isSameDay(day, selected);
              const isCurrentDay = isToday(day);
              const hasIncomplete = incompleteDays.has(dayStr);

              return (
                <button
                  key={dayStr}
                  type="button"
                  onClick={() => setSelected(day)}
                  className="relative flex h-11 flex-col items-center justify-center transition-all active:scale-90"
                  aria-pressed={isSelected}
                  aria-label={format(day, "d MMMM yyyy", { locale: ru })}
                >
                  <div
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full text-[15px] transition-all duration-300",
                      !isCurrentMonth && "text-[#c4c0bb]",
                      isCurrentMonth && !isSelected && !isCurrentDay && "text-[#706c68] hover:bg-[#ebe9e4]",
                      isCurrentDay && !isSelected && "bg-[#e4e1dc] font-medium text-[#4a4641]",
                      isSelected && "bg-[#dddddb] font-semibold text-[#2f2b28] shadow-sm"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  {/* Dot — only for days with incomplete tasks */}
                  {hasIncomplete && isCurrentMonth && (
                    <span
                      className={clsx(
                        "absolute bottom-0.5 h-1 w-1 rounded-full",
                        isSelected ? "bg-[#5a5550]" : "bg-[#a8a49f]"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected day panel */}
        <section className="rounded-[28px] bg-[#dddddb] px-5 py-6">
          <div className="mb-6 flex items-end justify-between border-b border-[#cfcac4] pb-4">
            <div>
              <p className="mb-1 text-[13px] uppercase tracking-[0.1em] text-[#7a7570]">
                {format(selected, "EEEE", { locale: ru })}
              </p>
              <h3
                className="text-[26px] leading-none tracking-[-0.03em] text-[#2f2b28]"
                style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}
              >
                {format(selected, "d MMMM", { locale: ru })}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ccccc9] text-[#3b3834] transition-all hover:bg-[#c4c2bc] active:scale-95"
              aria-label="Добавить задачу"
            >
              <Plus className="h-4 w-4 stroke-2" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <TaskSkeleton key={i} />)}
            </div>
          ) : incompleteDayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-[15px] text-[#5a5550]">
                {dayTasks.length > 0
                  ? "Все задачи выполнены 🎉"
                  : "На этот день планов нет"}
              </p>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-3 text-[13px] font-medium text-[#4a4641] underline underline-offset-4 hover:text-[#2f2b28]"
              >
                Запланировать задачу
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {incompleteDayTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новая задача">
        <TaskForm
          initialValues={{ due_date: selectedStr } as Partial<Task>}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}