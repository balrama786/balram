/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ImageBaseUrl } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useCreateLanguageMutation, useGetLanguageByIdQuery, useUpdateLanguageMutation } from "@/src/redux/api/languageApi";
import { AlertCircle, ArrowLeft, Check, FileJson, Globe, Languages, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { languages } from "@/src/utils/languages";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_JSON_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

interface AddLanguagePageProps {
  id?: string;
}

const AddLanguagePage = ({ id }: AddLanguagePageProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();
  const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();
  const { data: languageData, isLoading: isLoadingLanguage } = useGetLanguageByIdQuery(id || "", { skip: !isEditMode });

  const [name, setName] = useState("");
  const [locale, setLocale] = useState("");
  const [isRtl, setIsRtl] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [flagFile, setFlagFile] = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonFileName, setJsonFileName] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && languageData?.data) {
      const lang = languageData.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(lang.name);
      setLocale(lang.locale);
      setIsRtl(lang.is_rtl);
      setIsActive(lang.is_active);
      if (lang.flag) {
        setFlagPreview(ImageBaseUrl + "/" + lang.flag);
      }
    }
  }, [isEditMode, languageData]);

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid image format. Use PNG, JPG, SVG or WEBP.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Image size too large. Max 2MB allowed.");
        return;
      }
      setFlagFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlagPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        toast.error("Please upload a valid JSON file.");
        return;
      }
      if (file.size > MAX_JSON_SIZE) {
        toast.error("JSON file too large. Max 5MB allowed.");
        return;
      }
      setJsonFile(file);
      setJsonFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !locale) {
      toast.error("Name and Locale are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("locale", locale);
    formData.append("is_rtl", String(isRtl));
    formData.append("is_active", String(isActive));

    if (flagFile) {
      formData.append("flag", flagFile);
    }
    if (jsonFile) {
      formData.append("translation_json", jsonFile);
    }

    try {
      if (isEditMode) {
        await updateLanguage({ id: id as string, data: formData }).unwrap();
        toast.success("Language updated successfully.");
      } else {
        await createLanguage(formData).unwrap();
        toast.success("Language created successfully.");
      }
        router.push("/languages");
    } catch (error: any) {
      toast.error(error?.data?.error || error?.error || "Something went wrong.");
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingLanguage;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-(--text-green-primary) mb-2">{isEditMode ? "Edit Language" : "Add New Language"}</h1>
            <p className="text-gray-400 text-sm">{isEditMode ? "Update language details and translation files." : "Create a new language and upload its localization files."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          {/* --- Section 1: General Info --- */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">General Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="locale" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Select Language <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={locale}
                  onValueChange={(val) => {
                    setLocale(val);
                    // Auto-fill display name if it's currently empty
                    if (!name) {
                      const selectedLang = languages.find((l) => l.code === val);
                      if (selectedLang) setName(selectedLang.name);
                    }
                  }}
                >
                  <SelectTrigger className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg border-gray-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64  dark:bg-(--card-color)">
                    {languages.map((lang) => (
                      <SelectItem className="max-h-64  dark:hover:bg-(--table-hover)" key={lang.code} value={lang.code}>
                        {lang.name} ({lang.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  Language Display Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" placeholder="e.g. English" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg" required />
              </div>

              {/* Status Toggles */}
              <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-none transition-all ">
                <div>
                  <Label htmlFor="isRtl" className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                    Right-to-Left (RTL)
                  </Label>
                  <p className="text-xs text-gray-500">Enable for scripts like Arabic or Hebrew</p>
                </div>
                <Switch id="isRtl" checked={isRtl} onCheckedChange={setIsRtl} className="data-[state=checked]:bg-(--text-green-primary)" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-none transition-all ">
                <div>
                  <Label htmlFor="isActive" className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                    Active State
                  </Label>
                  <p className="text-xs text-gray-500">Allow users to select this language</p>
                </div>
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-(--text-green-primary)" />
              </div>
            </div>
          </div>

          {/* --- Section 2: Assets & Files --- */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">Assets & Translations</h2>
            </div>

            <div className="space-y-8">
              {/* Flag Picker */}
              <div className="space-y-4 flex flex-col">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">Language Flag Icon</Label>
                <div className="flex items-center gap-6 flex-col sm:flex-row">
                  <div className="shrink-0">
                    {flagPreview ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 group shadow-sm transition-all hover:border-emerald-500">
                        <Image src={flagPreview} alt="Flag" className="w-full h-full object-cover" width={100} height={100} unoptimized />
                        <button
                          type="button"
                          onClick={() => {
                            setFlagFile(null);
                            setFlagPreview(null);
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 dark:border-(--card-border-color) bg-gray-50 dark:bg-(--card-color) flex flex-col items-center justify-center transition-all hover:border-emerald-500">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label htmlFor="flag" className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-page-body dark:border-none dark:text-slate-300 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-(--table-hover) transition-all font-medium text-sm text-gray-700 shadow-sm active:scale-95">
                      <Upload className="w-4 h-4" />
                      {flagPreview ? "Change Flag Icon" : "Upload Flag Icon"}
                    </label>
                    <input id="flag" type="file" accept="image/*" onChange={handleFlagChange} className="hidden" />
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      PNG, SVG, WEBP. Max 2MB. Square ratio best.
                    </p>
                  </div>
                </div>
              </div>

              {/* Translation JSON Picker */}
              <div className="space-y-4 flex flex-col">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">Localization JSON File</Label>
                <div className="relative border-2 border-dashed border-gray-200 dark:border-(--card-border-color) rounded-lg p-8 bg-gray-50/50 dark:bg-(--card-color) hover:bg-gray-100/50 dark:hover:bg-(--table-hover) hover:border-(--text-green-primary) transition-all group overflow-hidden">
                  <input id="translation_json" type="file" accept=".json,application/json" onChange={handleJsonChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileJson className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    {jsonFileName ? (
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{jsonFileName}</p>
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">File Selected</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{isEditMode ? "Replace Translation File" : "Upload Translation File"}</p>
                        <p className="text-sm text-gray-500">Drag & drop your .json file or click to browse</p>
                        <p className="text-xs text-gray-400">Max size allowed: 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Note for Edit Mode */}
                {isEditMode && !jsonFile && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">Existing translation file is remains active unless you upload a new one.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} className="px-4.5 py-5 h-12 dark:border-none border-gray-200 dark:bg-page-body dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-(--table-hover) rounded-lg font-medium transition-all" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="px-4.5 py-5 h-12 bg-primary hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 min-w-40" disabled={isLoading || !name || !locale}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isEditMode ? "Saving..." : "Creating..."}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  <span>{isEditMode ? "Save Changes" : "Create Language"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLanguagePage;
