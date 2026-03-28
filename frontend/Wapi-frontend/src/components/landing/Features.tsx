"use client";

import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Images from "../../shared/Image";
import { FeaturesSection } from "../../types/landingPage";
import { useAppSelector } from "@/src/redux/hooks";
import { ROUTES } from "@/src/constants";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string | undefined;
  image: string | undefined;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, image }) => {
  return (
    <div className="group feature-box relative rounded-[32px] p-3 ">
      <div className="mb-5 max-w-117.5 max-h-75 aspect-4/3 w-full overflow-hidden rounded-[24px] border border-[#F0FDF4] bg-white shadow-inner relative z-10">
        <Images src={image || "/assets/images/default3.png"} alt={title} className="w-full max-w-117.5 max-h-75 h-full object-cover" width={400} height={300} />
      </div>

      <div className="px-2 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <BadgePlus />
          </div>
          <h4 className="text-[calc(15px+(26-15)*((100vw-320px)/(1920-320)))] font-bold text-[#0F172A]">{title}</h4>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-[#64748B]">{description}</p>
      </div>
    </div>
  );
};

interface FeaturesProps {
  data: FeaturesSection;
}

const Features: React.FC<FeaturesProps> = ({ data }) => {
  const route = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const features = data.features || [];
  const col1 = features.slice(0, Math.ceil(features.length / 3));
  const col2 = features.slice(Math.ceil(features.length / 3), Math.ceil((features.length / 3) * 2));
  const col3 = features.slice(Math.ceil((features.length / 3) * 2));

  return (
    <section id="features" className="relative overflow-hidden bg-[linear-gradient(180deg,#F0FDF9_0%,#FFFFFF_100%)] py-[calc(30px+(100-30)*((100vw-320px)/(1920-320)))] pb-0">
      <div className="relative z-10 mx-[calc(16px+(195-16)*((100vw-320px)/(1920-320)))]">
        <div className="p-4 text-center">
          <span className="text-[16px] font-bold uppercase tracking-wider text-primary">{data.badge || "Features"}</span>
          <h2 className="mt-3 text-[clamp(1.5rem,1rem+2.5vw,2.875rem)] font-extrabold tracking-tight text-[#0F172A] whitespace-pre-wrap">{data.title}</h2>
          <p className="mt-5 text-sm leading-relaxed text-[#64748B] md:mx-0 whitespace-pre-wrap">{data.description}</p>
          {data.cta_button?.text && (
            <button
              className="mt-6 w-full rounded-xl bg-primary px-10 py-4 text-[16px] font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#047857] sm:w-auto"
              onClick={() => {
                if (isAuthenticated) {
                  const isAgent = user?.role === "agent";
                  const targetLink = isAgent ? "/chat" : data.cta_button.link;
                  route.push(targetLink);
                } else {
                  route.push(ROUTES.Login);
                }
              }}
            >
              {data.cta_button.text}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-6 sm:gap-8">
            {col1.map((feature, idx) => (
              <FeatureCard key={idx} title={feature.title} description={feature.description} icon={feature.icon} image={feature?.image} />
            ))}
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 lg:mt-16">
            {col2.map((feature, idx) => (
              <FeatureCard key={idx} title={feature.title} description={feature.description} icon={feature.icon} image={feature?.image} />
            ))}
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 md:col-span-2 md:grid md:grid-cols-2 lg:col-span-1 lg:flex lg:flex-col">
            {col3.map((feature, idx) => (
              <FeatureCard key={idx} title={feature.title} description={feature.description} icon={feature.icon} image={feature?.image} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
