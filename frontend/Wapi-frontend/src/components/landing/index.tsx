"use client";

import Connect from "./Connect";
import Faq from "./Faq";
import Features from "./Features";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Platform from "./Platform";
import PricingPlan from "./PricingPlan";
import TapTop from "./TapTop";
import Testimonial from "./Testimonial";

import { useGetLandingPageQuery } from "../../redux/api/landingPageApi";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import Loading from "@/src/app/loading";

const Landing = () => {
  const { data: landingData, isLoading, error } = useGetLandingPageQuery();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const previousTheme = theme;
    setTheme("light");
    return () => {
      if (previousTheme) {
        setTheme(previousTheme);
      }
    };
  }, [setTheme, theme]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !landingData?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#041A1C] text-white">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-400">Failed to load the landing page. Please try again later.</p>
      </div>
    );
  }

  const data = landingData.data;

  return (
    <div>
      <Header data={data.footer_section} />
      <Home data={data.hero_section} />
      <Features data={data.features_section} />
      <Platform data={data.platform_section} />
      <PricingPlan data={data.pricing_section} />
      <Testimonial data={data.testimonials_section} />
      <Faq data={data.faq_section} />
      <Connect data={data.contact_section} />
      <Footer data={data.footer_section} />
      <TapTop />
    </div>
  );
};

export default Landing;
