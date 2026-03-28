"use client";

import ContactImportProgressPopup from "@/src/components/contact/ContactImportProgressPopup";
import Header from "@/src/components/layouts/Header";
import Sidebar from "@/src/components/layouts/Sidebar";
import { useContactImportProgress } from "@/src/hooks/useContactImportProgress";
import { useGetSettingsQuery, useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { setSetting, setSubscription, setUserSetting } from "@/src/redux/reducers/settingSlice";
import { resetChatState } from "@/src/redux/reducers/messenger/chatSlice";
import { clearWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useContactImportProgress();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sidebarToggle } = useAppSelector((state) => state.layout);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);

  const prevWorkspaceIdRef = useRef(selectedWorkspace?._id);
 
   useEffect(() => {
     const currentWorkspaceId = selectedWorkspace?._id;
     if (currentWorkspaceId !== prevWorkspaceIdRef.current) {
       dispatch(resetChatState());
       prevWorkspaceIdRef.current = currentWorkspaceId;
     }
   }, [selectedWorkspace, dispatch]);

  const { data: workspacesData, isLoading: workspacesLoading } = useGetWorkspacesQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    if (workspacesLoading) return;

    const workspaces = workspacesData?.data || [];

    if (workspaces.length === 0) {
      if (selectedWorkspace) {
        dispatch(clearWorkspace());
      }
      router.replace("/workspace");
      return;
    }

    if (!selectedWorkspace) {
      router.replace("/workspace");
      return;
    }

    const isValid = workspaces.some((ws) => ws._id === selectedWorkspace._id);
    if (!isValid) {
      dispatch(clearWorkspace());
      router.replace("/workspace");
    }
  }, [isAuthenticated, selectedWorkspace, workspacesData, workspacesLoading, router, dispatch]);

  const { data: settingUserData, isSuccess: isUserSuccess } = useGetUserSettingsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: subscriptionData, isSuccess: isSubscriptionSuccess } = useGetUserSubscriptionQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: settingData, isSuccess } = useGetSettingsQuery({});

  const sidebarToggleRef = useRef(sidebarToggle);

  useEffect(() => {
    sidebarToggleRef.current = sidebarToggle;
  }, [sidebarToggle]);

  const updateSidebarBasedOnWidth = () => {
    const windowWidth = window.innerWidth;
    const currentToggle = sidebarToggleRef.current;

    if (windowWidth >= 1025 && windowWidth <= 1199) {
      if (!currentToggle) {
        dispatch(setSidebarToggle(true));
      }
    } else if (windowWidth >= 1200) {
      if (currentToggle) {
        dispatch(setSidebarToggle(false));
      }
    }
  };

  useEffect(() => {
    updateSidebarBasedOnWidth();
    const handleResize = () => updateSidebarBasedOnWidth();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("sidebarToggle");
    if (stored === "true") {
      dispatch(setSidebarToggle(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (settingUserData && isUserSuccess) {
      dispatch(setUserSetting(settingUserData));
    }
  }, [dispatch, isUserSuccess, settingUserData]);

  useEffect(() => {
    if (subscriptionData?.success && isSubscriptionSuccess) {
      dispatch(setSubscription(subscriptionData.data));
    }
  }, [dispatch, isSubscriptionSuccess, subscriptionData]);

  useEffect(() => {
    if (settingData && isSuccess) {
      const dataToSet = settingData.data || settingData;
      dispatch(setSetting(dataToSet));
    }
  }, [dispatch, isSuccess, settingData]);

  return (
    <>
      {isAuthenticated && !selectedWorkspace ? null : (
        <div className="flex h-screen bg-white dark:bg-(--dark-body) transition-colors duration-300 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
            <Header />
            <div className={`flex-1 overflow-y-auto custom-scrollbar mt-17 bg-[#f4f4f485] dark:bg-(--dark-body) [@media(max-width:767px)]:mt-16 ${!sidebarToggle ? "ml-66.5 rtl:mr-66.5 rtl:ml-0 [@media(max-width:1024px)]:ml-0! [@media(max-width:1024px)]:mr-0!" : "ml-20 rtl:mr-20 rtl:ml-0 [@media(max-width:1024px)]:ml-0! [@media(max-width:1024px)]:mr-0!"} transition-all duration-300`}>{children}</div>
          </main>
          <ContactImportProgressPopup />
        </div>
      )}
    </>
  );
};

export default Layout;
