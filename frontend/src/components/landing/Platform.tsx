"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PlatformSection } from "../../types/landingPage";
import Images from "../../shared/Image";

interface PlatformProps {
  data: PlatformSection;
}

const Platform: React.FC<PlatformProps> = ({ data }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = data.items || [];

  useGSAP(() => {
    if (progressRef.current && steps.length > 0) {
      const progress = (activeStep + 1) / steps.length;
      gsap.to(progressRef.current, {
        width: `${progress * 100}%`,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [activeStep, steps.length]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    swiperRef.current?.slideTo(index);
  };

  if (steps.length === 0) return null;

  return (
    <section id="support" className="bg-white py-[calc(30px+(100-30)*((100vw-320px)/(1920-320)))]">
      <div className="mx-[calc(16px+(50-16)*((100vw-320px)/(1920-320)))]">
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] bg-[#021F19] px-4 pt-6 sm:px-8 sm:pt-8 lg:px-16 lg:pt-12 pb-0">
          <div className="relative z-10 text-center mb-8 lg:mb-10 flex justify-center flex-col items-center">
            <span className="sm:text-[16px] text-[15px] font-bold uppercase tracking-[0.2em] text-primary">{data.badge || "Platform"}</span>
            <h2 className="mt-3 text-[clamp(1.5rem,1rem+2.5vw,2.875rem)] font-extrabold tracking-[1] text-white whitespace-pre-wrap max-w-212.5 break-all">{data.title}</h2>
          </div>

          <div className="relative z-10 grid [@media(max-width:1200px)]:grid-cols-1 gap-8 grid-cols-2 lg:gap-12">
            <div className="relative w-full overflow-hidden rounded-t-[24px] sm:rounded-t-[32px] bg-white/2 shadow-2xl platform-border h-65 sm:h-90 lg:h-120">
              <Swiper
                loop
                // autoplay={{
                //   delay: 3000,
                //   disableOnInteraction: false,
                //   pauseOnMouseEnter: true,
                // }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveStep(swiper.realIndex)}
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                slidesPerView={1}
                pagination={{ clickable: true }}
                onAutoplayStart={() => console.log("AUTOPLAY STARTED")}
                className="h-full w-full platform-swiper cursor-grab active:cursor-grabbing"
              >
                {steps.map((step, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative h-full w-full">
                      <Images src={step?.image || "/assets/images/default3.png"} alt={step.title} fill className="object-cover rounded-tr-[24px] max-w-237.5 max-h-134 rounded-tl-[24px] [@media(max-width:1200px)]:rounded-[24px] bg-[#021F19]" priority={index === 0} unoptimized />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex flex-col gap-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] lg:pl-8 pb-8 sm:pb-12 lg:pb-16">
              {steps.length > 1 && (
                <div className="relative flex items-center justify-between py-4">
                  <div className="absolute left-0 right-0 top-1/2 h-0.75 sm:h-1 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(5,150,105,0)_0%,#059669_50%,rgba(5,150,105,0)_100%)]" />
                  <div ref={progressRef} className="absolute left-0 top-1/2 h-0.75 sm:h-1 w-0 -translate-y-1/2 bg-primary/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] z-0" />

                  {steps.map((step, i) => (
                    <button
                      key={i}
                      onClick={() => handleStepClick(i)}
                      className={`relative z-10 flex h-8.5 w-8.5 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full text-[10px] sm:text-[12px] lg:text-[13px] font-bold transition-all duration-500
                      ${i === activeStep ? "bg-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]" : i < activeStep ? "bg-primary text-white" : "bg-[#0F172A] text-white border border-white/10"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              )}

              <div className="min-h-30 sm:min-h-35 lg:min-h-40">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{steps[activeStep].tagline}</span>
                <h3 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-white max-w-190.75 break-all">{steps[activeStep].title}</h3>
                <p className="mt-3 text-white/60 text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed">{steps[activeStep].description}</p>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {(steps[activeStep].bullets || []).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] sm:text-[14px] text-white/80">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary break-all" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platform;
