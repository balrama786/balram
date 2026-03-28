"use client";

import React from "react";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { FooterSection } from "../../types/landingPage";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Images from "@/src/shared/Image";
import Logo1 from "@/public/assets/logos/logo1.png";

interface FooterProps {
  data: FooterSection;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  const router = useRouter();
  const socialLinks = data.social_links && data.social_links[0] ? data.social_links[0] : null;
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { app_name, logo_dark_url } = useAppSelector((state) => state.setting);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const socialLinksArray = [
    { icon: <Twitter size={16} />, label: "Twitter", href: socialLinks?.twitter || "#" },
    { icon: <Facebook size={16} />, label: "Facebook", href: socialLinks?.facebook || "#" },
    { icon: <Instagram size={16} />, label: "Instagram", href: socialLinks?.instagram || "#" },
    { icon: <Linkedin size={16} />, label: "LinkedIn", href: socialLinks?.linkedin || "#" },
  ].filter((link) => link.href !== "#" || link.label === "Twitter");

  return (
    <footer className="footer rounded-t-3xl px-6 md:px-12 lg:px-[calc(20px+(243-20)*((100vw-320px)/(1920-320)))] pt-12 pb-8 text-white bg-[#0a2a20]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))] pb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Images src={logo_dark_url || Logo1} alt={`${app_name || "wapi"} logo`} width={100} height={100} />
          </Link>
        </div>

        <div className="flex gap-[25px] flex-wrap justify-end">
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
            {socialLinksArray.map(({ icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center">{icon}</div>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row gap-y-[calc(16px+(64-16)*((100vw-320px)/(1920-320)))] lg:gap-y-0">
        <div className="hidden lg:block absolute inset-y-0 border-r border-white/10 pointer-events-none" style={{ left: "41.67%", height: "calc(100% + 49px)" }} />

        <div className="flex flex-col gap-[calc(8px+(28-8)*((100vw-320px)/(1920-320)))] pt-10 lg:pr-16 w-full lg:w-5/12 shrink-0 [@media(max-width:576px)]:justify-center [@media(max-width:576px)]:text-center [@media(max-width:576px)]:items-center">
          <h2 className="text-[calc(20px+(46-20)*((100vw-320px)/(1920-320)))] font-extrabold leading-tight whitespace-pre-wrap">{data.cta_title}</h2>
          <p className="text-[16px] text-white/50 leading-relaxed whitespace-pre-wrap">{data.cta_description}</p>

          <div className="flex gap-3 flex-wrap [@media(max-width:347px)]:justify-center">
            {data.cta_buttons?.map((btn, idx) => (
              <button
                key={idx}
                className={idx === 0 ? "bg-primary hover:bg-primary text-white font-bold text-sm py-3 px-7 rounded-xl transition-colors" : "bg-transparent border-2 border-primary hover:bg-primary text-white font-bold text-sm py-3 px-7 rounded-xl transition-colors"}
                onClick={() => {
                  if (isAuthenticated) {
                    const isAgent = user?.role === "agent";
                    const targetLink = isAgent ? "/chat" : btn.link;
                    router.push(targetLink);
                  } else {
                    router.push(ROUTES.Login);
                  }
                }}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:gap-y-10 pt-4 lg:pt-10 flex-1 lg:pl-16 columns-3">
          {["Home", "Features", "Support", "Pricing", "Testimonials", "Faqs"].map((col, i) => (
            <div key={i} className="flex flex-col gap-2 mb-5">
              <a onClick={() => scrollToSection(col.toLowerCase())} className="text-[16px] text-white hover:text-primary transition-colors">
                {col}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[18px] text-white">© {data.copy_rights_text || `${app_name || "Wapi"} 2026. All Rights Reserved.`}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[18px] text-white">
          <a href="#" className="hover:text-white transition-colors">
            Terms & Conditions
          </a>
          <span className="text-white">|</span>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <span className="text-white">|</span>
          <a href="#" className="hover:text-white transition-colors">
            Trust
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
