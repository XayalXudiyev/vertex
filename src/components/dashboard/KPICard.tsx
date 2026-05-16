"use client";

import type { ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  delta?: string;
  delayMs?: number;
}

export function KPICard({ label, value, icon, delta, delayMs = 0 }: KPICardProps) {
  const display = typeof value === "number" ? value.toLocaleString() : value;
  return (
    <div
      className="vertice-fade-up relative flex-1 overflow-hidden rounded-[10px] border bg-card px-5 py-[18px]"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-[10px]"
        style={{ background: "var(--primary)" }}
      />
      <div className="pl-1">
        <div className="flex items-start justify-between">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            {label}
          </div>
          <div className="opacity-70" style={{ color: "var(--primary)" }}>
            {icon}
          </div>
        </div>
        <div className="mt-1.5 text-[28px] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {display}
        </div>
        {delta && (
          <div className="mt-1 text-[11.5px] text-muted-foreground">{delta}</div>
        )}
      </div>
    </div>
  );
}
