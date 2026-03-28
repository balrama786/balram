"use client";

import { useLogoutMutation } from "@/src/redux/api/authApi";
import { useAppSelector } from "@/src/redux/hooks";
import { logout } from "@/src/redux/reducers/authSlice";
import { setRTL } from "@/src/redux/reducers/layoutSlice";
import { Moon, PilcrowLeft, PilcrowRight, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ConfirmModal from "../../../shared/ConfirmModal";
import LanguageDropdown from "./LanguageDropdown";

const RightHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  const [mounted, setMounted] = useState(false);
  const [logoutApi] = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { isRTL } = useAppSelector((state) => state.layout);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
    <div className="flex items-center gap-3">
      <LanguageDropdown />

      <button
        onClick={() => dispatch(setRTL())}
        className="p-2.5 rounded-lg transition-all duration-200
          dark:bg-page-body dark:text-slate-400 dark:hover:text-white dark:hover:bg-(--dark-sidebar)
          bg-white text-slate-500 hover:text-(--text-green-primary) hover:bg-green-50 shadow-sm border border-slate-100 dark:border-none"
      >
        {!isRTL ? <PilcrowRight className="w-5 h-5" /> : <PilcrowLeft className="w-5 h-5" />}
      </button>

      <button
        ref={themeBtnRef}
        onClick={handleThemeToggle}
        className="p-2.5 rounded-lg transition-all duration-200
          dark:bg-page-body dark:text-slate-400 dark:hover:text-white dark:hover:bg-(--dark-sidebar)
          bg-white text-slate-500 hover:text-(--text-green-primary) hover:bg-green-50 shadow-sm border border-slate-100 dark:border-none"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setIsLoggingOut(true);
          await logoutApi().unwrap();
          dispatch(logout());
          router.push("/auth/login");
        }}
        isLoading={isLoggingOut}
        title="Are you sure?"
        subtitle="You will need to login again."
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default RightHeader;
