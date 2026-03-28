"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Flag } from "../../shared/Flag";

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
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
    countryCode: "fr",
  },
];

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentLanguage = i18n.resolvedLanguage || "en";
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguageInfo = useMemo(() => {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === currentLanguage) || AVAILABLE_LANGUAGES[0];
  }, [currentLanguage]);

  const handleLanguageChange = async (locale: string) => {
    if (locale === currentLanguage || isChanging) return;

    setIsChanging(true);
    try {
      await i18n.changeLanguage(locale);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
      await i18n.reloadResources(locale, "translations");
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsChanging(false);
    }
  };

  if (!mounted) return null;
  const darkMode = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          disabled={isChanging}
          className={`
            p-2.5 rounded-lg transition-all duration-200 relative group
            ${darkMode 
              ? 'bg-page-body text-slate-400 hover:text-white hover:bg-[#455645]' 
              : 'bg-white text-slate-500 hover:text-(--text-green-primary) hover:bg-green-50 shadow-sm border border-slate-100'
            }
          `}
        >
          <Globe className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger> 
      <DropdownMenuContent align="end" className="w-48 p-2 rounded-lg dark:bg-(--card-color) dark:border-(--card-border-color) shadow-2xl">
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)} 
            className={`
                cursor-pointer rounded-lg flex items-center gap-3 p-2.5 mb-1 last:mb-0 transition-colors
                ${currentLanguage === lang.code 
                    ? "bg-green-50 text-(--text-green-primary) dark:bg-(--card-color) dark:text-(--text-green-primary)" 
                    : "hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) focus:bg-slate-50 dark:focus:bg-[#455645]/30"
                }
            `} 
            disabled={isChanging}
          >
            <Flag countryCode={lang.countryCode} size={20} />
            <span className="flex-1 text-sm font-medium">{lang.name}</span>
            {currentLanguage === lang.code && <span className="text-primary">✓</span>}
          </DropdownMenuItem> 
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
