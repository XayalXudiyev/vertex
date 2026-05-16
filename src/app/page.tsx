"use client";

import { useState } from "react";
import { Sidebar, type DashboardTab } from "@/components/dashboard/Sidebar";
import { HomeTab } from "@/components/dashboard/HomeTab";
import { AnomaliesTab } from "@/components/dashboard/AnomaliesTab";
import { BasketBuddiesTab } from "@/components/dashboard/BasketBuddiesTab";
import { ActionsTab } from "@/components/dashboard/ActionsTab";

export default function Home() {
  const [active, setActive] = useState<DashboardTab>("home");
  const switchToActions = () => setActive("actions");

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar active={active} onChange={setActive} />
      <section className="flex-1 overflow-hidden bg-[#f5f6f8]">
        {active === "home" && <HomeTab onSwitchToActions={switchToActions} />}
        {active === "anomalies" && (
          <AnomaliesTab onSwitchToActions={switchToActions} />
        )}
        {active === "buddies" && (
          <BasketBuddiesTab onSwitchToActions={switchToActions} />
        )}
        {active === "actions" && <ActionsTab />}
      </section>
    </main>
  );
}
