"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface MaintenancePageProps {
  title: string;
  message: string;
  imageUrl?: string;
}

const MaintenancePage = ({ title, message, imageUrl }: MaintenancePageProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050b18]">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-150 h-150 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-150 h-150 bg-purple-600/15 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content card */}
      <div className="relative z-10 max-w-xl w-full mx-4">
        <div className="relative bg-white/3 backdrop-blur-2xl border border-white/10 rounded-lg sm:p-8 p-4 shadow-2xl text-center overflow-hidden">
          {/* Decorative top shine */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          {/* Icon / Image */}
          <div className="flex justify-center mb-8">
            {imageUrl ? (
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl shadow-primary/10">
                <Image src={imageUrl} alt="Maintenance" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="relative">
                {/* Spinning rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin animation-duration-[8s]" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30 animate-spin animation-duration-[5s] direction-[reverse]" />
                <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Scheduled Maintenance</span>
          </div>

          {/* Title */}
          <h1 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))]! font-black text-white mb-4 leading-tight tracking-tight">{title}</h1>

          {/* Message */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto font-medium">{message}</p>

          {/* Divider */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Live clock */}
          <div className="space-y-1">
            <p className="text-2xl font-mono font-bold text-white tabular-nums tracking-widest">{formatTime(currentTime)}</p>
            <p className="text-xs text-slate-500 font-medium">{formatDate(currentTime)}</p>
          </div>

          {/* Progress animation bar */}
          <div className="mt-8 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-primary/60 via-primary to-primary/60 rounded-full animate-[maintenance-progress_3s_ease-in-out_infinite]" />
          </div>

          {/* Footer note */}
          <p className="mt-6 text-[11px] text-slate-600 font-medium">We apologize for any inconvenience. Normal service will resume shortly.</p>

          {/* Decorative bottom shine */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Floating dots */}
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary/30 blur-sm animate-bounce [animation-delay:0.5s]" />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full bg-purple-500/30 blur-sm animate-bounce [animation-delay:1s]" />
      </div>

      {/* CSS for progress bar */}
      <style jsx>{`
        @keyframes maintenance-progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
