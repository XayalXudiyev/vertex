import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <section className="flex-1 overflow-hidden bg-[#f5f6f8]">
        {children}
      </section>
    </main>
  );
}
