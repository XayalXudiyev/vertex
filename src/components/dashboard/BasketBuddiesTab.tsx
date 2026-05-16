"use client";

import { useState } from "react";
import { Sparkles, Star } from "lucide-react";
import { BASKET_BUDDIES } from "@/data/verticeData";
import { CreateTaskModal } from "./CreateTaskModal";

export function BasketBuddiesTab() {
  const golden = BASKET_BUDDIES.filter((b) => b.globalBest);
  const all = BASKET_BUDDIES;
  const [taskDesc, setTaskDesc] = useState<string | null>(null);

  function openCreateTask(description: string) {
    setTaskDesc(description);
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto px-8 py-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
          Basket Buddies
        </h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          Product association analytics — the strategy board
        </p>
      </div>

      {/* Golden Pairs */}
      <div>
        <div className="mb-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
          <Sparkles className="size-[14px]" style={{ color: "var(--primary)" }} />
          Golden Pairs
        </div>
        <div className="flex gap-3.5">
          {golden.map((b, i) => (
            <div
              key={b.id}
              className="vertice-fade-up flex-1 rounded-xl border p-[18px] transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                animationDelay: `${i * 70}ms`,
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--primary) 8%, white), color-mix(in oklab, var(--primary) 18%, white))",
                borderColor: "color-mix(in oklab, var(--primary) 25%, transparent)",
              }}
            >
              <div className="mb-2.5 text-[17px] font-bold leading-snug text-foreground">
                {b.pair}
              </div>
              <div className="flex gap-2.5">
                <div className="flex-1 rounded-md bg-white/70 px-2.5 py-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Lift
                  </div>
                  <div
                    className="text-[20px] font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {b.lift}
                  </div>
                </div>
                <div className="flex-1 rounded-md bg-white/70 px-2.5 py-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Leverage
                  </div>
                  <div
                    className="text-[20px] font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {b.leverage}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-[11.5px] text-muted-foreground">
                {b.transactions.toLocaleString()} transactions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Association Matrix */}
      <div>
        <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
          Association Matrix
        </div>
        <div className="overflow-auto rounded-[10px] border bg-card">
          <table className="vertice-table w-full">
            <thead>
              <tr>
                <th>Basket Pair</th>
                <th>Transactions</th>
                <th>Support</th>
                <th>Lift</th>
                <th>Leverage</th>
                <th>Conviction</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {all.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {row.globalBest && (
                        <Star
                          className="size-3 fill-current"
                          style={{ color: "var(--primary)" }}
                        />
                      )}
                      <span style={{ fontWeight: row.globalBest ? 600 : 400 }}>
                        {row.pair}
                      </span>
                    </div>
                  </td>
                  <td>{row.transactions.toLocaleString()}</td>
                  <td>{(row.support * 100).toFixed(1)}%</td>
                  <td>
                    <span className="vertice-tag vertice-tag-green">{row.lift}</span>
                  </td>
                  <td>{row.leverage}</td>
                  <td>{row.conviction}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        openCreateTask(
                          `Create Task: ${row.pair} — Lift ${row.lift}, Leverage ${row.leverage}`
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
        </div>
      </div>
      {taskDesc !== null && (
        <CreateTaskModal
          defaultDescription={taskDesc}
          onClose={() => setTaskDesc(null)}
        />
      )}
    </div>
  );
}
