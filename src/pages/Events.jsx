import { useEffect, useRef, useCallback, useState } from "react";
import events from "../data/events";
import EventCard from "../components/events/EventCard";
import { ColorBendsBackground } from "../components/background";
import Fireflies from "../components/background/Fireflies";

// ── Swipeable carousel (mobile) + regular grid (desktop) ─────────────────────
function EventsGrid({ items }) {
  const trackRef   = useRef(null);
  const [active, setActive] = useState(0);

  // Update dot indicator on scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardW = el.firstChild?.offsetWidth || 1;
      const gap   = 16; // matches gap-4 (1rem)
      const idx   = Math.round(el.scrollLeft / (cardW + gap));
      setActive(Math.min(idx, items.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.firstChild?.offsetWidth || 1;
    el.scrollTo({ left: i * (cardW + 16), behavior: "smooth" });
  };

  return (
    <div>
      {/* ── MOBILE: horizontal scroll-snap carousel ── */}
      <div className="block sm:hidden">
        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingBottom: "12px",
          }}
        >
          <style>{`
            .ec-track::-webkit-scrollbar { display: none; }
          `}</style>
          {items.map((event) => (
            <div
              key={event.id}
              style={{
                flex: "0 0 78vw",
                maxWidth: "300px",
                height: "400px",
                scrollSnapAlign: "center",
              }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginTop: "14px" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to card ${i + 1}`}
              style={{
                width: i === active ? "22px" : "7px",
                height: "7px",
                borderRadius: "9999px",
                background: i === active ? "#f87171" : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>

        {/* Swipe hint — shown once, fades out */}
        <p style={{
          textAlign: "center",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.28)",
          marginTop: "8px",
          fontFamily: "monospace",
        }}>
          ← swipe →
        </p>
      </div>

      {/* ── TABLET + DESKTOP: regular grid ── */}
      <div
        className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "clamp(16px, 2.5vw, 32px)" }}
      >
        {items.map((event) => (
          <div
            key={event.id}
            className="w-full"
            style={{ height: "clamp(340px, 30vw, 420px)" }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
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
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      if (wallpaperRef.current) wallpaperRef.current.style.transform = "scale(1.05)";
    };
  }, [checkMobile]);

  const technicalEvents    = events.filter((e) => e.category === "Technical");
  const nonTechnicalEvents = events.filter((e) => e.category === "Non-Technical");

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

      <div className="fixed inset-0 z-[1] pointer-events-none bg-black/30" />

      {!isMobile && (
        <div className="fixed inset-0 z-[2] pointer-events-none">
          <Fireflies count={25} />
        </div>
      )}

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
      <div className="relative z-[10] pt-28 sm:pt-36 pb-24 min-h-screen">

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-12 sm:mb-16 bg-gradient-to-r from-red-300 via-red-200 to-red-400 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase animate-pulse text-center px-4">
          Pick Your Card!
        </h1>

        {/* TECHNICAL */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-10 uppercase tracking-widest text-red-400 px-4">
          Technical Events
        </h2>
        <div className="sm:px-6 lg:px-12 sm:max-w-7xl sm:mx-auto">
          <EventsGrid items={technicalEvents} />
        </div>

        {/* NON-TECHNICAL */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mt-14 sm:mt-20 mb-6 sm:mb-10 uppercase tracking-widest text-red-400 px-4">
          Non Technical Events
        </h2>
        <div className="sm:px-6 lg:px-12 sm:max-w-7xl sm:mx-auto">
          <EventsGrid items={nonTechnicalEvents} />
        </div>

        <div className="h-24 sm:h-32" />
      </div>
    </div>
  );
}
