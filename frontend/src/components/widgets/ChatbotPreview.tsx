import { WidgetData } from "@/src/types/widget";
import { MessageSquare, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/utils";
import { useAppSelector } from "@/src/redux/hooks";

interface ChatbotPreviewProps {
  data: Partial<WidgetData>;
  bodyBgImagePreview?: string | null;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ data, bodyBgImagePreview }) => {
  const { app_name } = useAppSelector((state) => state.setting);
  const [isOpen, setIsOpen] = useState(data.default_open_popup || false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widgetImage = data.widget_image as any;
    if (widgetImage instanceof File) {
      const url = URL.createObjectURL(widgetImage);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof data.widget_image === "string") {
      setLogoPreview(data.widget_image);
    } else {
      setLogoPreview(null);
    }
  }, [data.widget_image]);

  useEffect(() => {
    if (data.default_open_popup !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(data.default_open_popup);
    }
  }, [data.default_open_popup]);

  return (
    <div className={cn("relative w-full max-w-[320px] flex flex-col justify-end gap-2 select-none pb-2", data.widget_position === "bottom-left" ? "items-start" : "items-end")}>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95, originY: 1 }} animate={{ opacity: 1, y: 0, scale: 1, originY: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95, originY: 1 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full h-112.5 rounded-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 z-10">
            <div
              className="flex items-center gap-3 px-4 py-4 shrink-0"
              style={{
                backgroundColor: data.header_background_color || "#059669",
                color: data.header_text_color || "#ffffff",
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden relative">{logoPreview ? <Image src={logoPreview} alt="logo" fill className="object-cover" unoptimized /> : <MessageSquare size={18} />}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight truncate">{data.header_text || "Chat with us"}</p>
                <p className="text-[10px] opacity-80 mt-0.5 font-medium">Welcome to our live chat</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </div>

            <div
              className="flex-1 p-4 flex flex-col justify-between overflow-auto custom-scrollbar"
              style={{
                backgroundColor: bodyBgImagePreview ? undefined : data.body_background_color || "#f0faf6",
                backgroundImage: bodyBgImagePreview ? `url(${bodyBgImagePreview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="rounded-2xl rounded-tl-none px-4 py-3 text-[13px] leading-relaxed shadow-sm max-w-[90%] border border-black/5"
                style={{
                  backgroundColor: data.welcome_text_background || "#ffffff",
                  color: data.welcome_text_color || "#1a2a2a",
                }}
              >
                <p className="whitespace-pre-wrap font-medium break-all">{data.welcome_text || "Welcome! How can we help you today?"}</p>
                <p className="text-right text-[9px] opacity-40 mt-1 font-bold">{time}</p>
              </div>

              <div className="pt-2 pb-1 shrink-0">
                <button
                  className="w-full py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/10 hover:brightness-110"
                  style={{
                    backgroundColor: data.start_chat_button_background || "#059669",
                    color: data.start_chat_button_text_color || "#ffffff",
                  }}
                >
                  {data.start_chat_button_text || "Start Chat on WhatsApp"}
                </button>
                <p className="text-center text-[10px] mt-2.5 font-semibold">
                  ⚡ by <span className="text-primary dark:text-primary">{app_name}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-20">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer relative border-2 border-white dark:border-slate-800 transition-colors" style={{ backgroundColor: data.widget_color || "#059669" }}>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={26} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {logoPreview ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={logoPreview} alt="widget" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <MessageSquare size={26} className="text-white" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-[3px] border-white dark:border-slate-800 animate-pulse" />}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotPreview;
