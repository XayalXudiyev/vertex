"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronDown, Loader2, CheckCircle2, Check } from "lucide-react";
import { useCreateTaskMutation } from "@/store/api/tasksApi";
import type { TaskPayload } from "@/store/api/tasksApi";

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

/** Extract a concise title from the pre-filled description.
 *  e.g. "Basket anomaly: Milk + Bread at Store 3 — Local lift …"
 *    → "Basket anomaly: Milk + Bread at Store 3"
 */
function titleFromDescription(desc: string): string {
  const beforeDash = desc.split(" — ")[0].trim();
  return beforeDash.length > 80 ? beforeDash.substring(0, 80) + "…" : beforeDash;
}

interface CreateTaskModalProps {
  /** Pre-filled description coming from anomaly/buddy rows */
  defaultDescription?: string;
  onClose: () => void;
}

export function CreateTaskModal({
  defaultDescription = "",
  onClose,
}: CreateTaskModalProps) {
  const autoTitle = defaultDescription ? titleFromDescription(defaultDescription) : "";

  const [title, setTitle] = useState(autoTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [managers, setManagers] = useState<string[]>([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const titleRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dropOpen) { setDropOpen(false); return; }
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, dropOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropOpen]);

  function toggleManager(name: string) {
    setManagers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: TaskPayload = {
      title: title.trim(),
      description: description.trim(),
      assignToManager: managers,
    };

    try {
      await createTask(payload).unwrap();
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch {
      // silent
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50  flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[480px] max-h-[calc(100vh-100px)]  rounded-2xl border shadow-2xl"
        style={{ background: "#0f1117", borderColor: "#1e2230" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "#1e2230" }}
        >
          <h2 className="text-[16px] font-bold text-white">New Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12">
            <CheckCircle2 className="size-12" style={{ color: "var(--primary)" }} />
            <p className="text-[15px] font-semibold text-white">Task created!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
                Title <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Investigate sales drop at Store 3"
                required
                className="rounded-lg border px-3 py-2.5 text-[13.5px] outline-none transition-colors focus:border-primary"
                style={{ background: "#1a1f2e", borderColor: "#2a3040", color: "white" }}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide more context..."
                className="resize-none rounded-lg border px-3 py-2.5 text-[13.5px] outline-none transition-colors focus:border-primary"
                style={{ background: "#1a1f2e", borderColor: "#2a3040", color: "white" }}
              />
            </div>

            {/* Assign to Manager — multi-select dropdown */}
            <div className="flex flex-col gap-1.5" ref={dropRef}>
              <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
                Assign to Manager
              </label>

              {/* Trigger */}
              <button
                type="button"
                onClick={() => setDropOpen((o) => !o)}
                className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-[13.5px] outline-none transition-colors"
                style={{
                  background: "#1a1f2e",
                  borderColor: dropOpen ? "var(--primary)" : "#2a3040",
                  color: managers.length ? "white" : "#6b7280",
                  textAlign: "left",
                }}
              >
                <span>
                  {managers.length === 0
                    ? "Select managers…"
                    : `${managers.length} manager${managers.length > 1 ? "s" : ""} selected`}
                </span>
                <ChevronDown
                  className="size-4 shrink-0 transition-transform"
                  style={{
                    color: "#6b7280",
                    transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Dropdown list */}
              {dropOpen && (
                <div
                  className="rounded-xl border shadow-xl overflow-auto h-[100px]"
                  style={{ background: "#151821", borderColor: "#1e2230" }}
                >
                  {MANAGERS.map((name) => {
                    const selected = managers.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleManager(name)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] transition-colors"
                        style={{
                          color: selected ? "var(--primary)" : "#d1d5db",
                          background: selected
                            ? "color-mix(in oklab, var(--primary) 10%, transparent)"
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!selected)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "#1e2230";
                        }}
                        onMouseLeave={(e) => {
                          if (!selected)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "transparent";
                        }}
                      >
                        <span
                          className="flex size-4 shrink-0 items-center justify-center rounded border"
                          style={{
                            borderColor: selected ? "var(--primary)" : "#3a4050",
                            background: selected ? "var(--primary)" : "transparent",
                          }}
                        >
                          {selected && <Check className="size-2.5 text-white" />}
                        </span>
                        {name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected tags */}
              {managers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {managers.map((m) => (
                    <span
                      key={m}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium"
                      style={{
                        background: "color-mix(in oklab, var(--primary) 14%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      {m}
                      <button
                        type="button"
                        onClick={() => toggleManager(m)}
                        className="ml-0.5 opacity-60 hover:opacity-100"
                      >
                        <X className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex justify-end gap-2 border-t pt-4"
              style={{ borderColor: "#1e2230" }}
            >
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-neutral-400 transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="flex items-center gap-2 rounded-lg px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--primary)" }}
              >
                {isLoading && <Loader2 className="size-3.5 animate-spin" />}
                Create Task
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
