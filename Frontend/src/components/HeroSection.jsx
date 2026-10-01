import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useApp from "../hooks/useApp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    id: 1,
    img: "",
    headline: "Elevate Your",
    accent: "Everyday",
    tail: "Style",
    description:
      "Discover our curated collection of premium essentials crafted from the finest materials for the modern wardrobe.",
    primaryCta: { label: "SHOP COLLECTION", to: "/shop" },
    secondaryCta: { label: "EXPLORE", to: "#categories" },
  },
  {
    id: 2,
    variant: "split",
    headline: "Manage your ",
    accent: "products",
    tail: "",
    description: "add, remove, edit your listed products",
    primaryCta: { label: "SHOP NEW IN", to: "/shop" },
    secondaryCta: { label: "EXPLORE", to: "#categories" },
  },
  {
    id: 3,
    variant: "split",
    headline: "Seller Dashboard ",
    accent: "analysis",
    tail: "using charts and graphs",
    description: "analysis using charts and graphs",
    primaryCta: { label: "SHOP ESSENTIALS", to: "/shop" },
    secondaryCta: { label: "EXPLORE", to: "#categories" },
  },
];

function HeroSlide({ slide, heroImgDesktop, heroImgMobile }) {
  if (slide.variant === "split") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-gray-900">
        <div className="relative z-10 h-full flex flex-col-reverse md:flex-row">
          {/* Left: Text content */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-12 lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-lg"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="font-display text-2xl sm:text-3xl md:text-6xl text-white font-bold leading-tight mb-2 md:mb-6"
              >
                {slide.headline}
                <br />
                <span className="italic font-normal">{slide.accent}</span>
                {slide.tail && <> {slide.tail}</>}
              </motion.h2>

              {slide.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/75 text-xs sm:text-sm mb-4 md:mb-8 max-w-md leading-relaxed"
                >
                  {slide.description}
                </motion.p>
              )}

              {slide.variant !== "split" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to={slide.primaryCta.to}
                    className="btn-ripple px-8 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-100 transition shadow-xl"
                  >
                    {slide.primaryCta.label}
                  </Link>
                  <motion.a
                    href={slide.secondaryCta.to}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 border-2 border-white/50 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-white/10 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("categories")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {slide.secondaryCta.label}
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              src={heroImgDesktop}
              alt="Dashboard preview"
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={heroImgMobile}
          fetchpriority="high"
        />
        <img
          src={heroImgDesktop}
          alt="Hero fashion"
          fetchpriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto mb-16 px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl text-white font-bold leading-tight mb-6"
            >
              {slide.headline}
              <br />
              <span className="italic font-normal">{slide.accent}</span>
              {slide.tail && <> {slide.tail}</>}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/75 text-sm sm:text-base mb-8 max-w-md leading-relaxed"
            >
              {slide.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to={slide.primaryCta.to}
                className="btn-ripple px-8 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-100 transition shadow-xl"
              >
                {slide.primaryCta.label}
              </Link>
              <motion.a
                href={slide.secondaryCta.to}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 border-2 border-white/50 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-white/10 transition"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("categories")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {slide.secondaryCta.label}
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CarouselDots({ count }) {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === selectedIndex
              ? "w-8 bg-white"
              : "w-2 bg-white/40 hover:bg-white/60"
          }`}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const {
    heroImgDesktop,
    heroImgMobile,
    productsImageDesktop,
    overviewImageDesktop,
  } = useApp();

  const images = [
    [heroImgDesktop, heroImgMobile],
    [productsImageDesktop],
    [overviewImageDesktop],
  ];

  const autoplay = React.useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: true,
      stopOnMouseEnter: false,
    }),
  );

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <Carousel
        className="w-full h-full"
        plugins={[autoplay.current]}
        opts={{ loop: true, align: "start" }}
      >
        <CarouselContent className="h-full min-h-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full h-full">
              <HeroSlide
                slide={slide}
                heroImgDesktop={images[slide.id - 1][0]}
                heroImgMobile={images[slide.id - 1][1]}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-20" />
        <CarouselNext className="right-4 z-20" />
        <CarouselDots count={slides.length} />
      </Carousel>

      {/* Scroll indicator */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
