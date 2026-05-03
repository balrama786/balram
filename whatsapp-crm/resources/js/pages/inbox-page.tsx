import { AppShell } from '@/components/layout/app-shell';
import { InboxList } from '@/components/inbox/inbox-list';
import { InboxDetail } from '@/components/inbox/inbox-detail';

export default function InboxPage({ conversations = [] }: { conversations: any[] }) {
  return (
    <AppShell>
      <div className="grid h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-[360px_1fr] gap-0 rounded-2xl overflow-hidden border bg-white">
        <InboxList conversations={conversations} />
        <InboxDetail />
      </div>
    </AppShell>
  );
}
