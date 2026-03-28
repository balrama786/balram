"use client";

import { Button } from "@/src/elements/ui/button";
import CommonHeader from "@/src/shared/CommonHeader";
import { ArrowRight, BotMessageSquare, ExternalLink, Link } from "lucide-react";
import { useRouter } from "next/navigation";

const ToolCard = ({
  title,
  description,
  icon: Icon,
  onIntegrate,
  onManage,
  accentColor = "emerald",
}: {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onIntegrate: () => void;
  onManage: () => void;
  accentColor?: "emerald" | "indigo" | "purple" | "blue";
}) => {
  const colors = {
    emerald: "from-emerald-500/10 to-teal-500/5 text-emerald-600 border-emerald-100 dark:border-emerald-500/20",
    indigo: "from-indigo-500/10 to-blue-500/5 text-indigo-600 border-indigo-100 dark:border-indigo-500/20",
    purple: "from-purple-500/10 to-violet-500/5 text-purple-600 border-purple-100 dark:border-purple-500/20",
    blue: "from-blue-500/10 to-sky-500/5 text-blue-600 border-blue-100 dark:border-blue-500/20",
  }[accentColor];

  const buttonColors = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
  }[accentColor];

  return (
    <div className={`group relative bg-white dark:bg-(--card-color) rounded-lg border sm:p-8 p-4 shadow transition-all hover:shadow-md dark:hover:shadow-none ${colors.split(" ")[2]}`}>
      {/* <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br transition-opacity opacity-0 group-hover:opacity-100 blur-3xl rounded-full -mr-16 -mt-16 ${colors.split(" ").slice(0, 2).join(" ")}`} /> */}

      <div className="relative z-10 space-y-6">
        <div className={`w-14 h-14 rounded-xl bg-linear-to-br flex items-center justify-center ${colors.split(" ").slice(0, 2).join(" ")}`}>
          <Icon size={28} className={colors.split(" ")[2]} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={onManage} className="flex-1 flex items-center gap-2 px-6 py-5.5 bg-slate-50 dark:bg-(--page-body-bg) text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-md text-sm font-bold transition-all border border-slate-200 dark:border-none">
            Manage
            <ExternalLink size={16} className="opacity-50" />
          </Button>
          <Button onClick={onIntegrate} className={`flex-1 flex items-center gap-2 px-6 py-5.5 text-white rounded-md text-sm font-bold transition-all shadow-lg active:scale-95 ${buttonColors}`}>
            <Icon size={16} />
            Integrate
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ToolsPage = () => {
  const router = useRouter();

  const tools = [
    {
      title: "WhatsApp Website Widget",
      description: "Drive WhatsApp sales and support with personalized CTAs on your website. Easy to integrate and customize.",
      icon: BotMessageSquare,
      accentColor: "emerald" as const,
      onIntegrate: () => router.push("/tools/widget"),
      onManage: () => router.push("/tools/widgets"),
    },
    {
      title: "WhatsApp Link Generator",
      description: "Create shareable links and QR codes for your WA business number to start conversations instantly.",
      icon: Link,
      accentColor: "emerald" as const,
      onIntegrate: () => router.push("/tools/link-generator"),
      onManage: () => router.push("/tools/links"),
    },
  ];

  return (
    <div className="sm:p-8 p-4 space-y-10">
      <CommonHeader title="Tools" description="Powerful utilities to enhance your WhatsApp Business integration and customer reach." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {tools.map((tool, idx) => (
          <ToolCard key={idx} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
