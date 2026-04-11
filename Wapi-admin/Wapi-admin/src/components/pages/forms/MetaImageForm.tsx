"use client";

import CustomImage from "@/src/shared/Image";
import { Image as ImageIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MetaImageFormProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const MetaImageForm = ({ imagePreview, onImageChange, onRemoveImage }: MetaImageFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-gray-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <ImageIcon className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className="text-lg font-bold dark:text-white">
          {t("pages.image_section", "Meta Image")}
        </h2>
      </div>

      <div className="space-y-4">
        {imagePreview ? (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-(--card-border-color) group">
            <CustomImage
              src={imagePreview}
              alt="Meta preview"
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className="aspect-video rounded-lg border-2 border-dashed border-gray-200 dark:border-(--card-border-color) bg-gray-50 dark:bg-page-body flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-(--dark-sidebar) transition-all group"
            onClick={() => document.getElementById("meta_image")?.click()}
          >
            <div className="p-3 bg-white dark:bg-(--card-color) rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {t("common.click_to_upload", "Click to upload")}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        )}
        <input
          id="meta_image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
      </div>
    </div>
  );
};

export default MetaImageForm;
