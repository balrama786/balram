"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { ReactNode } from "react";
import MaintenancePage from "../maintenance/MaintenancePage";

interface MaintenanceGuardProps {
  children: ReactNode;
}

const MaintenanceGuard = ({ children }: MaintenanceGuardProps) => {
  const { maintenance_mode, maintenance_title, maintenance_message, maintenance_image_url } = useAppSelector((state) => state.setting);

  const toBoolean = (value: unknown): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return false;
  };

  if (toBoolean(maintenance_mode)) {
    return <MaintenancePage title={maintenance_title || "Under Maintenance"} message={maintenance_message || "We are performing some scheduled maintenance. Please check back soon."} imageUrl={maintenance_image_url || ""} />;
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
