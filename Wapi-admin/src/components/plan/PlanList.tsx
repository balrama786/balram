"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PlanCard from "./PlanCard";
import { PlanListProps } from "@/src/types/components";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "@/src/elements/ui/carousel";

const PlanList = ({ plans, onDelete, isLoading }: PlanListProps) => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    // Initial sync - defer to avoid cascading render warning
    setTimeout(() => {
      onSelect();
    }, 0);

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (plans.length === 0) {
    return (
      <div className="dark:bg-(--card-color) bg-white rounded-lg border border-gray-200 shadow-sm p-20 text-center dark:border-(--card-border-color)">
        <p className="text-gray-400">{t("plan.no_plans")}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 [@media(max-width:395px)]:px-0">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          slidesToScroll: 1,
          direction: document.documentElement.dir === "rtl" ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent
          className={`-ml-4 items-stretch flex ${plans.length <= 3 ? "justify-center" : ""}`}
        >
          {plans.map((plan, index) => (
            <CarouselItem
              key={plan._id || index}
              className={`pl-4 cursor-pointer flex basis-full sm:basis-1/2 ${
                plans.length === 2
                  ? "lg:basis-1/2 lg:max-w-[420px]"
                  : plans.length === 3
                    ? "lg:basis-1/3 lg:max-w-[420px]"
                    : "max-[1599px]:lg:basis-1/3 lg:basis-1/4"
              }`}
              onClick={() => api?.scrollTo(index)}
            >
              <div className="flex flex-col py-10 px-2 h-full w-full">
                <PlanCard
                  plan={plan}
                  onDelete={onDelete}
                  isLoading={isLoading}
                  isHighlighted={current === index}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {plans.length > 4 && (
          <CarouselDots
            totalSlides={plans.length}
            currentSlide={current}
            onDotClick={handleDotClick}
          />
        )}
      </Carousel>
    </div>
  );
};

export default PlanList;
