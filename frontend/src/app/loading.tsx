"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { motion, AnimatePresence } from "framer-motion";

const Loading = () => {
  const { app_name, userSetting } = useAppSelector((state) => state.setting);

  return (
    <div className="fixed inset-0 z-100 bg-[#fafafa] dark:bg-[#011314] flex items-center justify-center font-sans overflow-hidden">
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {app_name || userSetting?.data?.app_name || "WAPI"}
              <span className="text-primary italic">.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 dark:text-slate-500 pl-1">
              One and only {app_name}
            </motion.p>
          </div>

          <div className="relative w-40 h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-1/3 h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Loading;
