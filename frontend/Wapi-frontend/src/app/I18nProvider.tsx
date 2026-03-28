"use client";

import "@/src/lib/i18n";
import { ReactNode, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { isRTL } = useAppSelector((state) => state.layout);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [isRTL]);

  return <>{children}</>;
};

export default I18nProvider;
