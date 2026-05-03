export function InboxList({ conversations }: { conversations: any[] }) {
  return (
    <aside className="border-r bg-[#f8fafc]">
      <div className="p-3"><input className="w-full rounded-xl border px-3 py-2" placeholder="Search contacts" /></div>
      <ul className="space-y-1 px-2 pb-2">
        {conversations.map((item) => (
          <li key={item.id} className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between"><p className="font-medium">{item.name}</p><span className="text-xs text-slate-500">{item.updated_at}</span></div>
            <p className="truncate text-sm text-slate-600">{item.last_message || 'No messages yet'}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
