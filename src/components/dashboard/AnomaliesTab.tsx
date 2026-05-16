"use client";

import { useMemo, useState } from "react";
import { Activity, ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addTask } from "@/store/slices/tasksSlice";
import {
  BASKET_ANOMALIES,
  ITEM_ANOMALIES,
  STORES,
  type ItemAnomaly,
} from "@/data/verticeData";
import { TrendModal } from "./TrendModal";

type SubTab = "basket" | "item";

interface AnomaliesTabProps {
  onSwitchToActions: () => void;
}

export function AnomaliesTab({ onSwitchToActions }: AnomaliesTabProps) {
  const dispatch = useAppDispatch();
  const [subTab, setSubTab] = useState<SubTab>("basket");
  const [storeFilter, setStoreFilter] = useState<string>("All");
  const [trendItem, setTrendItem] = useState<ItemAnomaly | null>(null);

  const storeNames = useMemo(
    () => ["All", ...STORES.map((s) => s.name)],
    []
  );

  const filteredBasket = useMemo(
    () =>
      storeFilter === "All"
        ? BASKET_ANOMALIES
        : BASKET_ANOMALIES.filter((b) => b.storeName === storeFilter),
    [storeFilter]
  );

  const filteredItem = useMemo(
    () =>
      storeFilter === "All"
        ? ITEM_ANOMALIES
        : ITEM_ANOMALIES.filter((i) => i.storeName === storeFilter),
    [storeFilter]
  );

  function createTask(description: string) {
    const title =
      description.length > 60 ? `${description.substring(0, 60)}…` : description;
    dispatch(addTask({ title, description }));
    onSwitchToActions();
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-auto px-8 py-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
          Anomalies
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Real-time anomaly detection across all stores
        </p>
      </div>

      {/* Sub-nav + Filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 rounded-lg bg-muted p-[3px]">
          {[
            { id: "basket", label: "Basket-Level" } as const,
            { id: "item", label: "Item-Level" } as const,
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className="rounded-md px-[18px] py-[7px] text-[13px] font-semibold transition-all"
              style={{
                background: subTab === t.id ? "var(--card)" : "transparent",
                color: subTab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow:
                  subTab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-medium text-muted-foreground">
            Filter by store
          </span>
          <div className="relative">
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="appearance-none rounded-md border bg-card py-[7px] pl-2.5 pr-7 text-[13px] text-foreground"
            >
              {storeNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Tables */}
      <div
        key={subTab}
        className="vertice-fade-in flex-1 overflow-hidden rounded-[10px] border bg-card"
      >
        {subTab === "basket" ? (
          <table className="vertice-table w-full">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Basket Pair</th>
                <th>Global Lift</th>
                <th>Local Lift</th>
                <th>Gap</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBasket.map((row) => {
                const gapPct = (
                  ((row.globalLift - row.localLift) / row.globalLift) *
                  100
                ).toFixed(0);
                return (
                  <tr key={row.id}>
                    <td>
                      <span className="font-semibold text-foreground">
                        {row.storeName}
                      </span>
                    </td>
                    <td>{row.pair}</td>
                    <td>
                      <span className="vertice-tag vertice-tag-green">
                        {row.globalLift}
                      </span>
                    </td>
                    <td>
                      <span className="vertice-tag vertice-tag-red">
                        {row.localLift}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-20 overflow-hidden rounded bg-red-100">
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${gapPct}%` }}
                          />
                        </div>
                        <span className="text-[11.5px] font-semibold text-red-500">
                          -{gapPct}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          createTask(
                            `Basket anomaly: ${row.pair} at ${row.storeName} — Local lift ${row.localLift} vs Global ${row.globalLift}`
                          )
                        }
                        className="rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        Create Task
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="vertice-table w-full">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Item Name</th>
                <th>% Sales Drop</th>
                <th>Z-Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItem.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="font-semibold text-foreground">
                      {row.storeName}
                    </span>
                  </td>
                  <td>{row.item}</td>
                  <td>
                    <span className="vertice-tag vertice-tag-red">
                      {row.drop}%
                    </span>
                  </td>
                  <td className="font-semibold text-red-500">{row.zScore}</td>
                  
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        createTask(
                          `Item anomaly: ${row.item} at ${row.storeName} — ${row.drop}% sales drop`
                        )
                      }
                      className="rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Create Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {trendItem && (
        <TrendModal item={trendItem} onClose={() => setTrendItem(null)} />
      )}
    </div>
  );
}
