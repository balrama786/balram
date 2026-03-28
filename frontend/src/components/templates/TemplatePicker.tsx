"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import { ArrowRight, FileText, Library } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import WabaRequired from "@/src/shared/WabaRequired";

const TemplatePicker = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id;

  const handleAction = (type: "blank" | "library") => {
    if (!wabaId) {
      toast.error(t("templates.no_waba_error", "No WABA connection found for this workspace."));
      return;
    }

    if (type === "blank") {
      setIsRedirecting(true);
      router.push(`/templates/${wabaId}`);
    } else {
      router.push(`/templates_library?wabaId=${wabaId}`);
    }
  };

  if (!wabaId) {
    return <WabaRequired title="WABA Connection Required" description="To manage WhatsApp message templates, you first need to connect a WhatsApp Business Account (WABA) to this workspace." />;
  }

  const options = [
    {
      icon: <FileText size={32} className="text-emerald-500" />,
      title: "Use a blank template",
      description: "Start from scratch and build your own custom WhatsApp message template with full control over every element.",
      action: () => handleAction("blank"),
      buttonLabel: isRedirecting ? "Redirecting..." : "Start from scratch",
      isLoading: isRedirecting,
      gradient: "from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10",
      border: "border-emerald-200/60 dark:border-emerald-500/20",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/50",
      buttonClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    {
      icon: <Library size={32} className="text-violet-500" />,
      title: "Admin Template Library",
      description: "Browse a curated collection of ready-to-use templates created by admin. Pick one, customize, and submit.",
      action: () => handleAction("library"),
      buttonLabel: "Browse Library",
      isLoading: false,
      gradient: "from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10",
      border: "border-violet-200/60 dark:border-violet-500/20",
      hoverBorder: "hover:border-violet-400 dark:hover:border-violet-500/50",
      buttonClass: "bg-violet-500 hover:bg-violet-600 text-white",
    },
  ];

  return (
    <div className="sm:p-8 p-5 space-y-8 h-[calc(100vh-2rem)] flex flex-col">
      <CommonHeader title="Manage Templates" description="Choose how you want to create your WhatsApp message template." />

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {options.map((option) => (
            <div key={option.title} className={`relative bg-linear-to-br ${option.gradient} rounded-lg border ${option.border} ${option.hoverBorder} shadow-sm hover:shadow-lg transition-all duration-300 p-8 flex flex-col gap-6 group`}>
              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-white dark:bg-(--dark-body) shadow-sm flex items-center justify-center border border-slate-100 dark:border-none group-hover:scale-110 transition-transform duration-300">{option.icon}</div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{option.title}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{option.description}</p>
              </div>

              {/* Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!option.isLoading) option.action();
                }}
                className={`${option.buttonClass} h-11 px-5 rounded-lg font-semibold flex items-center gap-2 w-fit transition-all active:scale-95 disabled:opacity-50`}
              >
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                {option.buttonLabel}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker;
