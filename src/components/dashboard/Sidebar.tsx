"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  CheckSquare,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/anomalies", label: "Anomalies", icon: AlertTriangle },
  { href: "/buddies", label: "Basket Buddies", icon: ShoppingBag },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-full w-[220px] shrink-0 flex-col border-r"
      style={{ background: "#006700", borderColor: "#1e2230" }}
    >
      {/* Logo — navigates to / */}
      <Link
        href="/"
        className="block border-b px-5 py-5 transition-opacity hover:opacity-80"
        style={{ borderColor: "#1e2230" }}
      >
        <div className="flex items-center gap-2.5">
         
          <div>
            <div className="text-3xl font-bold tracking-wide" style={{ color: "#e7e602" }}>
              Vertex
            </div>
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="mb-0.5 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-base transition-all hover:bg-[#e7e602]/10"
              style={{
                background: isActive
                  ? "rgba(231, 230, 2, 0.15)"
                  : "transparent",
                color: isActive ? "#e7e602" : "rgba(231, 230, 2, 0.65)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon
                className="size-[18px] transition-transform group-hover:scale-110"
                style={{ opacity: isActive ? 1 : 0.8 }}
              />
              <span className="flex-1">{tab.label}</span>
              {isActive && (
                <div
                  className="ml-auto size-1.5 rounded-full"
                  style={{ background: "#e7e602" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
