"use client";

import { X } from "lucide-react";
import type { ItemAnomaly } from "@/data/verticeData";

interface TrendModalProps {
  item: ItemAnomaly;
  onClose: () => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function TrendModal({ item, onClose }: TrendModalProps) {
  const w = 460;
  const h = 200;
  const padX = 28;
  const padY = 16;
  const max = Math.max(...item.trend);
  const min = Math.min(...item.trend);
  const range = max - min || 1;

  const points = item.trend.map((v, i) => {
    const x = padX + (i * (w - padX * 2)) / (item.trend.length - 1);
    const y = padY + ((max - v) / range) * (h - padY * 2);
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1][0]},${h - padY} L${points[0][0]},${h - padY} Z`;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center backdrop-blur-[2px]"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        className="w-[500px] max-w-[95vw] overflow-hidden rounded-[14px] bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="text-[15px] font-bold">{item.item}</div>
            <div className="text-[12px] text-muted-foreground">
              {item.storeName} — 7-day sales trend
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-md bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 flex gap-4">
            <div className="flex-1 rounded-lg bg-red-50 px-3.5 py-2.5">
              <div className="text-[11px] font-semibold text-muted-foreground">
                SALES DROP
              </div>
              <div className="text-[22px] font-bold text-red-500">
                {item.drop}%
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-red-50 px-3.5 py-2.5">
              <div className="text-[11px] font-semibold text-muted-foreground">
                Z-SCORE
              </div>
              <div className="text-[22px] font-bold text-red-500">
                {item.zScore}
              </div>
            </div>
          </div>

          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="7-day trend chart">
            <defs>
              <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* horizontal grid */}
            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1={padX}
                x2={w - padX}
                y1={padY + p * (h - padY * 2)}
                y2={padY + p * (h - padY * 2)}
                stroke="#f3f4f6"
                strokeDasharray="3 3"
              />
            ))}
            <path d={areaPath} fill="url(#trend-grad)" />
            <path d={linePath} stroke="#ef4444" strokeWidth={2} fill="none" />
            {points.map(([x, y], i) => (
              <circle key={DAYS[i]} cx={x} cy={y} r={3} fill="#ef4444" />
            ))}
            {DAYS.map((d, i) => {
              const x = padX + (i * (w - padX * 2)) / (DAYS.length - 1);
              return (
                <text
                  key={d}
                  x={x}
                  y={h - 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#9ca3af"
                >
                  {d}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
