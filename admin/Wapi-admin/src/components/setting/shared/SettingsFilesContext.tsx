"use client";

import { createContext, useContext, useRef, MutableRefObject } from "react";

export type PendingFilesMap = MutableRefObject<Map<string, File>>;

const SettingsFilesContext = createContext<PendingFilesMap | null>(null);

export const SettingsFilesProvider = ({ children }: { children: React.ReactNode }) => {
  const pendingFiles = useRef<Map<string, File>>(new Map());
  return (
    <SettingsFilesContext.Provider value={pendingFiles}>
      {children}
    </SettingsFilesContext.Provider>
  );
};

export const usePendingFiles = (): PendingFilesMap => {
  const ctx = useContext(SettingsFilesContext);
  if (!ctx) throw new Error("usePendingFiles must be used within SettingsFilesProvider");
  return ctx;
};
