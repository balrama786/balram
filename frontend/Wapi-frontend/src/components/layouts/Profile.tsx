"use client";

import { DropdownMenuItem } from "@/src/elements/ui/dropdown-menu";
import { useAppSelector } from "@/src/redux/hooks";
import { setLogout } from "@/src/redux/reducers/authSlice";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const Profile = () => {
  const { t } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const distch = useDispatch();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    distch(setLogout());
    router.replace("/landing");
  };

  return (
    <>
      <div className="w-60 bg-white shadow-xl border rounded-lg overflow-hidden z-[110] dark:bg-(--card-color)">
        <DropdownMenuItem className="border-b p-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{user ? user.name?.charAt(0)?.toUpperCase() : "U"}</div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-400">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </DropdownMenuItem>

        <div className="max-h-105 overflow-y-auto">
          <DropdownMenuItem onClick={() => router.push("/manage_profile")} className="dark:hover:bg-(--table-hover)">
            <span className="text-gray-700 dark:text-gray-400 p-1">{t("layout.manage_profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/landing")} className="dark:hover:bg-(--table-hover)">
            <span className="text-gray-700 dark:text-gray-400 p-1">{t("layout.help_center")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="border-t mt-1"
            onSelect={(e) => {
              e.preventDefault();
              setShowLogoutConfirm(true);
            }}
          >
            <div className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 cursor-pointer dark:hover:bg-(--table-hover)">
              <LogOut className="w-4 h-4" color="red" />
              <span>{t("layout.logout")}</span>
            </div>
          </DropdownMenuItem>
        </div>
      </div>
      <ConfirmModal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} title={t("layout.logout_confirm_title")} subtitle={t("layout.logout_confirm_desc")} confirmText={t("layout.logout")} cancelText={t("common.cancel")} variant="danger" loadingText={t("layout.logging_out")} />
    </>
  );
};

export default Profile;
