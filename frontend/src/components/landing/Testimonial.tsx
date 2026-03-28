"use client";

import { Quote, Star } from "lucide-react";
import React, { useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Images from "../../shared/Image";
import { TestimonialPopulated, TestimonialsSection } from "../../types/landingPage";

interface TestimonialProps {
  data: TestimonialsSection;
}

const Testimonial: React.FC<TestimonialProps> = ({ data }) => {
  const testimonials = (data.testimonials || []).map((item) => item._id).filter((item): item is TestimonialPopulated => !!item && typeof item === "object");

  const testimonialsFinal = testimonials.length === 4 ? [...testimonials, ...testimonials] : testimonials;

  const [activeIndex, setActiveIndex] = useState(0);

  if (testimonialsFinal.length === 0) return null;

  return (
    <section id="testimonials" className="bg-[#fafffd] py-[calc(30px+(100-30)*((100vw-320px)/(1920-320)))] overflow-hidden px-0 pb-0">
      <div className="mx-[calc(16px+(195-16)*((100vw-320px)/(1920-320)))] overflow-hidden">
        <div className="text-center mb-[calc(12px+(35-12)*((100vw-320px)/(1920-320)))]">
          <span className="text-[16px] font-bold uppercase tracking-[0.45em] text-primary">{data.badge || "Testimonials"}</span>
          <h2 className="mt-2.5 text-[clamp(1.5rem,1rem+2.5vw,2.875rem)] max-w-[calc(288px+(830-288)*((100vw-320px)/(1920-320)))] font-extrabold leading-[1.2] tracking-tight text-[#1a2b3b] mx-auto whitespace-pre-wrap">{data.title}</h2>
        </div>

        <div className="relative pb-2 sm:pb-4">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            centeredSlides={true}
            loop={testimonialsFinal.length > 3}
            speed={800}
            grabCursor={true}
            watchSlidesProgress={true}
            observer={true}
            observeParents={true}
            onRealIndexChange={(swiper) => {
              setActiveIndex(swiper.realIndex % testimonials.length);
            }}
            autoplay={testimonialsFinal.length > 1 ? { delay: 3000, disableOnInteraction: false } : false}
            breakpoints={{
              320: { slidesPerView: Math.min(1, testimonialsFinal.length), spaceBetween: 20 },
              640: { slidesPerView: Math.min(1.5, testimonialsFinal.length), spaceBetween: 25 },
              768: { slidesPerView: Math.min(2, testimonialsFinal.length), spaceBetween: 30 },
              1024: { slidesPerView: Math.min(3, testimonialsFinal.length), spaceBetween: 40 },
            }}
            className="testimonial-swiper"
          >
            {testimonialsFinal.map((item, idx) => (
              <SwiperSlide key={idx} className="h-auto! py-10 px-2 sm:px-4">
                {({ isActive }) => (
                  <div
                    className={`feature-box transition-all duration-700 ease-in-out h-full max-w-[470px] max-h-[416px]
                      ${isActive ? "md:translate-y-4 scale-105 z-10 opacity-100" : "md:-translate-y-4 scale-95 opacity-50"}
                    `}
                  >
                    <div className="testimonial-card bg-white rounded-4xl p-7 h-full flex flex-col shadow-[0_16px_60px_rgba(15,184,129,0.12)] relative ">
                      <div className="mb-6">
                        <div className="bg-primary w-13 h-13 rounded-[14px] flex items-center justify-center shadow-[0_6px_20px_rgba(15,184,129,0.25)]">
                          <Quote className="text-white fill-white transform scale-x-[-1]" size={24} strokeWidth={0} />
                        </div>
                      </div>

                      <p className="text-[#64748b] text-[18px] mb-5 grow font-regular">{item.description}</p>

                      <div className="flex items-center gap-3">
                        <Images src={item?.user_image} alt={item?.user_name || "image"} className="w-10 h-10 max-w-[40px] max-h-[40px] rounded-full object-cover shrink-0" width={100} height={100} unoptimized />
                        <div>
                          <h4 className="font-bold text-[#1a2b3b] text-[16px] leading-tight">{item.user_name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[16px] text-[#64748b] italic">{item.user_post}</span>
                            <Star size={12} className="fill-[#facb15] text-[#facb15] ml-1 shrink-0" />
                            <span className="text-[13px] font-bold text-[#1a2b3b]">{item.rating?.toFixed(1) || "5.0"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Fully custom pagination — no Swiper pagination module */}
          <div className="flex justify-center gap-2 mt-16">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 cursor-pointer
                  ${activeIndex === i ? "w-6 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
