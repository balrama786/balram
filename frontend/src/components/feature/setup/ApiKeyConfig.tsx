"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Eye, EyeOff, Key, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ApiKeyConfigProps {
  value: string;
  onChange: (value: string) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <>
      <Card className="border dark:border-(--card-border-color) shadow-sm bg-white dark:bg-(--card-color)">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-3 rounded-lg bg-primary text-white shadow-lg shadow-emerald-500/20">
            <Key size={24} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{t("setup.api_key")}</CardTitle>
            <CardDescription>{t("setup.secure_authentication")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="relative group">
            <Input type={showApiKey ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("setup.api_key_placeholder")} className="h-12 bg-slate-50 pr-14.75 dark:bg-(--page-body-bg) border-slate-100 dark:border-(--card-border-color) rounded-lg focus-visible:ring-primary" />
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 bg-white dark:hover:bg-(--table-hover) dark:text-gray-400 dark:bg-(--card-color) rounded-lg text-slate-500 px-1">
              {showApiKey ? (
                <>
                  <EyeOff size={16} />
                </>
              ) : (
                <>
                  <Eye size={16} />
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 text-blue-600 dark:text-blue-400">
            <ShieldCheck size={18} className="shrink-0" />
            <span className="text-xs font-medium">{t("setup.credentials_encryption_notice")}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ApiKeyConfig;
