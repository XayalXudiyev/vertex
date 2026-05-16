"use client";

import type { ReactNode } from "react";

export type KPICardVariant = "primary" | "destructive" | "warning" | "success";

interface KPICardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  delta?: string;
  delayMs?: number;
  variant?: KPICardVariant;
}

export function KPICard({ label, value, icon, delta, delayMs = 0, variant = "primary" }: KPICardProps) {
  const display = typeof value === "number" ? value.toLocaleString() : value;
  
  const colors: Record<KPICardVariant, string> = {
    primary: "var(--primary)",
    destructive: "#ef4444",
    warning: "#f59e0b",
    success: "#10b981",
  };
  
  const color = colors[variant];

  return (
    <div
      className={`vertice-fade-up relative flex-1 overflow-hidden rounded-[10px] border px-5 py-[18px] transition-all duration-300 hover:shadow-md ${
        variant === "destructive" 
          ? "border-red-100 bg-red-50/40 dark:border-red-900/30 dark:bg-red-950/10" 
          : "border-border bg-card"
      }`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-[10px]"
        style={{ background: color }}
      />
      <div className="pl-1">
        <div className="flex items-start justify-between">
          <div className={`text-[11.5px] font-bold uppercase tracking-[0.06em] ${
            variant === "destructive" ? "text-red-600/80 dark:text-red-400/80" : "text-muted-foreground"
          }`}>
            {label}
          </div>
          <div className="opacity-90 transition-transform duration-300 hover:scale-110" style={{ color }}>
            {icon}
          </div>
        </div>
        <div className={`mt-1.5 text-[28px] font-bold leading-tight tracking-[-0.02em] ${
          variant === "destructive" ? "text-red-600 dark:text-red-400" : "text-foreground"
        }`}>
          {display}
        </div>
        {delta && (
          <div className={`mt-1 text-[11.5px] font-medium ${
            variant === "destructive" ? "text-red-500/70" : "text-muted-foreground"
          }`}>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
