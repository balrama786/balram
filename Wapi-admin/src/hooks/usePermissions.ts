import { useAppSelector } from "../redux/hooks";
import { useMemo, useCallback } from "react";
import { sidebarMenuData } from "../data/sidebarList";

export const usePermissions = () => {
  const { permissions, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const flatPermissions = useMemo(() => {
    const slugs: string[] = [];
    permissions.forEach((group) => {
      group.submodules.forEach((sub) => {
        slugs.push(sub.slug);
      });
    });
    return slugs;
  }, [permissions]);

  const hasPermission = useCallback(
    (slug: string | undefined, overridePermissions?: string[]): boolean => {
      if (!isAuthenticated) return false;
      if (!slug) return true;

      if (user?.role === "super_admin") return true;

      const perms = overridePermissions || flatPermissions;
      return perms.includes(slug);
    },
    [isAuthenticated, user?.role, flatPermissions]
  );

  const hasAnyPermission = useCallback(
    (slugs: string[] | undefined): boolean => {
      if (!isAuthenticated) return false;
      if (!slugs || slugs.length === 0) return true;

      if (user?.role === "super_admin") return true;

      return slugs.some((slug) => flatPermissions.includes(slug));
    },
    [isAuthenticated, user?.role, flatPermissions]
  );

  const hasModulePermission = useCallback(
    (moduleName: string): boolean => {
      if (!isAuthenticated) return false;
      if (user?.role === "super_admin") return true;

      return permissions.some((p) => p.module === moduleName);
    },
    [isAuthenticated, user?.role, permissions]
  );

  const getFirstAvailableRoute = useCallback(
    (overridePermissions?: string[]): string => {
      for (const section of sidebarMenuData) {
        for (const item of section.items) {
          if (!item.permission || hasPermission(item.permission, overridePermissions)) {
            if (item.hasSubmenu && item.submenu) {
              const firstSub = item.submenu.find((s) => !s.permission || hasPermission(s.permission, overridePermissions));
              if (firstSub) return firstSub.path;
            } else if (item.path) {
              return item.path;
            }
          }
        }
      }
      return "/dashboard";
    },
    [hasPermission]
  );

  const isRoutePermitted = useCallback(
    (pathname: string, overridePermissions?: string[]): boolean => {
      if (pathname === "/" || pathname === "/dashboard") {
        return hasPermission("view.admindashboard", overridePermissions);
      }

      for (const section of sidebarMenuData) {
        for (const item of section.items) {
          if (item.path && (pathname === item.path || pathname.startsWith(item.path + "/"))) {
            return !item.permission || hasPermission(item.permission, overridePermissions);
          }
          if (item.hasSubmenu && item.submenu) {
            for (const sub of item.submenu) {
              if (pathname === sub.path || pathname.startsWith(sub.path + "/")) {
                return !sub.permission || hasPermission(sub.permission, overridePermissions);
              }
            }
          }
        }
      }
      return true;
    },
    [hasPermission]
  );

  return {
    permissions,
    flatPermissions,
    hasPermission,
    hasAnyPermission,
    hasModulePermission,
    getFirstAvailableRoute,
    isRoutePermitted,
    isAuthenticated,
  };
};
