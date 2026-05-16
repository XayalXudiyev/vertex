"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  AlertOctagon,
  CreditCard,
  Loader2,
  ShoppingBag,
  TrendingDown,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setCenter, setSelectedPin, setZoom } from "@/store/slices/mapSlice";
import { KPI_SUMMARY } from "@/data/verticeData";
import { KPICard } from "./KPICard";
import { StoreModal } from "./StoreModal";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import type { Venue } from "@/store/api/categoriesApi";

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

export function HomeTab() {
  const dispatch = useAppDispatch();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const { data: categoriesResponse } = useGetCategoriesQuery();

  const venues = useMemo(() => {
    return categoriesResponse?.data.flatMap((c) => c.venues) || [];
  }, [categoriesResponse]);

  const kpis: { label: string; value: string | number; icon: React.ReactNode; delta: string; variant?: "primary" | "destructive" | "warning" | "success" }[] = [
    {
      label: "Total Transactions",
      value: KPI_SUMMARY.totalTransactions,
      icon: <CreditCard className="size-5" />,
      delta: "↑ 8.2% vs last week",
      variant: "primary",
    },
    {
      label: "Basket Buddies",
      value: KPI_SUMMARY.totalBasketBuddies,
      icon: <ShoppingBag className="size-5" />,
      delta: "Active associations",
      variant: "primary",
    },
    {
      label: "Basket Anomalies",
      value: KPI_SUMMARY.totalBasketAnomalies,
      icon: <AlertOctagon className="size-5" />,
      delta: "Local < Global lift",
      variant: "destructive",
    },
    {
      label: "Item Anomalies",
      value: KPI_SUMMARY.totalItemAnomalies,
      icon: <TrendingDown className="size-5" />,
      delta: "Across all stores",
      variant: "destructive",
    },
  ];

  function handleLocationSelect(loc: Venue) {
    if (loc) {
      dispatch(setCenter([loc.latitude, loc.longitude]));
      dispatch(setZoom(14));
      dispatch(
        setSelectedPin({ lat: loc.latitude, lon: loc.longitude, label: loc.name })
      );
      setSelectedVenue(loc);
    }
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
        <LeafletMap venues={venues} onLocationSelect={handleLocationSelect} />
      </div>

      {selectedVenue != null && (
        <StoreModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          // Create task functionality disabled inside StoreModal since it is disconnected from createTask function.
        />
      )}
    </div>
  );
}
