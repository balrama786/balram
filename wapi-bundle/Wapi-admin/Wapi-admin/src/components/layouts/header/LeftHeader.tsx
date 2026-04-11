"use client";
import {
  iconMap,
  MenuItem,
  sidebarMenuData,
  SubMenuItem,
} from "@/src/data/sidebarList";
import { Button } from "@/src/elements/ui/button";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchResult {
  label: string;
  path: string;
  icon: string;
  parentLabel?: string;
}

const flattenMenuData = (): SearchResult[] => {
  const flattened: SearchResult[] = [];

  sidebarMenuData.forEach((section) => {
    section.items.forEach((item: MenuItem) => {
      if (item.path && !item.hasSubmenu) {
        flattened.push({
          label: item.label,
          path: item.path,
          icon: item.icon,
        });
      }

      if (item.hasSubmenu && item.submenu) {
        item.submenu.forEach((subItem: SubMenuItem) => {
          flattened.push({
            label: subItem.label,
            path: subItem.path,
            icon: item.icon,
            parentLabel: item.label,
          });
        });
      }
    });
  });

  return flattened;
};

const LeftHeader = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allMenuItems = useMemo(() => flattenMenuData(), []);

  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase().trim();

    return allMenuItems.filter((item) => {
      const translatedLabel = t(item.label).toLowerCase();
      const translatedParent = item.parentLabel
        ? t(item.parentLabel).toLowerCase()
        : "";

      const labelMatch = translatedLabel.includes(query);
      const parentMatch = translatedParent.includes(query);
      return labelMatch || parentMatch;
    });
  }, [searchQuery, allMenuItems, t]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleResultClick = (path: string) => {
    router.push(path);
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="w-4 h-4" />
    ) : (
      <Search className="w-4 h-4" />
    );
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div
      ref={searchContainerRef}
      className="hidden md:flex flex-1 max-w-md relative ml-2 items-center"
    >
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder={t("common.search_placeholder")}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={handleOpen}
          className={`
              pl-10 pr-4 py-2.5 w-full rounded-lg text-sm outline-none transition-all border
              dark:bg-page-body dark:border-(--card-border-color) dark:text-slate-200 dark:focus:bg-page-body dark:focus:border-(--text-green-primary)
              bg-(--input-color) border-(--input-border-color) text-slate-600 focus:border-(--text-green-primary)
            `}
        />
        {searchQuery && (
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && searchQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-(--card-color) dark:backdrop-blur-xl border border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-2xl z-50 max-h-[70vh] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <div className="w-12 h-12 bg-slate-100 dark:bg-[#455645]/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium">
                {t("common.no_results_for", { query: searchQuery })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {t("common.try_searching_menu")}
              </p>
            </div>
          ) : (
            <div>
              {results.map((result, index) => (
                <Button
                  key={`${result.path}-${index}`}
                  onClick={() => handleResultClick(result.path)}
                  className="w-full rounded-none h-10 bg-white dark:bg-(--card-color) dark:hover:bg-(--dark-sidebar) shadow-none px-4 py-6 flex items-center gap-3 hover:bg-gray-100  border-b border-gray-100 dark:border-(--card-border-color) last:border-b-0 cursor-pointer transition-all group text-left"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 transition-all">
                    {getIcon(result.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-700 dark:text-white transition-colors">
                      {t(result.label)}
                    </div>
                    {result.parentLabel && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-0.5">
                        {t(result.parentLabel)}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeftHeader;
