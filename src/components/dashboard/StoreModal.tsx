"use client";

import { AlertTriangle, MapPin, TrendingDown, X } from "lucide-react";
import type { Venue } from "@/store/api/categoriesApi";

interface StoreModalProps {
  venue: Venue;
  onClose: () => void;
  onCreateTask?: (description: string) => void;
}

export function StoreModal({ venue, onClose, onCreateTask }: StoreModalProps) {
  if (!venue) return null;

  return (
    <div
      className="vertice-modal-overlay fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-[2px]"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-[780px] max-w-[95vw] flex-col overflow-hidden rounded-[14px] bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-[18px]"
          style={{
            background: "linear-gradient(135deg, #0f1117 0%, #1a2030 100%)",
            borderColor: "#1e2230",
          }}
        >
          <div className="flex items-center gap-2.5">
            <MapPin className="size-[14px]" style={{ color: "var(--primary)" }} />
            <div>
              <div className="text-base font-bold text-white">{venue.name}</div>
              <div className="text-[11.5px] text-neutral-500">
                Store Intelligence Report
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-auto">
          {/* Left: Basket Anomalies */}
          <div className="flex-1 border-r px-5 py-5">
            <div className="mb-3.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-neutral-700">
              <AlertTriangle className="size-[14px] text-amber-500" />
              Basket Anomalies
            </div>
            <div className="flex flex-col gap-2">
              {venue.basketBodyInfo.length === 0 && (
                <div className="text-sm text-neutral-500">No anomalies found.</div>
              )}
              {venue.basketBodyInfo.slice(0, 5).map((b) => {
                const dropPct = ((1 - b.local / b.global) * 100).toFixed(0);
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">
                        {b.name}
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                        Global: <b>{b.global}</b> &nbsp;|&nbsp; Local:{" "}
                        <b className="text-red-500">{b.local}</b>
                      </div>
                    </div>
                    <span className="vertice-tag vertice-tag-red">↓ {dropPct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sales Drops */}
          <div className="flex-1 px-5 py-5">
            <div className="mb-3.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-neutral-700">
              <TrendingDown className="size-[14px] text-red-500" />
              Sales Drops
            </div>
            <div className="flex flex-col gap-2">
              {venue.itemInfo.length === 0 && (
                <div className="text-sm text-neutral-500">No items found.</div>
              )}
              {venue.itemInfo.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                >
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {item.name}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                      Z-score: <b className="text-red-500">{item.score.toFixed(2)}</b>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="vertice-tag vertice-tag-red">{item.percent}%</span>
                    <button
                      type="button"
                      onClick={() => {
                        onCreateTask?.(
                          `Sales drop: ${item.name} at ${venue.name} (${item.percent}%)`
                        );
                        onClose();
                      }}
                      className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground transition-colors hover:opacity-90"
                    >
                      Create Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
