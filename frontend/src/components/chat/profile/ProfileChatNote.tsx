"use client";

import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { Download, MessageSquare, Save, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import ConfirmModal from "@/src/shared/ConfirmModal";

interface ProfileChatNoteProps {
  initialNote?: string;
  onSave: (note: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  notes: Array<{ id: string; note: string; created_at: string }>;
}

const ProfileChatNote = ({ initialNote = "", onSave, onDelete, isLoading, notes }: ProfileChatNoteProps) => {
  const [note, setNote] = useState(initialNote);
  const [showAll, setShowAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleSave = async () => {
    if (!note.trim()) return;
    await onSave(note);
    setNote("");
  };

  const handleDownload = () => {
    const allNotesText = notes.map((n) => `[${format(new Date(n.created_at), "yyyy-MM-dd HH:mm")}] ${n.note}`).join("\n\n");
    const element = document.createElement("a");
    const file = new Blob([allNotesText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "chat-notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      setIsDeleting(true);
      try {
        await onDelete(noteToDelete);
      } finally {
        setIsDeleting(false);
        setNoteToDelete(null);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-(--dark-body) dark:border-none border border-gray-100 dark:border-(--card-border-color) rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
          <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
            <MessageSquare size={18} />
          </div>
          <span>Chat note</span>
          <span className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500 text-emerald-500 text-[10px] font-bold">{notes.length}</span>
        </div>
        <div className="flex gap-2 justify-end w-auto ml-auto [&:has(.eye-icon)]:mt-1.25">
          {notes.length !== 0 && (
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg eye-icon border-gray-200" onClick={() => setShowAll(!showAll)} title={showAll ? "Hide notes" : "Show all notes"}>
              {showAll ? <EyeOff size={16} className="text-slate-500 " /> : <Eye size={16} className="text-slate-500" />}
            </Button>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200" onClick={handleDownload} title="Download notes">
            <Download size={16} className="text-slate-500" />
          </Button>
          <Button className="h-8 gap-2 bg-primary hover:bg-emerald-600 text-white rounded-lg px-3" onClick={handleSave} disabled={isLoading || !note.trim()}>
            <Save size={16} />
            <span className="text-xs">Save</span>
          </Button>
        </div>
      </div>

      <Textarea placeholder="Add your notes here..." className="min-h-30 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg resize-none focus-visible:ring-1 focus-visible:ring-emerald-500 text-sm" value={note} onChange={(e) => setNote(e.target.value)} />

      {showAll && notes.length > 0 && (
        <div className="pt-2 space-y-3 border-t border-gray-100 dark:border-(--card-border-color)">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-1">Recent Notes</div>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {notes?.map((item, index) => (
              <div key={index} className="group relative bg-slate-50/50 dark:bg-(--dark-sidebar) rounded-lg p-3 border border-transparent hover:border-[#16a34a6e] dark:hover:border-emerald-900/30 transition-all">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[12px] text-slate-400 dark:text-neutral-500 font-medium">{format(new Date(item.created_at), "MMM d, yyyy • h:mm a")}</span>
                  <button onClick={() => handleDeleteClick(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all" title="Delete note">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmModal isOpen={!!noteToDelete} onClose={() => setNoteToDelete(null)} onConfirm={handleConfirmDelete} isLoading={isDeleting} title="Delete Note" subtitle="Are you sure you want to delete this note? This action cannot be undone." confirmText="Delete" variant="danger" />
    </div>
  );
};

export default ProfileChatNote;
