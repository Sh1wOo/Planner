import { useState } from "react";
import { Plus, Filter, ClipboardList } from "lucide-react";
import { useTasks, useCreateTask } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskSkeleton } from "../components/ui/Skeleton";
import { Modal } from "../components/ui/Modal";
import { TaskForm } from "../components/tasks/TaskForm";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import clsx from "clsx";
import type { TaskCreate, Priority } from "../types";

type PriorityFilter = Priority | "all";
type CompletedFilter = "all" | "active" | "done";

export function TasksPage() {
  const [priorityF, setPriorityF] = useState<PriorityFilter>("all");
  const [completedF, setCompletedF] = useState<CompletedFilter>("all");
  const [dateF, setDateF] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);
  const toast = useToast();

  const params = {
    priority: priorityF !== "all" ? priorityF : undefined,
    completed: completedF === "all" ? undefined : completedF === "done",
    duedate: dateF || undefined,
  };

  const { data: tasks, isLoading } = useTasks(params);
  const create = useCreateTask();

  const handleCreate = async (data: TaskCreate) => {
    await create.mutateAsync(data);
    toast.success("Задача создана");
    setCreateOpen(false);
  };

  const priorityOptions: { value: PriorityFilter; label: string }[] = [
    { value: "all", label: "Все" },
    { value: "high", label: "🔴 Высокий" },
    { value: "medium", label: "🟡 Средний" },
    { value: "low", label: "🟢 Низкий" },
  ];

  const completedOptions: { value: CompletedFilter; label: string }[] = [
    { value: "all", label: "Все" },
    { value: "active", label: "Активные" },
    { value: "done", label: "Выполненные" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-[10px] pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#28251d]">Все задачи</h1>
          {tasks && <p className="text-sm text-[#7a7974] mt-0.5">{tasks.length} задач</p>}
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Добавить
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e2e0db] p-4 mb-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#7a7974]">
          <Filter className="w-3.5 h-3.5" /> Фильтры
        </div>

        {/* Priority filter */}
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-xl overflow-hidden border border-[#e2e0db]">
            {priorityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPriorityF(opt.value)}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  priorityF === opt.value ? "bg-[#cedcd8] text-[#0c4e54]" : "text-[#7a7974] hover:bg-[#f3f0ec]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Completed filter */}
        <div className="flex rounded-xl overflow-hidden border border-[#e2e0db] w-fit">
          {completedOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCompletedF(opt.value)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                completedF === opt.value ? "bg-[#cedcd8] text-[#0c4e54]" : "text-[#7a7974] hover:bg-[#f3f0ec]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateF}
            onChange={e => setDateF(e.target.value)}
            className="h-8 px-3 rounded-xl border border-[#e2e0db] text-xs text-[#28251d] bg-white focus:outline-none focus:ring-2 focus:ring-[#01696f]/30 focus:border-[#01696f] transition-all"
          />
          {dateF && (
            <button
              onClick={() => setDateF("")}
              className="px-3 py-1.5 text-xs text-[#7a7974] hover:text-[#28251d] rounded-xl hover:bg-[#f3f0ec] transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <TaskSkeleton key={i} />)}
        </div>
      ) : tasks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#f3f0ec] flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6 text-[#bab9b4]" />
          </div>
          <p className="text-sm font-medium text-[#28251d]">Нет задач</p>
          <p className="text-xs text-[#7a7974] mt-1">Создайте первую задачу</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks?.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новая задача">
        <TaskForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}