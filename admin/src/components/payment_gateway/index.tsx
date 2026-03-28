"use client";

import { useState } from "react";
import PaymentGatewayHeader from "./PaymentGatewayHeader";
import StripeForm from "./StripeSettings";
import RazorpayForm from "./RazorpaySettings";

type GatewayId = "stripe" | "razorpay";

const gateways: { id: GatewayId; name: string; icon: React.ReactNode }[] = [
  {
    id: "stripe",
    name: "Stripe",
    icon: (
      <svg viewBox="0 0 32 22" className="w-8 h-5" fill="none">
        <rect width="32" height="22" rx="4" fill="#635BFF" />
        <path d="M8.3 9.1c0-.6.5-.8 1.3-.8 1.2 0 2.6.3 3.8 1V6.2c-1.3-.5-2.5-.7-3.8-.7-3.1 0-5.2 1.6-5.2 4.3 0 4.2 5.8 3.5 5.8 5.3 0 .7-.6.9-1.5.9-1.3 0-3-.5-4.3-1.3v3c1.4.7 2.9.9 4.3.9 3.1 0 .9-1.5 5.2-3.7.1-4.5-5.6-3.6-5.6-5.8z" fill="#fff" transform="translate(4, 2) scale(0.85)" />
      </svg>
    ),
  },
  {
    id: "razorpay",
    name: "Razorpay",
    icon: (
      <svg viewBox="0 0 52 22" className="w-12 h-5" fill="none">
        <rect width="52" height="22" rx="4" fill="#072654" />
        <text x="8" y="15" fontSize="9" fontWeight="bold" fill="#3395FF" fontFamily="sans-serif">
          Rzp
        </text>
        <path d="M30 5l4 12-3-3-4 3 3-12z" fill="#3395FF" transform="translate(6, 0) scale(0.9)" />
      </svg>
    ),
  },
];

const PaymentGatewayContainer = () => {
  const [activeGateway, setActiveGateway] = useState<GatewayId>("stripe");

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <PaymentGatewayHeader onRefresh={handleRefresh} isLoading={false} isFetching={false} />

      <div className="bg-white dark:bg-(--card-color) border border-(--input-border-color) dark:border-(--card-border-color) rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-(--input-border-color) dark:border-(--card-border-color)">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Payment Provider</p>
          <div className="flex flex-wrap gap-3">
            {gateways.map((gw) => {
              const isActive = activeGateway === gw.id;
              return (
                <button key={gw.id} onClick={() => setActiveGateway(gw.id)} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive ? "border-(--text-green-primary) bg-(--text-green-primary)/5 text-slate-800 dark:text-slate-100 shadow-sm" : "border-(--input-border-color) dark:border-(--card-border-color) text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-(--card-border-color) bg-transparent"}`}>
                  {gw.icon}
                  <span>{gw.name}</span>
                  {isActive && <span className="ml-1 w-2 h-2 rounded-full bg-(--text-green-primary) inline-block" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Form Panel */}
        <div className="p-6">
          {activeGateway === "stripe" && <StripeForm />}
          {activeGateway === "razorpay" && <RazorpayForm />}
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayContainer;
