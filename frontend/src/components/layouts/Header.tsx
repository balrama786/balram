"use client";

import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setRTL } from "@/src/redux/reducers/layoutSlice";
import { Building2, Moon, PilcrowLeft, PilcrowRight, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import LanguageDropdown from "./LanguageDropdown";
import Profile from "./Profile";
import SearchBar from "./SearchBar";
import WorkspaceSwitcherModal from "@/src/components/workspace/WorkspaceSwitcherModal";

const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarToggle, isRTL } = useAppSelector((state) => state.layout);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { theme, setTheme } = useTheme();
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);

  const darkMode = theme === "dark";

  const handleThemeToggle = () => {
    if (!themeBtnRef.current) return;

    const rect = themeBtnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    if (!document.startViewTransition) {
      setTheme(darkMode ? "light" : "dark");
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(darkMode ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <>
      <header className={`fixed top-0 z-30 bg-white dark:bg-(--card-color) backdrop-blur-lg border-b border-gray-200 dark:border-(--card-border-color) transition-all duration-300 ${!sidebarToggle ? "min-[1025px]:ps-66 w-full" : "min-[1025px]:ps-20 w-full"}`}>
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 ml-3 sm:ml-6 rtl:mr-3 rtl:mr-6 rtl:ml-0">
              <Button variant="ghost" size="lg" onClick={() => setWorkspaceSwitcherOpen(true)} className="flex items-center gap-2 h-10 px-2 sm:px-3 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) text-[15px] font-medium border border-slate-200 dark:border-(--card-border-color) max-w-[40px] sm:max-w-40" title="Switch Workspace">
                <Building2 size={20} className="text-primary shrink-0" />
                <span className="truncate hidden sm:inline">{selectedWorkspace?.name ?? "Workspace"}</span>
              </Button>

              <Button variant="ghost" size="icon" onClick={() => dispatch(setRTL())} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg cursor-pointer transition-all ${isRTL ? "bg-emerald-50 text-primary hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400" : "text-slate-500 shadow-sm hover:bg-slate-100 dark:text-gray-500 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)"}`} title={isRTL ? "Switch to LTR" : "Switch to RTL"}>
                {!isRTL ? <PilcrowRight size={18} className={`sm:w-5 sm:h-5 transition-transform duration-300`} /> : <PilcrowLeft size={18} className={`sm:w-5 sm:h-5 transition-transform duration-300`} />}
              </Button>
              <Button ref={themeBtnRef} onClick={handleThemeToggle} className={`w-9 h-9 sm:w-10 sm:h-10 p-2 sm:p-2.5 rounded-lg transition-all duration-200 cursor-pointer dark:bg-(--page-body-bg) dark:text-gray-500 dark:hover:text-white dark:hover:bg-[#455645] bg-white text-slate-500 hover:text-[#16a34a] hover:bg-green-50 shadow-sm border border-slate-100 dark:border-none`}>
                {darkMode ? <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
              </Button>
              <LanguageDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-white flex items-center justify-center font-semibold hover:bg-green-700 transition-colors">
                    <span>{user ? user.name?.charAt(0)?.toUpperCase() : "U"}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="p-0 border-none shadow-none bg-transparent">
                  <Profile />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <WorkspaceSwitcherModal isOpen={workspaceSwitcherOpen} onClose={() => setWorkspaceSwitcherOpen(false)} />
    </>
  );
};

export default Header;
