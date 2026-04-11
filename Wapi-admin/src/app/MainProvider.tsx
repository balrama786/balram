/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import Store from "../redux/store";
import "../i18n";
import { useLanguageInitializer } from "../hooks/useLanguageInitializer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeAuth, setPermissions } from "../redux/reducers/authSlice";
import { useGetMyPermissionsQuery } from "../redux/api/authApi";
import DynamicSettingsProvider from "../components/providers/DynamicSettingsProvider";
import { useAppSelector } from "../redux/hooks";
import Loading from "./loading";
import { usePermissions } from "../hooks/usePermissions";
import { usePathname, useRouter } from "next/navigation";

interface MainProviderProps {
  children: ReactNode;
}

function AppContent({ children }: MainProviderProps) {
  const isLanguageReady = useLanguageInitializer();
  const dispatch = useDispatch();
  const { isRTL } = useAppSelector((state) => state.layout);
  const { getFirstAvailableRoute, isAuthenticated, isRoutePermitted } = usePermissions();
  const { token } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: permissionsData,
    isSuccess: isPermissionsSuccess,
    isLoading: isPermissionsLoading,
    isError: isPermissionsError,
  } = useGetMyPermissionsQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isPermissionsSuccess && permissionsData?.success) {
      dispatch(setPermissions(permissionsData.data));

      if (pathname.startsWith("/auth/")) return;

      const currentFlatSlugs: string[] = [];
      permissionsData.data.forEach((group: any) => {
        group.submodules.forEach((sub: any) => {
          currentFlatSlugs.push(sub.slug);
        });
      });

      if (!isRoutePermitted(pathname, currentFlatSlugs)) {
        const firstRoute = getFirstAvailableRoute(currentFlatSlugs);
        if (firstRoute && firstRoute !== pathname) {
          router.push(firstRoute);
        }
      }
    }
  }, [isPermissionsSuccess, permissionsData, pathname, isRoutePermitted, getFirstAvailableRoute, router, dispatch]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [isRTL]);

  if (!isLanguageReady) {
    return <Loading />;
  }

  if (isAuthenticated && isPermissionsLoading && !isPermissionsError && !pathname.startsWith("/auth/")) {
    return <Loading />;
  }

  if (isAuthenticated && isPermissionsSuccess && permissionsData?.success) {
    if (!pathname.startsWith("/auth/")) {
      const currentFlatSlugs: string[] = [];
      permissionsData.data.forEach((group: any) => {
        group.submodules.forEach((sub: any) => {
          currentFlatSlugs.push(sub.slug);
        });
      });

      if (!isRoutePermitted(pathname, currentFlatSlugs)) {
        return <Loading />;
      }
    }
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
