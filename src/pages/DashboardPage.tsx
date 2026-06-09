import { useMemo, useState, useEffect, useRef } from "react";
import { Plus, Cloud, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { gsap } from "gsap";
import { useTodayTasks, useCreateTask, useTasks } from "../hooks/useTasks";
import { useMe } from "../hooks/useAuth";
import { Modal } from "../components/ui/Modal";
import { TaskForm } from "../components/tasks/TaskForm";
import { useToast } from "../components/ui/Toast";
import type { TaskCreate } from "../types";

const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель",
  "Май", "Июнь", "Июль", "Август",
  "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
] as const;

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatTaskTime(dateString?: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "HH.mm");
}

type CalendarTask = {
  id: string;
  title: string;
  duedate?: string | null;
  date?: string | null;
  completed?: boolean;
};

export function DashboardPage() {
  const { data: user } = useMe();
  // currentView tracks which month is displayed in calendar
  const [currentView, setCurrentView] = useState(() => new Date());
  const { data: tasks, isLoading } = useTodayTasks();
  const create = useCreateTask();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const today = now.getDate();
  const realYear = now.getFullYear();
  const realMonth = now.getMonth();

  const viewYear = currentView.getFullYear();
  const viewMonth = currentView.getMonth();

  const monthGrid = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  // Fetch ALL tasks to determine days with tasks
  const { data: allTasksRaw } = useTasks();
  const allTasks = useMemo<CalendarTask[]>(
    () => (Array.isArray(allTasksRaw) ? (allTasksRaw as CalendarTask[]) : []),
    [allTasksRaw]
  );

  // Build a Set of day numbers that have tasks in the currently viewed month
  const daysWithTasks = useMemo<Set<number>>(() => {
    const s = new Set<number>();
    for (const task of allTasks) {
      const raw = task.duedate ?? task.date;
      if (!raw) continue;
      const d = new Date(raw);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        s.add(d.getDate());
      }
    }
    return s;
  }, [allTasks, viewYear, viewMonth]);

  const timelineTasks = useMemo(() => {
    if (!tasks?.length) return [];
    return [...(tasks as CalendarTask[])]
      .sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      })
      .slice(0, 4);
  }, [tasks]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".planner-fade",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.07, ease: "power3.out", delay: 0.05 }
      );
      gsap.fromTo(
        ".calendar-cell",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.012, ease: "power2.out", delay: 0.2 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleCreate = async (data: TaskCreate) => {
    try {
      await create.mutateAsync(data);
      toast.success("Задача создана");
      setCreateOpen(false);
    } catch {
      toast.error("Ошибка при создании задачи");
    }
  };

  const done = tasks?.filter((t: any) => t.completed).length ?? 0;
  const total = tasks?.length ?? 0;

  const isViewingCurrentMonth = viewYear === realYear && viewMonth === realMonth;

  return (
    <div ref={pageRef} className="min-h-screen bg-[#f6f5f2] text-[#2e2b27]">
      <div className="mx-auto w-full max-w-107.5 px-5 pb-8 pt-6">

        {/* ─── Top capsules ─── */}
        <div className="planner-fade mb-10 flex items-start justify-between gap-3">
          <div className="rounded-[28px] bg-[#dddddb] px-5 py-4 min-w-[146px]">
            <p className="text-[22px] font-semibold tracking-[-0.04em] text-white">Planner</p>
          </div>
          <div className="rounded-[26px] bg-[#dddddb] px-4 py-3 min-w-[144px]">
            <div className="flex items-center gap-3 text-white">
              <Cloud className="h-7 w-7 stroke-[1.7]" />
              <div className="leading-none">
                <p className="text-[12px] text-white/95">Брест</p>
                <p className="mt-1 text-[18px] font-medium tracking-[-0.03em]">20 °C</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Calendar ─── */}
        <section className="planner-fade">
          {/* Month title + year + nav arrows */}
          <div className="mb-5 flex items-end justify-between">
            <h1
              className="text-[42px] leading-none tracking-[-0.04em] text-[#2f2b28]"
              style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}
            >
              {monthNames[viewMonth]}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-light tracking-[-0.03em] text-[#44403b] mr-1">{viewYear}</span>
              <button
                onClick={() => setCurrentView(prev => subMonths(prev, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e6e1] text-[#7a7974] transition-colors hover:bg-[#dddddb] active:scale-95"
                aria-label="Предыдущий месяц"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentView(prev => addMonths(prev, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e6e1] text-[#7a7974] transition-colors hover:bg-[#dddddb] active:scale-95"
                aria-label="Следующий месяц"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="mb-4 grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-[13px] font-medium tracking-[0.02em] text-[#6e6a66]">
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-3">
            {monthGrid.map((day, idx) => {
              const isCurrentDay = isViewingCurrentMonth && day === today;
              const hasPlannedTasks = day !== null && daysWithTasks.has(day);

              return (
                <div key={`${day}-${idx}`} className="calendar-cell flex items-center justify-center">
                  {day ? (
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full text-[15px] transition-all duration-300",
                        isCurrentDay
                          ? "bg-[#dddddb] font-semibold text-[#2f2b28] shadow-sm"
                          : hasPlannedTasks
                          ? "bg-[#e4e1dc] font-medium text-[#4a4641]"
                          : "text-[#706c68]",
                      ].join(" ")}
                    >
                      {day}
                    </div>
                  ) : (
                    <div className="h-9 w-9" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Day name + timeline (always shows TODAY's tasks) ─── */}
        <section className="planner-fade mt-10">
          <div className="mb-5 flex items-end justify-between">
            <h2
              className="text-[34px] leading-none tracking-[-0.05em] text-[#2f2b28] uppercase"
              style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif' }}
            >
              {format(now, "EEEE", { locale: ru })}
            </h2>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dddddb] text-[#3b3834] transition-all duration-200 hover:bg-[#d4d1cc] active:scale-95"
              aria-label="Добавить задачу"
            >
              <Plus className="h-4 w-4 stroke-[2.3]" />
            </button>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[58px] top-2 bottom-2 w-px bg-[#3f3a35]" />
            <div className="space-y-6">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-[58px] text-right text-[17px] text-[#8e8a85]">--</div>
                    <div className="flex-1 pt-0.5">
                      <div className="h-5 w-32 rounded-full bg-[#e4e1dc] animate-pulse" />
                    </div>
                  </div>
                ))
              ) : timelineTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center pl-[66px]">
                  <p className="text-[15px] text-[#5a5550]">Нет задач на сегодня</p>
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="mt-3 text-[13px] font-medium text-[#4a4641] underline underline-offset-4 hover:text-[#2f2b28]"
                  >
                    Добавить задачу
                  </button>
                </div>
              ) : (
                timelineTasks.map((task) => {
                  const time = formatTaskTime(task.date ?? task.duedate);
                  return (
                    <div key={task.id} className="flex gap-5">
                      <div className="w-[58px] shrink-0 text-right text-[18px] font-light tracking-[-0.04em] text-[#4a4641]">
                        {time ?? "—"}
                      </div>
                      <div className="relative flex-1 pt-0.5">
                        {task.completed && (
                          <div className="absolute -left-[9px] top-[8px] h-4 w-4 rounded-full bg-[#dddddb]" />
                        )}
                        <div className="pr-2 text-[16px] leading-[1.35] text-[#47433f]">{task.title}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ─── Bottom task summary card ─── */}
        <section className="planner-fade mt-12">
          <div className="rounded-[28px] bg-[#dddddb] px-5 py-5">
            <h3 className="text-[20px] font-medium tracking-[-0.03em] text-[#2f2b28]">Ваши задачи</h3>
            <p className="mt-2 text-[15px] leading-[1.45] text-[#4f4a45]">
              Здесь будут храниться все ваши планы на текущие день/неделю/месяц. Нажмите для просмотра.
            </p>
            {total > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-[#cfcac4] pt-4">
                <p className="text-[14px] text-[#5a5550]">Выполнено сегодня</p>
                <p className="text-[18px] font-medium tracking-[-0.03em] text-[#2f2b28]">
                  {done}/{total}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новая задача">
        <TaskForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}