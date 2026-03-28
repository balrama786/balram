"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import Store from "../redux/store";
import "../i18n";
import { useLanguageInitializer } from "../hooks/useLanguageInitializer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeAuth } from "../redux/reducers/authSlice";

interface MainProviderProps {
  children: ReactNode;
}

import DynamicSettingsProvider from "../components/providers/DynamicSettingsProvider";
import { useAppSelector } from "../redux/hooks";
import Loading from "./loading";

function AppContent({ children }: MainProviderProps) {
  const isLanguageReady = useLanguageInitializer();
  const dispatch = useDispatch();
  const { isRTL } = useAppSelector((state) => state.layout);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Handle RTL/LTR direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    // Also add/remove a class for potential custom CSS overrides
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [isRTL]);

  // Don't render children until language is ready
  if (!isLanguageReady) {
    return <Loading />;
  }

  return <>{children}</>;
}

const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  return (
    <Provider store={Store}>
      <DynamicSettingsProvider>
        <AppContent>{children}</AppContent>
      </DynamicSettingsProvider>
    </Provider>
  );
};

export default MainProvider;
