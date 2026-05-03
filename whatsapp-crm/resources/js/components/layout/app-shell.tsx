export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-semibold">Wapi CRM</h1>
      </header>
      <main className="mx-auto max-w-7xl p-2 md:p-4">{children}</main>
    </div>
  );
}
