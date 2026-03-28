/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import ChatArea from "./ChatArea";
import ChatProfile from "./ChatProfile";
import ChatSidebar from "./ChatSidebar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setIsMobileScreen, setLeftSidebartoggle, setProfileToggleStatus } from "@/src/redux/reducers/messenger/chatSlice";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { setPageTitle } from "@/src/redux/reducers/settingSlice";
import { ChevronLeft } from "lucide-react";
import WabaRequired from "@/src/shared/WabaRequired";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { selectedChat, profileToggle, isRehydrated, leftSidebartoggle } = useSelector((state: RootState) => state.chat);
  const { selectedWorkspace }: any = useAppSelector((state) => state.workspace);
  const { data: workspacesData } = useGetWorkspacesQuery();
  
  const latestWorkspace = workspacesData?.data?.find((ws: any) => ws._id === selectedWorkspace?._id);
  const isBaileys = (latestWorkspace?.waba_type || selectedWorkspace?.waba_type) === "baileys";
  const currentStatus = latestWorkspace?.connection_status || selectedWorkspace?.connection_status;
  const currentWabaId = latestWorkspace?.waba_id || selectedWorkspace?.waba_id;
  
  const isConnected = isBaileys ? !!currentWabaId && currentStatus === "connected" : !!currentWabaId;
  const { app_name } = useAppSelector((state) => state.setting);

  useEffect(() => {
    dispatch(setSidebarToggle(true));
    dispatch(setPageTitle("Chat"));

    return () => {
      dispatch(setSidebarToggle(false));
      dispatch(setPageTitle(""));
    };
  }, [dispatch]);

  useEffect(() => {
    let isMobile = window.innerWidth <= 991;

    const handleResize = () => {
      const currentIsMobile = window.innerWidth <= 991;
      dispatch(setIsMobileScreen(currentIsMobile));
      if (currentIsMobile !== isMobile) {
        isMobile = currentIsMobile;
        dispatch(
          setLeftSidebartoggle({
            isMobile: !currentIsMobile,
            forceState: true,
          })
        );
        dispatch(setProfileToggleStatus(!currentIsMobile));
      }
    };

    const initialIsMobile = window.innerWidth <= 991;
    dispatch(setIsMobileScreen(initialIsMobile));
    dispatch(
      setLeftSidebartoggle({
        isMobile: !initialIsMobile,
        forceState: true,
      })
    );
    dispatch(setProfileToggleStatus(!initialIsMobile));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleSidebar = () => {
    dispatch(
      setLeftSidebartoggle({
        isMobile: window.innerWidth <= 991,
      })
    );
  };

  if (!isConnected) {
    return (
      <div className="h-[calc(100vh-82px)] bg-slate-50 dark:bg-(--dark-body)">
        <WabaRequired />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[calc(100vh-82px)] bg-[#f4f4f485] dark:bg-(--dark-body)  dark:border-(--card-border-color)">
        <div className="flex sm:m-4 m-3 flex-1 w-auto gap-4 [@media(max-width:335px)]:w-[calc(100%-22px)] relative">
          {leftSidebartoggle && <ChatSidebar />}
          {!isRehydrated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedChat ? (
            <ChatArea />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-(--card-color) rounded-lg border border-gray-200 dark:border-(--card-border-color)">
              {!leftSidebartoggle && (
                <div onClick={handleSidebar} className="cursor-pointer absolute top-2.5 left-3">
                  <ChevronLeft size={20} />
                </div>
              )}
              <div className="h-24 w-24 bg-(--light-primary) dark:bg-(--dark-sidebar) rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">👋</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Welcome to {app_name}</h2>
              <p className="text-slate-500 dark:text-gray-500 text-center max-w-md">Select a conversation from the sidebar to start chatting or send a new message.</p>
            </div>
          )}
          {selectedChat && profileToggle && <ChatProfile />}
        </div>
      </div>
    </>
  );
};

export default Chat;
