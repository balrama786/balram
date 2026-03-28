"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const TapTop = () => {
    const [visible, setVisible] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`fixed bottom-8 right-8 z-50 w-[calc(40px+(52-40)*((100vw-320px)/(1920-320)))] h-[calc(40px+(52-40)*((100vw-320px)/(1920-320)))] rounded-xl flex items-center justify-center border-none cursor-pointer animate-bounce transition-all duration-500 ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}
        style={{
          background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
          boxShadow: hover ? "0 8px 32px rgba(5, 150, 105, 0.5), 0 0 60px rgba(5, 150, 105, 0.25)" : "0 4px 24px rgba(5, 150, 105, 0.35), 0 0 40px rgba(5, 150, 105, 0.15)",
          transform: hover ? "translateY(-3px) scale(1.08)" : visible ? "translateY(0)" : "translateY(20px)",
        }}
        aria-label="Scroll to top"
      >
        {/* Glass overlay */}
        <span
          className="absolute inset-px rounded-[15px] pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
          }}
        />
        <ArrowUp size={20} className="text-white relative z-10" strokeWidth={2.5} />
      </button>
    );
};

export default TapTop;
