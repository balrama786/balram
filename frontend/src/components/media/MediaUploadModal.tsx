"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { useCreateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { CloudUpload, Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner"; // Assuming sonner is the toast library used

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [createAttachment, { isLoading }] = useCreateAttachmentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("attachments", selectedFile);
      }
      await createAttachment(formData).unwrap();
      toast.success("File uploaded successfully");
      handleRemoveFile(); // Clear file after success
      onClose();
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    }
  };

  // Clean up object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-(--card-color)">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Upload Files</DialogTitle>
          <Button
            onClick={() => {
              onClose();
              handleRemoveFile();
            }}
            className="p-1 hover:bg-gray-100 bg-gray-50 dark:bg-transparent dark:hover:bg-(--table-hover) rounded-lg transition-colors absolute right-4 top-4"
          >
            <X size={20} className="dark:text-amber-50 text-slate-500" />
          </Button>
        </DialogHeader>

        <p className="text-sm text-gray-500 mb-4">Upload files to here to quickly access into your app.</p>

        {!selectedFile ? (
          <div className="border border-dashed border-gray-300 dark:border-(--card-border-color) dark:hover:bg-(--table-hover) rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className="bg-(--light-primary) dark:bg-(--dark-body) text-primary overflow-hidden w-20 h-20 rounded-lg mb-4 flex items-center justify-center">
              <CloudUpload size={48} className="text-primary" />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Drag & Drop</h3>
            <p className="text-xs text-gray-400 text-center mt-1">Max size: video: 15.00 MB, image: 5.00 MB, document: 10.00 MB, audio: 10.00 MB</p>
            <p className="text-sm text-gray-500 my-2">OR</p>
            <p className="text-sm text-gray-600 font-medium text-center dark:text-gray-400">Click anywhere inside the dashed box to browse files</p>

            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.json,.rar,.7z" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-2 bg-gray-50 dark:bg-(--table-hover)">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden shrink-0">{previewUrl && selectedFile.type.startsWith("image/") ? <Image src={previewUrl} alt="Preview" className="w-full h-full object-cover" width={100} height={100} unoptimized /> : <div className="w-full h-full flex items-center justify-center text-gray-500">File</div>}</div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium line-clamp-1">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
              <button onClick={handleRemoveFile} className="text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <Button className="bg-primary text-white w-full" onClick={handleUpload} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
