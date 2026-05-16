"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CreditCard,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addTask } from "@/store/slices/tasksSlice";
import { setCenter, setSelectedPin, setZoom } from "@/store/slices/mapSlice";
import type { MockLocation } from "@/data/mockLocations";
import { KPI_SUMMARY, STORES } from "@/data/verticeData";
import { KPICard } from "./KPICard";
import { StoreModal } from "./StoreModal";

const LeafletMap = dynamic(
  () => import("@/components/map/LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-[10px] bg-muted">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface HomeTabProps {
  onSwitchToActions: () => void;
}

export function HomeTab({ onSwitchToActions }: HomeTabProps) {
  const dispatch = useAppDispatch();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const kpis = [
    {
      label: "Total Transactions",
      value: KPI_SUMMARY.totalTransactions,
      icon: <CreditCard className="size-5" />,
      delta: "↑ 8.2% vs last week",
    },
    {
      label: "Basket Buddies",
      value: KPI_SUMMARY.totalBasketBuddies,
      icon: <ShoppingBag className="size-5" />,
      delta: "Active associations",
    },
    {
      label: "Basket Anomalies",
      value: KPI_SUMMARY.totalBasketAnomalies,
      icon: <AlertTriangle className="size-5" />,
      delta: "Local < Global lift",
    },
    {
      label: "Item Anomalies",
      value: KPI_SUMMARY.totalItemAnomalies,
      icon: <Activity className="size-5" />,
      delta: "Across all stores",
    },
  ];

  function handleLocationSelect(loc: MockLocation) {
    if (loc.storeId) {
      // Fly camera to store, but also surface the analytics modal.
      const store = STORES.find((s) => s.id === loc.storeId);
      if (store) {
        dispatch(setCenter([store.lat, store.lng]));
        dispatch(setZoom(14));
        dispatch(
          setSelectedPin({ lat: store.lat, lon: store.lng, label: store.name })
        );
      }
      setSelectedStoreId(loc.storeId);
    }
  }

  function createTask(description: string) {
    const title =
      description.length > 60 ? `${description.substring(0, 60)}…` : description;
    dispatch(addTask({ title, description }));
    onSwitchToActions();
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto px-8 py-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
          The Geospatial Pulse
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Network-wide retail intelligence — May 3, 2026
        </p>
      </div>

      <div className="flex gap-4">
        {kpis.map((k, i) => (
          <KPICard key={k.label} {...k} delayMs={i * 60} />
        ))}
      </div>

      <div className="min-h-[420px] flex-1 overflow-hidden rounded-[10px] border bg-card">
        <LeafletMap onLocationSelect={handleLocationSelect} />
      </div>

      {selectedStoreId != null && (
        <StoreModal
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
          onCreateTask={createTask}
        />
      )}
    </div>
  );
}
