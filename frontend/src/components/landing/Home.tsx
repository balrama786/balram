"use client";

import { Button } from "@/src/elements/ui/button";
import { HeroSection } from "../../types/landingPage";
import Images from "../../shared/Image";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants";

interface HomeProps {
  data: HeroSection;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  return (
    <section id="home" className="home-section relative min-h-screen flex flex-col items-center pt-40 [@media(max-width:1333px)]:pt-31.25 pb-0 overflow-hidden [@media(max-width:660px)]:rounded-0">
      {/* Hero Content */}
      <div className="relative z-30 justify-center flex flex-col items-center text-center sm:px-6 px-0 mb-[calc(15px+(50-15)*((100vw-320px)/(1920-320)))] scale-95 lg:scale-100 transition-transform duration-500 [@media(max-width:1333px)]:mb-3.75">
        {data.badge && (
          <div className="inline-flex items-center justify-center max-w-[calc(220px+(500-220)*((100vw-320px)/(1920-320)))] px-4 py-1.5 mb-8 rounded-full bg-[#05966915] border border-[#05966930]">
            <span className="text-[12px] md:text-[13px] line-clamp-2 font-semibold text-primary tracking-wider uppercase break-all">{data.badge}</span>
          </div>
        )}

        <h1 className="break-word text-center max-w-[calc(268px+(769-268)*((100vw-320px)/(1920-320)))] text-[calc(18px+(50-18)*((100vw-320px)/(1920-320)))] font-bold text-white leading-[1.1] mb-8 [@media(max-width:767px)]:mb-5 tracking-tight whitespace-pre-wrap">{data.title}</h1>

        <p className="text-white text-[16px] max-w-[calc(318px+(480-318)*((100vw-320px)/(1920-320)))] mx-auto mb-10 [@media(max-width:767px)]:mb-5 leading-relaxed font-normal whitespace-pre-wrap">{data.description}</p>

        {data.primary_button?.text && (
          <Button
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 h-12 rounded-xl font-semibold text-[16px] transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_20px_rgba(5,150,105,0.3)]"
            onClick={() => {
              if (isAuthenticated) {
                const isAgent = user?.role === "agent";
                const targetLink = isAgent ? "/chat" : data.primary_button.link;
                router.push(targetLink);
              } else {
                router.push(ROUTES.Login);
              }
            }}
          >
            {data.primary_button.text}
          </Button>
        )}
      </div>

      <div className="relative w-screen flex justify-center mt-auto [@media(max-width:545px)]:mt-0">
        <div className="w-[90%] max-w-275 p-2 pt-0.5 bg-white bg-opacity-5 rounded-t-[40px] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm slider-box -bottom-13.75 max-w-[980px] max-h-[552px] [@media(max-width:767px)]:-bottom-7.75 relative ">
          <Images src={data?.hero_image} fallbackSrc="/assets/images/slider-1.png" alt="App Dashboard" width={100} height={100} className="rounded-t-[32px] w-full h-auto shadow-inner max-w-[980px] max-h-[552px]" unoptimized />
        </div>
      </div>

      {/* Floating Screenshots */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden z-[1]">
        {data.floating_images?.map((img, index) => {
          const positionStyles: Record<string, string> = {
            "left-top": "top-[15%] left-[5%] [@media(max-width:1578px)]:left-[3%] [@media(max-width:1485px)]:hidden animate-up-down max-w-[250px] max-h-[405px]",
            "right-top": "top-[22%] right-[5%] [@media(max-width:1578px)]:right-[2%] [@media(max-width:1485px)]:hidden animate-up-down max-w-[270px] max-h-[297px]",
            "left-bottom": "top-[70%] left-[12%] [@media(max-width:1558px)]:left-[70px] [@media(max-width:1485px)]:hidden animate-up-down max-w-[298px] max-h-[286px] ",
            "right-bottom": "top-[72%] right-[270px] [@media(max-width:1558px)]:right-[105px] [@media(max-width:1485px)]:hidden  animate-up-down max-w-[240px] max-h-[215px]",
          };

          return (
            <div key={index} className={`absolute w-[320px] hidden lg:block slider-box ${positionStyles[img.position] || ""}`}>
              <div className="p-1.5 bg-white bg-opacity-[0.03] rounded-[24px] border border-white border-opacity-10 shadow-2xl backdrop-blur-md">
                <Images src={img.url} alt={`Floating Image ${index + 1}`} width={400} height={250} className={`rounded-[18px] shadow-lg ${index === 3 ? "max-h-[215px]" : ""}`} unoptimized />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Home;
