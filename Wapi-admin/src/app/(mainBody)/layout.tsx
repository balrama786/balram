"use client";

import Header from "@/src/components/layouts/header";
import Sidebar from "@/src/components/layouts/sidebar";
import { useGetSettingsQuery } from "@/src/redux/api/settingApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { setSettings } from "@/src/redux/reducers/settingsSlice";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: settingsData } = useGetSettingsQuery();
  const { sidebarToggle, sidebarHover } = useAppSelector((state) => state.layout);

  useEffect(() => {
    if (settingsData) {
      dispatch(setSettings(settingsData));
    }
  }, [settingsData, dispatch]);

  const updateSidebarBasedOnWidth = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 1199) {
      dispatch(setSidebarToggle(true));
    } else {
      dispatch(setSidebarToggle(false));
    }
  };

  useEffect(() => {
    updateSidebarBasedOnWidth();
    const handleResize = () => updateSidebarBasedOnWidth();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isVisuallyCollapsed = sidebarToggle && !sidebarHover;

  return (
    <div className="min-h-screen bg-[#eeeff3] dark:bg-(--dark-body) transition-colors duration-300">
      <Header />
      <div className=" flex-1">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300
            ${!isVisuallyCollapsed ? "lg:ml-76 rtl:lg:ml-0 rtl:lg:mr-76" : "lg:ml-24 rtl:lg:ml-0 rtl:lg:mr-24"} ml-0`}
        >
          <div className="p-5 sm:p-6 lg:p-8 min-h-screen">
            <div className="rounded-lg h-full mt-21.25">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
