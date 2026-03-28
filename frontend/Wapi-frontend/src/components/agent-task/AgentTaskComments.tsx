/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useAddAgentTaskCommentMutation, useDeleteAgentTaskCommentMutation, useUpdateAgentTaskCommentMutation } from "@/src/redux/api/agentTaskApi";
import { useAppSelector } from "@/src/redux/hooks";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { AgentTaskComment } from "@/src/types/agentTask";
import { formatDate } from "@/src/utils";
import { Check, Edit2, Send, Trash2, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AgentTaskCommentsProps {
  taskId: string;
  comments: AgentTaskComment[];
}

const AgentTaskComments = ({ taskId, comments }: AgentTaskCommentsProps) => {
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; commentId: string | null }>({
    isOpen: false,
    commentId: null,
  });

  const [addComment, { isLoading: isAdding }] = useAddAgentTaskCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateAgentTaskCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteAgentTaskCommentMutation();
  const { user } = useAppSelector((state) => state.auth);

  const handleSend = async () => {
    if (!commentText.trim() || isAdding) return;

    try {
      await addComment({ id: taskId, comment: commentText }).unwrap();
      setCommentText("");
      toast.success("Comment added");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add comment");
    }
  };

  const handleUpdate = async (commentId: string) => {
    if (!editValue.trim() || isUpdating) return;
    try {
      await updateComment({ id: taskId, commentId, comment: editValue }).unwrap();
      setEditingId(null);
      toast.success("Comment updated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update comment");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.commentId || isDeleting) return;
    try {
      await deleteComment({ id: taskId, commentId: deleteModal.commentId }).unwrap();
      setDeleteModal({ isOpen: false, commentId: null });
      toast.success("Comment deleted");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete comment");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col max-h-142.5 h-full relative">
      <div className="flex-1 overflow-y-auto p-8 pb-4 space-y-6 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-30 grayscale">
            <UserIcon size={32} className="mb-3" />
            <p className="text-sm font-bold tracking-widest">No dialogue yet</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwnComment = comment.commented_by?._id === user?.id;
            return (
              <div key={comment._id} className={`flex gap-4 group animate-in duration-300 ${isOwnComment ? "flex-row-reverse slide-in-from-right-2" : "flex-row slide-in-from-left-2"}`}>
                <div className={`h-10 w-10 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary/40 shrink-0 mt-0.5 group-hover:text-primary group-hover:border-primary/20 dark:bg-(--page-body-bg) dark:border-none transition-all ${isOwnComment ? "ml-4 rtl:ml-0 rtl:mr-4" : "mr-4"}`}>
                  <UserIcon size={20} />
                </div>
                <div className={`flex flex-col flex-1 max-w-[80%] space-y-1 relative ${isOwnComment ? "items-end" : "items-start"}`}>
                  <div className={`flex items-center gap-2 w-full ${isOwnComment ? "flex-row-reverse pr-2" : "flex-row pl-2"}`}>
                    <span className="font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">{comment.commented_by?.name || "Member"}</span>
                    {isOwnComment && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditValue(comment.comment);
                          }}
                        >
                          <Edit2 size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg" onClick={() => setDeleteModal({ isOpen: true, commentId: comment._id })}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {editingId === comment._id ? (
                    <div className="space-y-2 mt-1 w-full">
                      <Input className="h-9 text-sm font-medium border-primary/20 focus:ring-primary/10 rounded-lg" value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold gap-1 rounded-lg dark:bg-(--page-body-bg)" onClick={() => setEditingId(null)}>
                          <X size={12} /> Cancel
                        </Button>
                        <Button size="sm" className="h-7 px-3 text-xs font-bold gap-1 rounded-lg bg-primary text-white" onClick={() => handleUpdate(comment._id)} disabled={isUpdating}>
                          {isUpdating ? (
                            "..."
                          ) : (
                            <>
                              <Check size={12} /> Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-3 bg-white dark:bg-(--page-body-bg) border border-slate-100 dark:border-none shadow-sm group-hover:shadow-md transition-all ${isOwnComment ? "rounded-lg rounded-tr-none text-right" : "rounded-lg rounded-tl-none text-left"}`}>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold wrap-break-word break-all">{comment.comment}</p>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest pt-1">{formatDate(comment.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-3 bg-white/50 dark:bg-(--card-color) border-t dark:border-(--card-border-color) border-slate-50">
        <div className="bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-none rounded-lg flex items-center gap-3 p-2 transition-all focus-within:ring-2 focus-within:ring-primary/5">
          <Input placeholder="Write a message or upload update..." className="border-none bg-transparent focus-visible:ring-0 text-slate-700 dark:border-(--card-border-color) dark:text-slate-200 h-8 px-4 font-medium text-sm" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={handleKeyDown} />
          <div className="flex items-center gap-2 pr-1">
            <Button className="bg-primary hover:bg-primary/90 text-white h-9 w-9 rounded-lg p-0 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50" disabled={!commentText.trim() || isAdding} onClick={handleSend}>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, commentId: null })} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Comment" subtitle="Are you sure you want to delete this comment? This action cannot be undone." />
    </div>
  );
};

export default AgentTaskComments;
