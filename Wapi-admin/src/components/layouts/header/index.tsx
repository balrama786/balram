"use client"

import { useAppSelector } from "@/src/redux/hooks";
import { setMobileSidebarOpen, setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

const Header = () => {
  const { sidebarToggle, isRTL, sidebarHover } = useAppSelector(state => state.layout);
  const dispatch = useDispatch();
  const isVisuallyCollapsed = sidebarToggle && !sidebarHover;

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      dispatch(setMobileSidebarOpen());
    } else {
      dispatch(setSidebarToggle());
    }
  };

  return (
    <header
      className={`
        z-51 fixed top-5 transition-all duration-300 h-20 flex items-center left-0 right-0 shadow-[0_-55px_0px_0px_#eeeff3] dark:shadow-[0_-55px_0px_0px_var(--dark-body)]
        ${!isVisuallyCollapsed ? "lg:ps-72" : "lg:ps-24 ps-0"} 
      `}
    >
      <div className="flex-1 flex items-center justify-between bg-white dark:bg-(--card-color) py-4 px-5 rounded-lg m-5 mt-3 dark:border-(--card-border-color) border">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={handleToggle}
            className={`
              p-2.5 rounded-lg transition-all duration-200
              dark:bg-page-body dark:focus-visible:outline-none dark:text-slate-400 dark:hover:text-white dark:hover:bg-(--dark-sidebar)
              bg-white text-slate-500 hover:text-(--text-green-primary) hover:bg-green-50 shadow-sm border border-slate-100 dark:border-none
            `}
          >
            <Menu className="w-5 h-5" />
          </button>

          <LeftHeader />
        </div>

        <RightHeader />
      </div>
    </header>
  );
};

export default Header;
