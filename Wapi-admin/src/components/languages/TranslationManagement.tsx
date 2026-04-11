/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetLanguageByIdQuery, useGetTranslationsQuery, useUpdateTranslationsMutation } from "@/src/redux/api/languageApi";
import { ArrowLeft, BookOpen, Check, LayoutGrid, List, RotateCcw, Save, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Can from "../shared/Can";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface TranslationManagementProps {
  id: string;
}

const TranslationManagement = ({ id }: TranslationManagementProps) => {
  const router = useRouter();
  const { data: languageData } = useGetLanguageByIdQuery(id);
  const { data: translationsData, isLoading } = useGetTranslationsQuery(id);
  const [updateTranslations, { isLoading: isUpdating }] = useUpdateTranslationsMutation();

  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    if (translationsData?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranslations(translationsData.data);
    }
  }, [translationsData]);

  const matchesSearch = (val: any, query: string): boolean => {
    if (typeof val === "string") {
      return val.toLowerCase().includes(query.toLowerCase());
    }
    if (typeof val === "object" && val !== null) {
      return Object.entries(val).some(([k, v]) => k.toLowerCase().includes(query.toLowerCase()) || matchesSearch(v, query));
    }
    return false;
  };

  const filteredKeys = useMemo(() => {
    return Object.keys(translations).filter((key) => {
      const lowerQuery = searchQuery.toLowerCase();
      if (key.toLowerCase().includes(lowerQuery)) return true;
      return matchesSearch(translations[key], searchQuery);
    });
  }, [translations, searchQuery]);

  const handleValueChange = (key: string, value: string, subKey?: string) => {
    setTranslations((prev) => {
      if (subKey) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [subKey]: value,
          },
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSave = async () => {
    try {
      await updateTranslations({ id, data: { translations } }).unwrap();
      toast.success("Translations updated successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update translations.");
    }
  };

  const handleReset = () => {
    if (translationsData?.data) {
      setTranslations(translationsData.data);
      toast.info("Changes reset to last saved state.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pt-10">
        <Skeleton className="h-14 w-1/3 rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar)">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-(--text-green-primary) flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Manage Translations
                <span className="text-gray-400 font-normal">({languageData?.data?.name || "..."})</span>
              </h1>
              <p className="text-sm text-gray-500">Edit localization keys and values for this language.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Can permission="update.languages">
              <Button variant="outline" onClick={handleReset} className="rounded-xl border-gray-200 dark:border-slate-800" disabled={isUpdating}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </Can>
            <Can permission="update.languages">
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none min-w-35" disabled={isUpdating}>
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </Button>
            </Can>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-(--card-color) rounded-xl p-4 border border-gray-200 dark:border-(--card-border-color) mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search keys or values..." className="pl-10 h-10 bg-gray-50 dark:bg-slate-900/50 border-none rounded-lg focus-visible:ring-emerald-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-slate-900 rounded-lg p-1">
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" : "text-gray-500"}`}>
              <List size={18} />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" : "text-gray-500"}`}>
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        {/* Translation List */}
        {filteredKeys.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-6 items-start" : "space-y-6"}>
            {filteredKeys.map((key) => {
              const value = translations[key];
              const isObject = typeof value === "object" && value !== null;
              const isCatMatch = searchQuery && key.toLowerCase().includes(searchQuery.toLowerCase());

              return (
                <div key={key} className={`bg-white dark:bg-(--card-color) p-6 rounded-2xl border transition-all shadow-sm group ${isCatMatch ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-gray-100 dark:border-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-900/30"}`}>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                      <Label className={`text-sm font-bold uppercase tracking-widest ${isCatMatch ? "text-emerald-600" : "text-gray-400 dark:text-gray-500"}`}>{key}</Label>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>

                    {isObject ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                        {Object.entries(value).map(([subKey, subValue]: [string, any]) => {
                          const isSubKeyMatch = searchQuery && subKey.toLowerCase().includes(searchQuery.toLowerCase());
                          const isSubValueMatch = searchQuery && typeof subValue === "string" && subValue.toLowerCase().includes(searchQuery.toLowerCase());
                          const isMatch = isSubKeyMatch || isSubValueMatch;

                          return (
                            <div key={subKey} className="space-y-1.5">
                              <Label className={`text-[12px] font-semibold uppercase tracking-tight ml-1 mb-1 transition-colors ${isSubKeyMatch ? "text-emerald-600 font-bold" : "text-gray-500"}`}>{subKey}</Label>
                              <Input value={subValue as string} onChange={(e) => handleValueChange(key, e.target.value, subKey)} className={`bg-gray-50 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-lg h-10 transition-all text-sm ${isMatch ? "ring-2 ring-emerald-500/20 border-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10" : ""}`} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <Input value={value} onChange={(e) => handleValueChange(key, e.target.value)} className={`bg-gray-50 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-lg h-10 transition-all ${searchQuery && value.toLowerCase().includes(searchQuery.toLowerCase()) ? "ring-2 ring-emerald-500/20 border-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10" : ""}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-(--card-color) rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">No keys found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search query.</p>
          </div>
        )}

        {/* Floating Save Button for Mobile */}
        <div className="md:hidden fixed bottom-6 right-6">
          <Can permission="update.languages">
            <Button onClick={handleSave} className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200" disabled={isUpdating}>
              {isUpdating ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={24} />}
            </Button>
          </Can>
        </div>
      </div>
    </div>
  );
};

export default TranslationManagement;
