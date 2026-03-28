"use client";

import Logo1 from "@/public/assets/logos/logo1.png";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Images from "../../shared/Image";
import { FooterSection } from "../../types/landingPage";
import { ROUTES } from "@/src/constants";

interface HeaderProps {
  data: FooterSection;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { app_name, logo_dark_url } = useAppSelector((state) => state.setting);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sections = ["home", "features", "support", "pricing", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "Features", href: "features" },
    { name: "Support", href: "support" },
    { name: "Pricing", href: "pricing" },
    { name: "Contact", href: "contact" },
    // { name: "Documents", href: "documents" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className={`xl:px-48.75 px-6 flex items-center justify-between py-3 border-b border-[#ffffff15] transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-[#0a2a20]" : ""}`}>
        <div className="flex items-center gap-28">
          <Link href="/" className="flex items-center gap-2">
            <Images src={logo_dark_url || Logo1} alt={`${app_name || "wapi"} logo`} width={100} height={40} unoptimized />
          </Link>
        </div>

        <nav className="hidden min-[1200px]:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;

            return (
              <a
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`relative text-[20px] font-medium transition-colors cursor-pointer
        ${isActive ? "text-white!" : "text-slate-300! hover:text-primary"}`}
              >
                {link.name}

                {isActive && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-1 h-1 bg-primary rounded-full absolute -top-2" />
                    <div className="w-5 h-0.5 bg-primary rounded-full mt-2 relative -top-0.75" />
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden min-[1200px]:block">
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-10 py-4 h-11 rounded-xl font-semibold text-[16px] transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => {
                if (isAuthenticated) {
                  router.push(user?.role === "agent" ? "/chat" : ROUTES.Dashboard);
                } else {
                  router.push(ROUTES.Login);
                }
              }}
            >
              {isAuthenticated ? "Get Started" : "Sign In"}
            </Button>
          </div>

          <button className="min-[1200px]:hidden text-white p-2 hover:bg-[#ffffff10] rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 min-[1200px]:hidden" onClick={() => setIsMenuOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-75 max-w-[80%] bg-[#0a2a20] z-50 shadow-2xl transition-transform duration-300 ease-in-out min-[1200px]:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Images src={logo_dark_url || Logo1} alt={`${app_name || "wapi"} logo`} width={100} height={35} unoptimized />
            </Link>
            <button className="text-white p-2 hover:bg-[#ffffff10] rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;

              return (
                <a
                  key={link.name}
                  onClick={() => {
                    scrollToSection(link.href);
                    setIsMenuOpen(false);
                  }}
                  className={`text-[17px] font-medium transition-colors hover:text-[#059669]
        ${isActive ? "text-[#059669]" : "text-white/80"}`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="mt-6">
              <Button
                className="bg-[#059669] hover:bg-[#059669]/90 text-white w-full h-12 rounded-2xl font-semibold text-[16px]"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push(user?.role === "agent" ? "/chat" : ROUTES.Dashboard);
                  } else {
                    router.push(ROUTES.Login);
                  }
                }}
              >
                {isAuthenticated ? "Get Started" : "Sign In"}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
