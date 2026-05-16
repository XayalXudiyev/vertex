"use client";

import { useRef, useState } from "react";
import {
  CheckSquare,
  ChevronDown,
  Check,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  type Task,
  type TaskPayload,
} from "@/store/api/tasksApi";

/* ─── Static manager list ───────────────────────────────────────── */
const MANAGERS = [
  "Anar Həsənov",
  "Leyla Məmmədova",
  "Nigar Quliyeva",
  "Rauf Əliyev",
  "Sevinc Hüseynova",
  "Tural İsmayılov",
  "Kamala Babayeva",
  "Elnur Nəsirov",
  "Zəhra Allahverdiyeva",
  "Orxan Musayev",
];

/* ─── helpers ──────────────────────────────────────────────────── */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── Manager multi-select ──────────────────────────────────────── */
interface ManagerSelectProps {
  value: string[];
  onChange: (v: string[]) => void;
  light?: boolean;
}

function ManagerSelect({ value, onChange, light }: ManagerSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function toggle(name: string) {
    onChange(
      value.includes(name) ? value.filter((m) => m !== name) : [...value, name]
    );
  }

  const bg = light ? "#f9fafb" : "#1a1f2e";
  const border = light ? "#d1d5db" : "#2a3040";
  const dropBg = light ? "#ffffff" : "#151821";
  const dropBorder = light ? "#e5e7eb" : "#1e2230";

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-[13.5px] outline-none transition-colors"
        style={{
          background: bg,
          borderColor: open ? "var(--primary)" : border,
          color: value.length ? (light ? "#111827" : "white") : "#6b7280",
          textAlign: "left",
        }}
      >
        <span>
          {value.length === 0
            ? "Select managers…"
            : `${value.length} manager${value.length > 1 ? "s" : ""} selected`}
        </span>
        <ChevronDown
          className="size-4 shrink-0 transition-transform"
          style={{ color: "#6b7280", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {open && (
        <div
          className="rounded-xl border shadow-xl"
          style={{ background: dropBg, borderColor: dropBorder }}
        >
          {MANAGERS.map((name) => {
            const sel = value.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggle(name)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] transition-colors"
                style={{
                  color: sel ? "var(--primary)" : light ? "#374151" : "#d1d5db",
                  background: sel
                    ? "color-mix(in oklab, var(--primary) 10%, transparent)"
                    : "transparent",
                }}
              >
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded border"
                  style={{
                    borderColor: sel ? "var(--primary)" : "#9ca3af",
                    background: sel ? "var(--primary)" : "transparent",
                  }}
                >
                  {sel && <Check className="size-2.5 text-white" />}
                </span>
                {name}
              </button>
            );
          })}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((m) => (
            <span
              key={m}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium"
              style={{
                background: "color-mix(in oklab, var(--primary) 12%, white)",
                color: "var(--primary)",
              }}
            >
              {m}
              <button
                type="button"
                onClick={() => toggle(m)}
                className="ml-0.5 opacity-60 hover:opacity-100"
              >
                <X className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Inline task form ──────────────────────────────────────────── */
interface TaskFormProps {
  initial?: Task;
  onSave: (payload: TaskPayload) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function TaskForm({ initial, onSave, onCancel, saving }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [managers, setManagers] = useState<string[]>(
    initial?.assignToManager ?? []
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await onSave({ title: title.trim(), description: desc.trim(), assignToManager: managers });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border p-5 shadow-sm"
      style={{ background: "#fff", borderColor: "#e5e7eb" }}
    >
      <div className="flex flex-col gap-3">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title *"
          required
          className="rounded-lg border px-3 py-2.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-primary"
          style={{ borderColor: "#d1d5db" }}
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          placeholder="Description (optional)"
          className="resize-none rounded-lg border px-3 py-2.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-primary"
          style={{ borderColor: "#d1d5db" }}
        />

        <ManagerSelect value={managers} onChange={setManagers} light />

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold text-neutral-500 transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--primary)" }}
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save
          </button>
        </div>
      </div>
    </form>
  );
}


/* ─── Task card ─────────────────────────────────────────────────── */
interface TaskCardProps {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: number) => void;
  deleting: boolean;
}

function TaskCard({ task, onEdit, onDelete, deleting }: TaskCardProps) {
  return (
    <div
      className="group relative rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[14px] font-semibold text-foreground leading-snug">
            {task.title}
          </p>
          {task.description && (
            <p className="text-[13px] text-muted-foreground leading-snug">
              {task.description}
            </p>
          )}
          {task.assignToManager.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {task.assignToManager.map((m) => (
                <span
                  key={m}
                  className="rounded-full px-2 py-0.5 text-[11.5px] font-medium"
                  style={{
                    background: "color-mix(in oklab, var(--primary) 12%, white)",
                    color: "var(--primary)",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-foreground"
          >
            <Edit2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={deleting}
            className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-neutral-400">{timeAgo(task.createdAt)}</p>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function TasksPage() {
  const { data: tasks, isLoading, isError } = useGetTasksQuery();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleCreate(payload: TaskPayload) {
    await createTask(payload).unwrap();
    setShowCreate(false);
  }

  async function handleUpdate(payload: TaskPayload) {
    if (!editingTask) return;
    await updateTask({ id: editingTask.id, body: payload }).unwrap();
    setEditingTask(null);
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await deleteTask(id).unwrap();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto px-8 py-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-foreground flex items-center gap-2">
            <CheckSquare className="size-5" style={{ color: "var(--primary)" }} />
            Tasks
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Manage and track all operational tasks
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowCreate(true); setEditingTask(null); }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          <Plus className="size-4" />
          New Task
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <TaskForm
          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
          saving={creating}
        />
      )}

      {/* State: loading */}
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2
            className="size-8 animate-spin"
            style={{ color: "var(--primary)" }}
          />
        </div>
      )}

      {/* State: error */}
      {isError && !isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-[13.5px] font-medium text-red-500">
            Could not load tasks. Check API connection.
          </p>
        </div>
      )}

      {/* Task list */}
      {tasks && !isLoading && (
        <div className="flex flex-col gap-3">
          {tasks.length === 0 && !showCreate && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <CheckSquare className="size-10 text-neutral-300" />
              <p className="text-[13.5px] text-muted-foreground">
                No tasks yet. Create one above.
              </p>
            </div>
          )}
          {tasks.map((task) =>
            editingTask?.id === task.id ? (
              <TaskForm
                key={task.id}
                initial={task}
                onSave={handleUpdate}
                onCancel={() => setEditingTask(null)}
                saving={updating}
              />
            ) : (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                deleting={deletingId === task.id}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
