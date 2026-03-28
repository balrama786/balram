"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useUpdateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { Attachment } from "@/src/types/components";
import { formatDate } from "@/src/utils";
import { Copy, Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
}

const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ isOpen, onClose, attachment }) => {
  const [title, setTitle] = useState(attachment?.fileName || "");
  const [updateAttachment, { isLoading }] = useUpdateAttachmentMutation();

  const handleCopyUrl = () => {
    if (attachment?.fileUrl) {
      navigator.clipboard.writeText(attachment.fileUrl);
      toast.success("URL copied to clipboard");
    }
  };

  const handleSave = async () => {
    if (!attachment) return;
    try {
      await updateAttachment({ id: attachment._id, fileName: title }).unwrap();
      toast.success("Attachment updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update attachment");
      console.error(error);
    }
  };

  if (!attachment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="md:max-w-3xl max-w-[calc(100%-2rem)] max-h-[90vh] dark:border-(--card-border-color) overflow-y-auto p-0! gap-0">
        <DialogHeader className="border-b px-3 pb-3 md:pt-2 dark:border-(--card-border-color) pt-3 flex flex-row items-center justify-between sticky top-0 bg-white dark:bg-(--card-color) z-10 w-full rounded-t-lg">
          <DialogTitle>Attachment Details</DialogTitle>
          <Button onClick={onClose} className="p-1 hover:bg-gray-100 bg-gray-100 dark:hover:bg-(--table-hover) dark:bg-transparent rounded-lg transition-colors">
            <X size={20} className="dark:text-amber-50 text-gray-400" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Preview */}
          <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-50 border-none md:border-r md:border-(--card-border-color) dark:bg-(--card-color)">
            {attachment.mimeType.startsWith("image/") ? (
              <Image src={attachment.fileUrl} alt={attachment.fileName} className="w-full max-h-100 object-contain shadow-sm" width={100} height={100} unoptimized />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <div className="text-6xl mb-2">📄</div>
                <p>{attachment.fileName}</p>
              </div>
            )}
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 p-6 space-y-6 dark:bg-(--card-color)">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-gray-500 dark:text-gray-400">Created At :</div>
              <div className="col-span-2 break-all">{formatDate(attachment.createdAt)}</div>
              <div className="text-gray-500 dark:text-gray-400">File Name :</div>
              <div className="col-span-2 break-all">{attachment.fileName}</div>
              <div className="text-gray-500 dark:text-gray-400">File Type :</div>
              <div className="col-span-2 break-all">{attachment.mimeType}</div>
              <div className="text-gray-500 dark:text-gray-400">File Size :</div>
              <div className="col-span-2">{(attachment.fileSize / 1024).toFixed(2)} KB</div>
              <div className="text-gray-500 dark:text-gray-400">Description :</div>
              <div className="col-span-2 text-gray-900 truncate">{attachment.description || "-"}</div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" className="rounded-lg" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>File URL:</Label>
                <div className="flex gap-2">
                  <Input value={attachment.fileUrl} readOnly className="bg-gray-50 rounded-lg text-gray-500" />
                  <Button variant="outline" size="icon" onClick={handleCopyUrl} className="shrink-0 text-primary border-green-200 bg-green-50 hover:bg-green-100 rounded-lg">
                    <Copy size={20} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 mt-auto">
              <Button onClick={handleSave} disabled={isLoading} className="bg-primary text-white font-semibold px-6">
                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDetailModal;
