"use client";

import {
  AlertTriangle,
  CheckSquare,
  Home,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react";

export type DashboardTab = "home" | "anomalies" | "buddies" | "actions";

interface SidebarProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

const TABS: { id: DashboardTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
  { id: "buddies", label: "Basket Buddies", icon: ShoppingBag },
];

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside
      className="flex h-full w-[220px] shrink-0 flex-col border-r"
      style={{ background: "#0f1117", borderColor: "#1e2230" }}
    >
      {/* Logo */}
      <div
        className="border-b px-5 py-5"
        style={{ borderColor: "#1e2230" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground tracking-tighter">
            V
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-wide text-white">
              Vértice
            </div>
            <div className="mt-px text-[10.5px] font-medium text-neutral-500">
              Retail Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3">
        <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
          Navigation
        </div>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="mb-0.5 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13.5px] transition-all"
              style={{
                background: isActive
                  ? "color-mix(in oklab, var(--primary) 14%, transparent)"
                  : "transparent",
                color: isActive ? "var(--primary)" : "#9ca3af",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon
                className="size-[18px]"
                style={{ opacity: isActive ? 1 : 0.65 }}
              />
              <span className="flex-1">{tab.label}</span>
              {isActive && (
                <span
                  className="size-1 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="border-t px-4 py-3.5"
        style={{ borderColor: "#1e2230" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-[30px] items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
            <User className="size-[14px]" />
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-medium text-neutral-200 truncate">
              Bravo Analyst
            </div>
            <div className="text-[11px] text-neutral-600 truncate">
              intelligence@bravo.az
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
