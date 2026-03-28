"use client";

import { ReactNode } from "react";
import useInternetConnection from "@/src/hooks/useInternetConnection";
import NoInternetPage from "./NoInternetPage";

interface InternetConnectionWrapperProps {
  children: ReactNode;
}

const InternetConnectionWrapper = ({ children }: InternetConnectionWrapperProps) => {
  const { isOnline, isChecking, retry } = useInternetConnection();

  if (!isOnline) {
    return <NoInternetPage onRetry={retry} isRetrying={isChecking} />;
  }

  return <>{children}</>;
};

export default InternetConnectionWrapper;
