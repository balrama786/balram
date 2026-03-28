/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import ProfileChatLabel from "./ProfileChatLabel";
import { useAppSelector } from "@/src/redux/hooks";
import { getInitials } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";

interface ProfileContactSummaryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileData: any;
  onDelete: () => void;
  onOpenTagModal: () => void;
  onRemoveLabel: (id: string) => void;
}

const ProfileContactSummary = ({ profileData, onDelete, onOpenTagModal, onRemoveLabel }: ProfileContactSummaryProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { app_name, is_demo_mode } = useAppSelector((state) => state.setting);

  const isAgent = user?.role === "agent";

  return (
    <div className="relative bg-white dark:bg-(--dark-body) border dark:border-none border-gray-100 dark:border-(--card-border-color) rounded-lg p-5 flex items-center justify-center flex-col">
      <div className="h-12 w-12 shrink-0 mb-4 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl overflow-hidden">{profileData?.contact?.avatar ? <Image src={profileData?.contact?.avatar} alt={profileData?.contact?.name} width={64} height={64} className="object-cover" unoptimized /> : getInitials(app_name || "")}</div>
      <h3 className="font-bold text-slate-900 dark:text-white truncate">{isAgent && user?.is_phoneno_hide ? "Customer" : maskSensitiveData(profileData?.contact?.phone_number, "phone", is_demo_mode)}</h3>
      <p className="text-sm text-slate-500 dark:text-gray-500 truncate">{profileData?.contact?.status}</p>
      {!isAgent && (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-50 dark:bg-rose-400/30 dark:hover:bg-rose-500/10 rounded-lg" onClick={onDelete}>
          <Trash2 size={20} />
        </Button>
      )}
      <ProfileChatLabel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labels={profileData?.tags?.map((t: any) => ({ id: t._id, name: t.label, color: t.color })) || []}
        onOpenModal={onOpenTagModal}
        onRemoveLabel={onRemoveLabel}
      />
    </div>
  );
};

export default ProfileContactSummary;
