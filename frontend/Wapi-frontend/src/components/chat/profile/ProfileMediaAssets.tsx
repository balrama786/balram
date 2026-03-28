/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppDispatch } from "@/src/redux/hooks";
import { openPreview } from "@/src/redux/reducers/previewSlice";
import { FileText, ImageIcon, MapPin, Maximize2, Mic, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type MediaType = "images" | "videos" | "audios" | "documents" | "locations";

interface MediaItem {
  id: string;
  fileUrl: string;
  messageType: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface MediaWeekGroup {
  week: string;
  images?: MediaItem[];
  videos?: MediaItem[];
  audios?: MediaItem[];
  documents?: MediaItem[];
  locations?: MediaItem[];
}

interface ProfileMediaAssetsProps {
  media: Record<string, MediaWeekGroup>;
}

const ProfileMediaAssets = ({ media }: ProfileMediaAssetsProps) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<MediaType>("images");

  const handleImageClick = (imageUrl: string) => {
    // Collect all image URLs from all weeks to allow navigation
    const allImages = Object.values(media || {})
      .flatMap((week) => week.images || [])
      .map((item) => item.fileUrl);

    const index = allImages.indexOf(imageUrl);
    dispatch(openPreview({ images: allImages, index: index >= 0 ? index : 0 }));
  };

  const tabs = [
    { id: "images", icon: <ImageIcon size={18} />, label: "Images" },
    { id: "videos", icon: <PlayCircle size={18} />, label: "Videos" },
    { id: "audios", icon: <Mic size={18} />, label: "Audio" },
    { id: "documents", icon: <FileText size={18} />, label: "Files" },
    { id: "locations", icon: <MapPin size={18} />, label: "Location" },
  ];

  const mediaWeeks = Object.values(media || {});

  const currentMedia = mediaWeeks
    .map((weekGroup) => ({
      week: weekGroup.week,
      items: weekGroup[activeTab] || [],
    }))
    .filter((group) => group.items.length > 0);

  const totalCount = mediaWeeks.reduce((acc, weekGroup) => {
    return acc + (weekGroup[activeTab]?.length || 0);
  }, 0);

  return (
    <div className="bg-white dark:bg-(--dark-body) dark:border-none border border-gray-100 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
          <ImageIcon size={18} className="text-emerald-500" />
          <span>Media Assets</span>
        </div>
        <span className="flex items-center justify-center min-w-5 h-5 rounded-full bg-slate-100 dark:bg-(--card-color) text-slate-500 text-[10px] font-bold px-1.5">{totalCount}</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between bg-slate-50/50 dark:bg-(--card-color) p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MediaType)}
            className={`
              flex flex-1 items-center justify-center p-2 rounded-lg transition-all
              ${activeTab === tab.id ? "bg-white dark:bg-(--page-body-bg) text-primary shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}
            `}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
          <ImageIcon size={16} />
          <span>
            {tabs.find((t) => t.id === activeTab)?.label} ({totalCount})
          </span>
        </div>

        {currentMedia.length > 0 ? (
          <div className="space-y-6">
            {currentMedia.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{group.week}</p>
                <div className="grid grid-cols-3 gap-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="aspect-square rounded-lg bg-slate-100 dark:bg-neutral-800 overflow-hidden cursor-pointer relative group" onClick={() => activeTab === "images" && handleImageClick(item.fileUrl)}>
                      {activeTab === "images" ? (
                        <>
                          <Image src={item.fileUrl} alt="Media" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 size={24} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">{tabs.find((t) => t.id === activeTab)?.icon}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center gap-4 bg-slate-50/30 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">
            <div className="p-4 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm">
              <ImageIcon size={32} className="text-slate-200" />
            </div>
            <p className="text-sm font-semibold text-slate-400">No {activeTab}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMediaAssets;
