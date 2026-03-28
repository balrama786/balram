"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FaqSection } from "../../types/landingPage";

interface FaqProps {
  data: FaqSection;
}

const Faq: React.FC<FaqProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = (data.faqs || []).map((f) => f._id).filter(Boolean);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className="py-[calc(30px+(100-30)*((100vw-320px)/(1920-320)))] bg-transparent min-h-screen flex items-center justify-center pb-0">
      <div className="mx-[calc(16px+(50-16)*((100vw-320px)/(1920-320)))] w-full">
        <div className="faq-image p-6 sm:p-10 md:p-16 lg:p-20 px-[calc(20px+(145-20)*((100vw-320px)/(1920-320)))] flex flex-col rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] lg:flex-row gap-10 items-start overflow-hidden relative">
          {/* Left Content */}
          <div className="grid grid-cols-1 min-[1200px]:grid-cols-3 gap-[calc(0px+(40-0)*((100vw-320px)/(1920-320)))] w-full">
            <div className="space-y-6 z-10 min-[1200px]:col-span-1 [@media(max-width:1200px)]:text-center">
              <span className="text-primary font-semibold tracking-wider text-[16px] uppercase">{data.badge || "Faqs"}</span>
              <h2 className="text-[calc(20px+(46-20)*((100vw-320px)/(1920-320)))] font-bold text-white leading-tight whitespace-pre-wrap">{data.title}</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{data.description}</p>

              {/* Blob with Question Mark SVG */}
              <div className="relative mt-12 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center mx-auto min-[1200px]:mx-0 [@media(max-width:1200px)]:hidden">
                <svg width="490" height="448" viewBox="0 0 498 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M259.209 30.2313C194.121 -0.450096 151.928 44.808 139.6 74.9121L142 80.5C146.438 139.883 81.696 162.813 49.645 165.081C0.335831 175.473 -0.0750904 226.114 7.7322 247.97C20.327 283.229 32.7977 307.972 35.4686 319.107C32.5101 375.026 38.345 398.078 41.6323 402.615C77.1349 466.947 140.251 452.101 167.371 436.636C214.708 400.512 252.84 403.439 265.989 409.419C313.326 443.07 355.979 445.297 371.388 442.204C451.269 415.481 437.133 351.067 420.08 322.2C398.878 265.785 428.915 210.031 446.584 189.206C495.893 113.492 470.006 67.7583 450.899 54.3558C431.175 30.6024 373.237 53.3249 341.186 68.5831C318.38 75.3875 271.947 43.0153 259.209 30.2313Z" fill="url(#paint0_linear_132_472)" />
                  <path d="M270.5 18.0939C203.996 -22.5333 142.917 34.0904 142.917 69.2899C144 133.569 84.8303 153.524 51.4863 155.881C0.188019 166.682 -0.239477 219.313 7.88276 242.029C20.9856 278.674 36.7381 278.537 36.7381 315.961C33.6602 374.079 39.7305 398.037 43.1504 402.752C80.0851 469.613 145.747 454.183 173.961 438.111C223.207 400.566 254.5 394.159 276.558 409.824C325.804 444.797 370.177 447.112 386.208 443.897C469.311 416.124 454.606 349.178 436.865 319.176C414.807 260.544 446.056 202.598 464.438 180.954C515.736 102.264 488.805 54.7329 468.926 40.8035C448.407 16.1165 388.132 39.7321 354.788 55.5901C331.062 62.662 296.5 35.5903 270.5 18.0939Z" fill="#059669" fillOpacity="0.1" stroke="url(#paint1_linear_132_472)" strokeWidth="8" />
                  <path d="M234.551 265.837V261.301C234.551 255.42 235.473 250.127 237.318 245.423C239.331 240.718 241.846 236.35 244.865 232.317C248.051 228.117 251.322 224.168 254.676 220.472C258.03 216.775 261.216 212.995 264.235 209.13C267.421 205.266 269.937 201.317 271.782 197.285C273.626 193.084 274.549 188.463 274.549 183.423C274.549 177.71 273.375 172.921 271.027 169.057C268.679 165.192 265.409 162.336 261.216 160.488C257.191 158.64 252.412 157.715 246.877 157.715C237.486 157.715 230.107 160.404 224.74 165.78C219.374 171.157 216.69 178.13 216.69 186.699H186C186 175.61 188.516 165.865 193.547 157.463C198.746 149.062 206.041 142.593 215.432 138.057C224.824 133.352 235.809 131 248.387 131C258.114 131 266.583 132.176 273.794 134.528C281.173 136.881 287.295 140.241 292.158 144.61C297.189 148.978 300.879 154.187 303.227 160.236C305.742 166.285 307 173.005 307 180.398C307 187.287 305.91 193.42 303.73 198.797C301.717 204.173 299.034 209.13 295.68 213.667C292.326 218.203 288.72 222.488 284.863 226.52C281.173 230.385 277.651 234.249 274.297 238.114C271.111 241.978 268.428 245.927 266.247 249.959C264.067 253.824 262.977 258.108 262.977 262.813V265.837H234.551ZM233.545 317V286.756H264.235V317H233.545Z" fill="#059669" />
                  <defs>
                    <linearGradient id="paint0_linear_132_472" x1="296.5" y1="59" x2="218" y2="437" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#059669" stopOpacity="0.3" />
                      <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_132_472" x1="249" y1="3.99998" x2="81.0583" y2="337.554" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#059669" />
                      <stop offset="1" stopColor="#122727" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Right Content - Accordion */}
            <div className="flex-1 w-full space-y-4 z-10 min-[1200px]:col-span-2 max-h-[810px] overflow-auto custom-scrollbar">
              {faqs.map((item, index) => (
                <div key={index} className={`transition-all duration-300 faq-box overflow-hidden rounded-[10px] ${activeIndex === index ? "bg-primary border-transparent" : "bg-[#122727] border-[#ffffff20] hover:border-[#31F06F40]"}`}>
                  <button onClick={() => toggleAccordion(index)} className={`w-full flex items-center justify-between p-[calc(8px+(20-8)*((100vw-320px)/(1920-320)))] md:p-6 text-left transition-colors duration-300 rounded-[10px] ${activeIndex === index ? "bg-[#c8f0e0] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-none rounded-br-none" : "bg-[#122727]"} `}>
                    <div className="flex items-center gap-4">
                      <span className={`p-1 rounded-full transition-colors ${activeIndex === index ? "text-primary" : "text-primary"}`}>{activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}</span>
                      <span className={`font-semibold text-[18px] transition-colors ${activeIndex === index ? "text-[#0A2A22]" : "text-white"}`}>{item.title}</span>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-colors duration-300 ${activeIndex === index ? "max-h-96 pb-[calc(12px+(24-12)*((100vw-320px)/(1920-320)))] px-[calc(12px+(24-12)*((100vw-320px)/(1920-320)))] sm:px-10 lg:px-14 bg-[#c8f0e0] rounded-tl-none rounded-tr-none rounded-bl-[10px] rounded-br-[10px]" : "max-h-0 bg-primary "}`}>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
