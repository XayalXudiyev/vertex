"use client";

import { useState } from "react";
import { MessageSquare, Plus, Trash2, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addComment as addCommentAction,
  addTask,
  deleteTask,
  type DashboardTask,
} from "@/store/slices/tasksSlice";

const PEOPLE = ["Anar M.", "Leyla R.", "Farid H.", "Nigar B.", "Tural K.", "Sara A."];

export function ActionsTab() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tagged, setTagged] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  function submit() {
    if (!title.trim()) return;
    dispatch(addTask({ title: title.trim(), description: desc.trim(), tags: tagged }));
    setTitle("");
    setDesc("");
    setTagged([]);
    setShowForm(false);
  }

  function toggleTag(name: string) {
    setTagged((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-auto px-8 py-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
            Action Inbox
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} pending
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-[14px]" />
          New Task
        </button>
      </div>

      {/* New task form */}
      {showForm && (
        <div
          className="vertice-fade-up rounded-xl border bg-card p-5 shadow-sm"
          style={{
            borderLeft: "3px solid var(--primary)",
            boxShadow: "0 4px 16px color-mix(in oklab, var(--primary) 10%, transparent)",
          }}
        >
          <div className="mb-3 text-[13px] font-semibold text-foreground">
            New Task
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title…"
            className="mb-2.5 w-full rounded-md border bg-background px-3 py-2 text-[13.5px] outline-none focus:border-primary"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)…"
            rows={2}
            className="mb-3 w-full resize-y rounded-md border bg-background px-3 py-2 text-[13px] outline-none focus:border-primary"
          />
          <div className="mb-3">
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">
              Tag People
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PEOPLE.map((p) => {
                const isTagged = tagged.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleTag(p)}
                    className="rounded-md border px-2.5 py-1 text-[12px] transition-colors"
                    style={{
                      borderColor: isTagged ? "var(--primary)" : "var(--border)",
                      background: isTagged
                        ? "color-mix(in oklab, var(--primary) 14%, transparent)"
                        : "var(--muted)",
                      color: isTagged ? "var(--primary)" : "var(--foreground)",
                      fontWeight: isTagged ? 600 : 400,
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              className="rounded-md bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border bg-transparent px-4 py-2 text-[13px] text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="flex flex-col gap-2.5">
        {tasks.length === 0 && (
          <div className="rounded-[10px] border border-dashed bg-card px-5 py-12 text-center text-muted-foreground">
            <div className="mb-2 text-[32px]">📋</div>
            <div className="font-semibold">No tasks yet</div>
            <div className="mt-1 text-[13px]">
              Create tasks from Anomalies or Basket Buddies tabs
            </div>
          </div>
        )}
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onDelete={() => dispatch(deleteTask(t.id))}
            onAddComment={(c) =>
              dispatch(addCommentAction({ id: t.id, comment: c }))
            }
          />
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: DashboardTask;
  onDelete: () => void;
  onAddComment: (comment: string) => void;
}

function TaskCard({ task, onDelete, onAddComment }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");

  function submit() {
    if (comment.trim()) {
      onAddComment(comment.trim());
      setComment("");
    }
  }

  return (
    <div
      className="rounded-[10px] border bg-card px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderLeft: "3px solid var(--primary)" }}
    >
      <div className="flex items-start gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-foreground">
            {task.title}
          </div>
          {task.description && (
            <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
              {task.description}
            </div>
          )}
          {task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                >
                  <User
                    className="size-[11px]"
                    style={{ color: "var(--primary)" }}
                  />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 rounded-md border bg-transparent px-2 py-1 text-[11.5px] text-muted-foreground hover:bg-muted"
          >
            <MessageSquare className="size-[13px]" />
            {task.comments.length}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md p-1.5 text-neutral-300 hover:bg-muted hover:text-red-500"
            aria-label="Delete task"
          >
            <Trash2 className="size-[13px]" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 border-t pt-3">
          {task.comments.map((c, i) => (
            <div
              key={`${task.id}-c-${i}`}
              className="mb-1.5 rounded-md bg-muted px-2.5 py-1.5 text-[12.5px] leading-relaxed text-foreground"
            >
              💬 {c}
            </div>
          ))}
          <div className="mt-1.5 flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a comment…"
              className="flex-1 rounded-md border bg-background px-2.5 py-1.5 text-[12.5px] outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={submit}
              className="rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90"
            >
              Post
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 text-[11px] text-neutral-400">{task.createdAt}</div>
    </div>
  );
}
