import { useEffect, useRef, useCallback, useState } from "react";
import events from "../data/events";
import EventCard from "../components/events/EventCard";
import { ColorBendsBackground } from "../components/background";
import Fireflies from "../components/background/Fireflies";

export default function Events() {
  const wallpaperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    if (typeof window === "undefined") return true;

    const isSmallScreen = window.innerWidth < 1024;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMobileUA =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    return isSmallScreen || isTouch || isMobileUA;
  }, []);

  useEffect(() => {
    const mobile = checkMobile();
    setIsMobile(mobile);

    if (mobile || !wallpaperRef.current) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 1200, 1);

      if (wallpaperRef.current) {
        wallpaperRef.current.style.transform =
          `translate3d(0, ${progress * -80}px, 0) scale(${1 + progress * 0.18})`;
      }

      ticking = false;
    };

    const scroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", scroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", scroll);
      if (wallpaperRef.current) {
        wallpaperRef.current.style.transform = "scale(1.05)";
      }
    };
  }, [checkMobile]);

  // 🔥 FILTER EVENTS
  const technicalEvents = events.filter(
    (event) => event.category === "Technical"
  );

  const nonTechnicalEvents = events.filter(
    (event) => event.category === "Non-Technical"
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      
      {/* WALLPAPER */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          ref={wallpaperRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/originals/44/6e/3b/446e3b79395a287ca32f7977dd83b290.jpg')",
            transform: "scale(1.05)",
          }}
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-black/30" />

      {/* FIREFLIES */}
      {!isMobile && (
        <div className="fixed inset-0 z-[2] pointer-events-none">
          <Fireflies count={isMobile ? 8 : 25} />
        </div>
      )}

      {/* COLOR BENDS */}
      <div className="fixed inset-0 z-[3] pointer-events-none opacity-60">
        <ColorBendsBackground
          colors={["#FF0000", "#FF1744", "#FF4444", "#FF6666"]}
          mouseForce={isMobile ? 12 : 25}
          cursorSize={isMobile ? 50 : 110}
          isViscous={false}
          viscous={isMobile ? 15 : 30}
          iterationsViscous={isMobile ? 12 : 20}
          iterationsPoisson={isMobile ? 12 : 20}
          resolution={isMobile ? 0.12 : 0.45}
          autoDemo={!isMobile}
          autoSpeed={0.35}
          autoIntensity={1.4}
        />
      </div>

      <div className="fixed inset-0 z-[4] pointer-events-none bg-black/20" />

      {/* CONTENT */}
      <div className="relative z-[10] pt-36 px-6 lg:px-12 max-w-7xl mx-auto pb-24 min-h-screen">
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 bg-gradient-to-r from-red-300 via-red-200 to-red-400 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase animate-pulse text-center">
          Pick Your Card!
        </h1>

        {/* TECHNICAL EVENTS */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 uppercase tracking-widest text-red-400">
          Technical Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12 lg:gap-16 p-4 lg:p-8 justify-items-center">
          {technicalEvents.map((event) => (
            <div
              key={event.id}
              className="w-[320px] h-[400px] flex-shrink-0"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* NON TECHNICAL EVENTS */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mt-20 mb-10 uppercase tracking-widest text-red-400">
          Non Technical Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12 lg:gap-16 p-4 lg:p-8 justify-items-center">
          {nonTechnicalEvents.map((event) => (
            <div
              key={event.id}
              className="w-[320px] h-[400px] flex-shrink-0"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        <div className="h-32" />
      </div>
    </div>
  );
}