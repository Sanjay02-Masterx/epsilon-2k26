import React, { useEffect, useRef, useState } from "react";
import { Zap, ChevronDown, Building2 } from "lucide-react";
import epsilon from "../assets/epsilonlogo.png";

  // ─── CONTENT ────────────────────────────────────────────────────────────────
  const sections = [
    {
      id: 1,
      range: [0.28, 0.62],
      title: "Essence of Epsilon",
      subtitle: "What We Stand For",
      desc: "EPSILON stands as a distinguished technical conclave that unites innovation, intellect, and interdisciplinary excellence. Through competitive events, collaborative challenges, and thought-provoking engagements, EPSILON cultivates leadership, fosters ingenuity, and inspires progress beyond boundaries. It is not just a symposium — it is a movement that transforms ideas into impact.",
      quote: "Powering ideas. Energizing innovation.",
      stats: [
        { label: "Identity", value: "Conclave"   },
        { label: "Focus",    value: "Innovation" },
        { label: "Spirit",   value: "Excellence" },
      ],
      icon: <Zap size={24} className="text-yellow-400 animate-pulse" />,
      image: epsilon,
    },
    {
      id: 2,
      range: [0.65, 0.92],
      title: "About MSEC",
      subtitle: "Meenakshi Sundararajan Engineering College",
      desc: "MSEC was established in 2001 by the IIET Society and is a proud institution under the prestigious KRS Group of Institutions, which also includes the renowned Indian Institute of Engineering Technology (IIET), founded in 1947. Located at 363, Arcot Road, Kodambakkam, Chennai, MSEC consistently strives to evolve as a Centre of Excellence — committed to nurturing students with exceptional academic proficiency, ethical values, and industry-ready skills.",
      quote: "Grooming engineers. Building the nation.",
      stats: [
        { label: "Est.",   value: "2001"       },
        { label: "NAAC",   value: "A Grade"    },
        { label: "Status", value: "NBA Accred."},
      ],
      icon: <Building2 size={24} className="text-red-400" />,
      image: epsilon,
    },
  ];

const About = () => {
  const sceneRef    = useRef(null);
  const carRef      = useRef(null);
  const particlesRef = useRef(null);

  const [activeSection, setActiveSection] = useState(null);
  const [gsapReady,     setGsapReady]     = useState(false);
  const [particles]     = useState(() => {
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 10 : 30;
    return Array.from({ length: count }).map(() => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top:  Math.random() * 100,
      red:  Math.random() > 0.9,
      opacity: Math.random() * 0.6 + 0.1,
    }));
  });

  // ─── LOAD GSAP SCRIPTS ───────────────────────────────────────────────────────
  useEffect(() => {
    const load = (src) =>
      new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement("script");
        s.src = src;
        s.onload = res;
        s.onerror = rej;
        document.body.appendChild(s);
      });

    Promise.all([
      load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
      load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"),
      load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MotionPathPlugin.min.js"),
    ])
      .then(() => setGsapReady(true))
      .catch((err) => {
        console.error("GSAP Load Error:", err);
        setGsapReady(true); // ✅ FIX 1: still render the page even if CDN fails
      });
  }, []);

  // ─── GSAP ANIMATIONS ─────────────────────────────────────────────────────────
  useEffect(() => {
    // ✅ FIX 3: don't put `particles` in deps – avoids infinite re-init loop
    if (!gsapReady || !window.gsap || !sceneRef.current || !carRef.current) return;

    const gsap          = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const MotionPathPlugin = window.MotionPathPlugin;

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const isMobile = window.innerWidth < 768;

    // Scope all animations inside a context for clean cleanup
    const ctx = gsap.context(() => {

      // ── Particle float ──────────────────────────────────────────────────────
      gsap.utils.toArray(".about-particle").forEach((p) => {
        gsap.to(p, {
          y: `-=${Math.random() * 180 + 80}`,
          x: `+=${Math.random() * 80 - 40}`,
          opacity: 0,
          duration: Math.random() * 5 + 3,
          repeat: -1,
          ease: "none",
        });
      });

      // ── Main pinned timeline ─────────────────────────────────────────────────
      // ✅ FIX 8: trigger on sceneRef; outer wrapper must NOT have overflow:hidden
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top top",
          end: isMobile ? "+=1400" : "+=2800",   // 2 sections only
          scrub: isMobile ? 0.4 : 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const cur = sections.find((s) => p >= s.range[0] && p <= s.range[1]);
            setActiveSection(cur ? cur.id : null);
          },
        },
      });

      // ── Intro fade ──────────────────────────────────────────────────────────
      gsap.to(".about-intro-screen", {
        opacity: 0,
        pointerEvents: "none",
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top top",
          end: isMobile ? "+=300" : "+=500",
          scrub: true,
        },
      });

      // ── Car motion path ─────────────────────────────────────────────────────
      tl.to(carRef.current, {
        motionPath: {
          path: "#roadPath",
          align: "#roadPath",
          alignOrigin: [0.5, 0.5],
          autoRotate: 90,
        },
        ease: "none",
        duration: 1,
      });

      // ── Dash line draw ──────────────────────────────────────────────────────
      const pathLen = document.querySelector("#dashPath")?.getTotalLength() || 1000;
      gsap.set("#dashPath", { strokeDasharray: pathLen, strokeDashoffset: pathLen });
      tl.to("#dashPath", { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

    }, sceneRef);

    // ── FIX: kill the white GSAP pin spacer at runtime ──────────────────────
    // GSAP injects a bare <div> after sceneRef — find it and paint it black.
    // We use a short timeout so GSAP has time to inject it first.
    const spacerTimer = setTimeout(() => {
      // Method 1: next sibling of the scene wrapper
      const spacer = sceneRef.current?.nextSibling;
      if (spacer && spacer.nodeType === 1) {
        spacer.style.backgroundColor = "#000";
        spacer.style.background = "#000";
      }
      // Method 2: any div GSAP added inside the about-page wrapper
      const allDivs = sceneRef.current?.parentElement?.querySelectorAll(":scope > div:not(.scene-wrapper)");
      allDivs?.forEach((d) => {
        d.style.backgroundColor = "#000";
        d.style.background = "#000";
      });
      // Method 3: the [data-gsap-pin-spacer] attribute GSAP sometimes adds
      document.querySelectorAll("[data-gsap-pin-spacer]").forEach((d) => {
        d.style.backgroundColor = "#000";
        d.style.background = "#000";
      });
    }, 300);

    return () => {
      clearTimeout(spacerTimer);
      ctx.revert();
    };
  }, [gsapReady]); // ✅ FIX 3: only re-run when GSAP loads, NOT on particle state changes

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Roboto+Mono:wght@400;700&display=swap');

        /* ✅ FIX 8: about-page must NOT have overflow:hidden – it breaks GSAP pin */
        .about-page {
          position: relative;
          width: 100%;
          background: #000;
        }

        .bg-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.95) 100%);
        }

        .bg-fog {
          background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/img/fog1.png");
          background-size: cover;
          animation: fogDrift 60s linear infinite;
        }

        .scanlines {
          background: linear-gradient(to bottom,
            rgba(255,255,255,0)   0%,
            rgba(255,255,255,0)  50%,
            rgba(0,0,0,0.3)      50%,
            rgba(0,0,0,0.3)     100%);
          background-size: 100% 4px;
        }

        .clip-headlight {
          clip-path: polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%);
        }

        @keyframes fogDrift {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-5%); }
          100% { transform: translateX(0); }
        }

        /* ✅ FIX 5: quote font capped, scales on mobile */
        .hud-quote {
          font-size: clamp(12px, 2.5vw, 18px);
        }

        /* Hide scrollbar inside HUD card */
        .hud-scroll::-webkit-scrollbar { display: none; }
        .hud-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── FIX: GSAP pin spacer white bar ──────────────────────────────────
           GSAP automatically injects a bare <div> spacer right after the
           pinned .scene-wrapper to hold the scroll height. That div has no
           background so it renders white. We kill it three ways:
           1. Target it as a direct sibling of .scene-wrapper
           2. Target any direct child of .about-page that isn't .scene-wrapper
           3. Force html/body to stay black
        ──────────────────────────────────────────────────────────────────── */
        .scene-wrapper + div,
        .scene-wrapper ~ div {
          background: #000 !important;
          background-color: #000 !important;
        }

        .about-page > div:not(.scene-wrapper) {
          background: #000 !important;
          background-color: #000 !important;
        }

        /* Force HTML/Body black to hide any stray GSAP pin spacers */
        html, body {
          background-color: #000 !important;
          min-height: 100vh;
          min-height: -webkit-fill-available;
        }
      `}</style>

      {/* NO overflow-hidden — breaks GSAP pin */}
      <div className="about-page selection:bg-red-500/30" style={{ backgroundColor: "#000" }}>

        {/* ── Scene: this div gets pinned by GSAP ── */}
        <div ref={sceneRef} className="scene-wrapper h-screen w-full relative" style={{ backgroundColor: "#000" }}>

          {/* 1. Deep background */}
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#2a0a0a_0%,#000000_100%)] z-0" />

          {/* 2. Fog */}
          <div className="fixed inset-0 bg-fog opacity-20 z-[1] pointer-events-none mix-blend-screen" />

          {/* 3. Particles */}
          <div ref={particlesRef} className="fixed inset-0 z-[2] pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="about-particle absolute rounded-full"
                style={{
                  width:  p.size,
                  height: p.size,
                  left:   `${p.left}%`,
                  top:    `${p.top}%`,
                  backgroundColor: p.red ? "#ff0000" : "#cccccc",
                  opacity: p.opacity,
                }}
              />
            ))}
          </div>

          {/* 4. Vignette */}
          <div className="fixed inset-0 z-[20] pointer-events-none bg-vignette" />

          {/* ── INTRO SCREEN ── */}
          <div className="about-intro-screen absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-4">
            <div className="relative">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-red-800 to-black font-serif tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] text-center">
                ABOUT US
              </h1>
              <div className="absolute -inset-2 bg-red-600/20 blur-xl -z-10 animate-pulse" />
            </div>
            <p className="mt-6 sm:mt-8 text-red-500/80 font-mono tracking-[0.2em] sm:tracking-[0.3em] text-xs animate-bounce flex items-center gap-2 text-center">
              <ChevronDown size={14} /> SCROLL TO ENTER THE UPSIDE DOWN <ChevronDown size={14} />
            </p>
          </div>

          {/* ── ROAD SVG ── */}
          <div className="fixed inset-0 flex items-center justify-center z-[5] pointer-events-none overflow-hidden">
            <svg
              viewBox="0 0 1440 1024"
              className="w-[200%] h-[200%] sm:w-[140%] sm:h-[140%] md:w-[90%] md:h-[90%] opacity-80"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Road body */}
              <path
                id="roadPath"
                d="M 200 -100 C 200 300 600 200 600 500 C 600 800 200 700 200 900 C 200 1100 1200 1100 1200 900 C 1200 700 800 600 800 400 C 800 200 1200 200 1200 -100"
                fill="none"
                stroke="#1a0505"
                strokeWidth="80"
                strokeLinecap="round"
              />
              {/* Road glow */}
              <path
                d="M 200 -100 C 200 300 600 200 600 500 C 600 800 200 700 200 900 C 200 1100 1200 1100 1200 900 C 1200 700 800 600 800 400 C 800 200 1200 200 1200 -100"
                fill="none"
                stroke="#ff0000"
                strokeWidth="2"
                className="opacity-20 blur-sm"
              />
              {/* Dashed centre line */}
              <path
                id="dashPath"
                d="M 200 -100 C 200 300 600 200 600 500 C 600 800 200 700 200 900 C 200 1100 1200 1100 1200 900 C 1200 700 800 600 800 400 C 800 200 1200 200 1200 -100"
                fill="none"
                stroke="#ff2222"
                strokeWidth="3"
                strokeDasharray="30 60"
                className="opacity-60 mix-blend-screen"
              />
            </svg>
          </div>

          {/* ── CAR ── */}
          {/* ✅ FIX 4 & 9: removed massive w-[1500px] headlight, fixed mobile margins */}
          <div
            ref={carRef}
            className="fixed top-0 left-0 z-30 pointer-events-none"
            style={{ width: 40, marginLeft: -20, marginTop: -20 }}
          >
            <img
              src="/car.png"
              alt="Car"
              className="w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,1)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://cdn-icons-png.flaticon.com/512/3202/3202926.png";
              }}
            />
            {/* Headlight – ✅ FIX 4: sensible size, no overflow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[90%] w-[120px] h-[200px] bg-gradient-to-t from-yellow-100/25 via-yellow-500/5 to-transparent blur-md clip-headlight z-[-1] mix-blend-hard-light" />
            {/* Brake lights */}
            <div className="absolute bottom-[10%] left-[10%] w-1.5 h-1.5 bg-red-600 rounded-full blur-[2px] shadow-[0_0_10px_red]" />
            <div className="absolute bottom-[10%] right-[10%] w-1.5 h-1.5 bg-red-600 rounded-full blur-[2px] shadow-[0_0_10px_red]" />
          </div>

          {/* ── HUD POPUP CARDS ── */}
          <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center p-3 sm:p-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`
                  absolute w-full max-w-xs sm:max-w-2xl md:max-w-5xl lg:max-w-6xl
                  px-3 sm:px-4 md:px-0
                  transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
                  ${activeSection === section.id
                    ? "opacity-100 translate-y-0 scale-100 blur-0"
                    : "opacity-0 translate-y-20 scale-95 blur-lg pointer-events-none"}
                `}
              >
                {/* Card shell */}
                <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-red-900/40 p-[2px] sm:p-1 rounded-2xl shadow-[0_0_100px_-20px_rgba(220,38,38,0.3)] overflow-hidden relative group">
                  <div className="absolute inset-0 scanlines opacity-20 pointer-events-none rounded-2xl" />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

                  {/* ✅ FIX 6: max-h is defined with svh to account for mobile bottom bars */}
                  <div className="flex flex-col md:flex-row max-h-[80svh] md:max-h-none overflow-y-auto hud-scroll bg-neutral-950/80 rounded-xl">

                    {/* Image */}
                    <div className="w-full md:w-2/5 relative h-36 sm:h-48 md:h-auto overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-red-900/20 z-10 mix-blend-overlay" />
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 z-20 bg-black/90 p-1.5 sm:p-2 rounded-lg border border-red-900/50 backdrop-blur-sm">
                        {section.icon}
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-center relative">
                      {/* Decorative dots */}
                      <div className="absolute top-3 right-3 flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-red-500 animate-ping" : "bg-red-900"}`}
                          />
                        ))}
                      </div>

                      {/* Subtitle badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-mono text-red-500 uppercase tracking-widest border border-red-900/50 px-2 py-0.5 rounded">
                          {section.subtitle}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white font-serif tracking-wide mb-3 sm:mb-4 uppercase leading-tight">
                        {section.title}
                      </h2>

                      {/* Desc */}
                      <p className="text-gray-400 font-mono text-xs leading-relaxed border-l-2 border-red-900 pl-3 sm:pl-4 mb-3 sm:mb-4">
                        {section.desc}
                      </p>

                      {/* ✅ FIX 5: quote uses clamp via hud-quote class, no overflow */}
                      <p className="hud-quote text-red-400 font-mono italic mb-4 sm:mb-5 opacity-80 border-b border-red-900/30 pb-2">
                        &ldquo;{section.quote}&rdquo;
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 sm:pt-4">
                        {section.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                              {stat.label}
                            </div>
                            <div className="text-xs font-bold text-red-100 truncate">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>{/* end scene-wrapper */}

        {/* ✅ FIX 7: Actual scroll spacer so GSAP has room to run all 4 sections */}
        {/* On mobile: 2200px extra scroll; on desktop: 4500px. We use a generous fixed height
            because GSAP's `end: +=N` is relative to the trigger, and pin adds the space
            automatically — this spacer is intentionally zero-height; GSAP's pin handles it. */}

      </div>{/* end about-page */}
    </>
  );
};

export default About;
