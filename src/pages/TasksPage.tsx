import { useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  Plus,
  SlidersHorizontal,
  ClipboardList,
  Sparkles,
  X,
  CalendarDays,
} from "lucide-react";

import { useTasks, useCreateTask } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskSkeleton } from "../components/ui/Skeleton";
import { Modal } from "../components/ui/Modal";
import { TaskForm } from "../components/tasks/TaskForm";
import { useToast } from "../components/ui/Toast";
import type { TaskCreate, Priority } from "../types";

type PriorityFilter = Priority | "all";
type CompletedFilter = "all" | "active" | "done";

const PRIORITY_OPTIONS: Array<{
  value: PriorityFilter;
  label: string;
  activeColor: string;
  dotColor: string;
}> = [
  { value: "all", label: "Все", activeColor: "#2f2b28", dotColor: "" },
  { value: "high", label: "Высокий", activeColor: "#b91c1c", dotColor: "#ef4444" },
  { value: "medium", label: "Средний", activeColor: "#b45309", dotColor: "#f59e0b" },
  { value: "low", label: "Низкий", activeColor: "#166534", dotColor: "#22c55e" },
];

const STATUS_OPTIONS: Array<{
  value: CompletedFilter;
  label: string;
  Icon: typeof ClipboardList;
}> = [
  { value: "all", label: "Все", Icon: ClipboardList },
  { value: "active", label: "Активные", Icon: Sparkles },
  { value: "done", label: "Выполненные", Icon: CalendarDays },
];

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-[#e3ddd6] bg-white px-4 py-5 shadow-[0_4px_16px_rgba(46,43,39,0.05)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a49c93]">{label}</p>
      <p className="mt-2 text-[30px] font-semibold leading-none tracking-tighter text-[#2f2b28]">{value}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  activeColor = "#2f2b28",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  activeColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active ? { background: activeColor } : undefined}
      className={clsx(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-all",
        active
          ? "border-transparent text-white"
          : "border-[#d8d2cb] bg-white text-[#2f2b28] hover:bg-[#f3efe9]"
      )}
    >
      {children}
    </button>
  );
}

export function TasksPage() {
  const [priorityF, setPriorityF] = useState<PriorityFilter>("all");
  const [completedF, setCompletedF] = useState<CompletedFilter>("all");
  const [dateF, setDateF] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const toast = useToast();

  const params = {
    priority: priorityF !== "all" ? priorityF : undefined,
    completed: completedF === "all" ? undefined : completedF === "done",
    due_date: dateF || undefined,
  };

  const { data: tasksData, isLoading } = useTasks(params);
  const tasks = Array.isArray(tasksData) ? tasksData : [];
  const create = useCreateTask();

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.completed).length;
    return { total, done, active: total - done };
  }, [tasks]);

  const handleCreate = async (data: TaskCreate | import("../types").TaskUpdate) => {
    await create.mutateAsync(data as TaskCreate);
    toast.success("Задача создана");
    setCreateOpen(false);
  };

  const activeCount = [priorityF !== "all", completedF !== "all", !!dateF].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#2e2b27]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-[#e6dfd7] bg-white/95 p-6 shadow-[0_24px_80px_rgba(46,43,39,0.12)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#9a9187]">Задачи</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#2f2b28]">Управление задачами</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e675f]">
                Удобный рабочий экран для всех задач — без лишних эффектов, только цвета и понятный интерфейс.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className={clsx(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
                  filtersOpen ? "border-[#2f2b28] bg-[#2f2b28] text-white" : "border-[#d8d2cb] bg-white text-[#2f2b28] hover:bg-[#f3efe9]"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
                {activeCount > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ef4444] px-2 text-[11px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2f2b28] px-4 text-sm font-medium text-white shadow-[0_14px_36px_rgba(46,43,39,0.18)] transition-all hover:bg-[#44403b]"
              >
                <Plus className="h-4 w-4" />
                Добавить задачу
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Всего" value={stats.total} />
            <Stat label="Активные" value={stats.active} />
            <Stat label="Готово" value={stats.done} />
          </div>

          {filtersOpen && (
            <div className="mt-6 rounded-[28px] border border-[#e3ddd6] bg-[#faf7f3] p-5 shadow-[0_12px_36px_rgba(46,43,39,0.08)]">
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.5fr_1fr]">
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#a49c93]">Приоритет</p>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITY_OPTIONS.map((option) => (
                      <FilterChip
                        key={option.value}
                        active={priorityF === option.value}
                        onClick={() => setPriorityF(option.value)}
                        activeColor={option.activeColor}
                      >
                        {option.dotColor ? (
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: priorityF === option.value ? "rgba(255,255,255,0.75)" : option.dotColor }}
                          />
                        ) : null}
                        {option.label}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#a49c93]">Статус</p>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map(({ value, label, Icon }) => {
                      const active = completedF === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setCompletedF(value)}
                          className={clsx(
                            "flex h-20 flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-[13px] font-medium transition-all",
                            active
                              ? "border-[#2f2b28] bg-[#2f2b28] text-white"
                              : "border-[#d8d2cb] bg-white text-[#5f5952] hover:bg-[#f7f4ef]"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#a49c93]">Дата</p>
                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#d8d2cb] bg-white px-4">
                    <CalendarDays className="h-4 w-4 text-[#9d958c]" />
                    <input
                      type="date"
                      value={dateF}
                      onChange={(e) => setDateF(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] text-[#2f2b28] outline-none"
                    />
                    {dateF && (
                      <button
                        type="button"
                        onClick={() => setDateF("")}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#9d958c] hover:bg-[#f1ede7]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPriorityF("all");
                    setCompletedF("all");
                    setDateF("");
                  }}
                  className="mt-5 h-11 rounded-full border border-[#d8d2cb] bg-[#f5f1eb] px-5 text-sm font-medium text-[#5f5952] transition hover:bg-[#ece7df]"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </section>

        <section className="rounded-[32px] border border-[#e6dfd7] bg-white/95 p-6 shadow-[0_24px_80px_rgba(46,43,39,0.12)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#8b8176]">
                {isLoading ? "Загрузка…" : `${stats.total} ${stats.total === 1 ? "задача" : stats.total < 5 ? "задачи" : "задач"}`}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#2f2b28]">Список задач</h2>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2f2b28] px-4 text-sm font-semibold text-white transition hover:bg-[#3d3a35]"
            >
              <Plus className="h-4 w-4" />
              Новая задача
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <TaskSkeleton key={index} />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-[28px] border border-[#e3ddd6] bg-[#faf7f3] px-6 py-14 text-center shadow-[0_18px_50px_rgba(46,43,39,0.08)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f0ec] text-[#bdb6ae]">
                  <ClipboardList className="h-8 w-8" />
                </div>
                <h3 className="text-[20px] font-semibold text-[#2f2b28]">Список пуст</h3>
                <p className="mt-2 text-[14px] text-[#7d756d]">
                  Нет задач по выбранным фильтрам. Создайте задачу или сбросьте фильтры.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
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
