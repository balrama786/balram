export function InboxDetail() {
  return (
    <section className="hidden md:flex flex-col bg-[url('/img/pattern.png')] bg-repeat">
      <div className="border-b bg-white px-4 py-3 font-medium">Conversation</div>
      <div className="flex-1 p-4">Select a contact to start.</div>
      <div className="border-t bg-white p-3"><input className="w-full rounded-xl border px-3 py-2" placeholder="Type a message" /></div>
    </section>
  );
}
