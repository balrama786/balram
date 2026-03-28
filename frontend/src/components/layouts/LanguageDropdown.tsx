"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { Button } from "@/src/elements/ui/button";
import { Flag } from "../shared/Flag";

const LANGUAGE_STORAGE_KEY = "selected_language";

const AVAILABLE_LANGUAGES = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    countryCode: "us",
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    countryCode: "es",
  },
];

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || "en";
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguageInfo = useMemo(() => {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === currentLanguage) || AVAILABLE_LANGUAGES[0];
  }, [currentLanguage]);

  const handleLanguageChange = async (locale: string) => {
    if (locale === currentLanguage || isChanging) return;

    setIsChanging(true);
    try {
      await i18n.changeLanguage(locale);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent shadow-none text-slate-900 dark:text-amber-50 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) transition-colors border-none" disabled={isChanging}>
          <Flag countryCode={currentLanguageInfo.countryCode} size={20} />
          <span className="text-sm font-medium hidden sm:inline uppercase">{currentLanguageInfo.code}</span>
          {isChanging && <span className="text-xs text-gray-500">...</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-(--card-color) border border-gray-200 dark:border-gray-800">
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)} className={`cursor-pointer p-1.5 flex items-center gap-2 ${currentLanguage === lang.code ? "bg-gray-100 dark:bg-(--dark-sidebar) dark:focus-visible:shadow-none" : ""}`} disabled={isChanging}>
            <Flag countryCode={lang.countryCode} size={18} />
            <span className="flex-1">{lang.name}</span>
            {currentLanguage === lang.code && <span className="text-xs text-blue-600 dark:text-white">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
