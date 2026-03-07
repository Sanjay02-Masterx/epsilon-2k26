import { useEffect, useState, useRef, useMemo, useCallback } from "react";

/**
 * LoadingScreen — ~2.85s cinematic boot intro
 *
 * Phase 0 (0ms)     : black canvas + scanline
 * Phase 1 (300ms)   : terminal typewriter types BOOT_TEXT
 * Phase 2 (950ms)   : ST-style logo fragments fly in, glitch fires
 * Phase 3 (1700ms)  : progress bar fills to 100 %
 * Phase 4 (2500ms)  : fade-out begins
 * done  (2850ms)    : onComplete() called → app renders
 *
 * Mobile-performance notes
 * ─────────────────────────
 * • All animations use transform/opacity only  → compositor thread, zero layout
 * • will-change declared only while animating, removed after
 * • No box-shadow on mobile (detected via matchMedia hover:none)
 * • Glitch fires at most once every 160 ms on mobile vs 40 ms on desktop
 * • useMemo / useCallback prevent unnecessary re-renders
 * • onComplete wrapped in useCallback so effect deps stay stable
 */

const BOOT_TEXT = [
  "EPSILON_2K26.exe",
  "LOADING SYNAPTIC CORE...",
  "WIRING EEE GRID...",
  "CHARGING CAPACITORS...",
  "SIGNAL LOCK: ACQUIRED",
].join("\n");

// Detect touch/mobile once at module level — avoids repeated queries
const IS_MOBILE =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// Fragment clip-paths — 12 cells in a 4×3 grid
const FRAGMENTS = [
  { clip: "inset(0 75% 67% 0)",     tx: "-60px", ty: "-45px", delay: "0ms"   },
  { clip: "inset(0 50% 67% 25%)",   tx: "0px",   ty: "-55px", delay: "55ms"  },
  { clip: "inset(0 25% 67% 50%)",   tx: "35px",  ty: "-38px", delay: "110ms" },
  { clip: "inset(0 0 67% 75%)",     tx: "65px",  ty: "-50px", delay: "75ms"  },
  { clip: "inset(33% 75% 33% 0)",   tx: "-80px", ty: "0px",   delay: "25ms"  },
  { clip: "inset(33% 50% 33% 25%)", tx: "-14px", ty: "28px",  delay: "85ms"  },
  { clip: "inset(33% 25% 33% 50%)", tx: "22px",  ty: "-22px", delay: "140ms" },
  { clip: "inset(33% 0 33% 75%)",   tx: "78px",  ty: "18px",  delay: "45ms"  },
  { clip: "inset(67% 75% 0 0)",     tx: "-55px", ty: "48px",  delay: "100ms" },
  { clip: "inset(67% 50% 0 25%)",   tx: "10px",  ty: "62px",  delay: "35ms"  },
  { clip: "inset(67% 25% 0 50%)",   tx: "38px",  ty: "42px",  delay: "160ms" },
  { clip: "inset(67% 0 0 75%)",     tx: "72px",  ty: "58px",  delay: "65ms"  },
];

export default function LoadingScreen({ onComplete }) {
  const [phase,            setPhase]            = useState(0);
  const [typedText,        setTypedText]        = useState("");
  const [progress,         setProgress]         = useState(0);
  const [glitchActive,     setGlitchActive]     = useState(false);
  const [fragmentsVisible, setFragmentsVisible] = useState(false);
  const [logoVisible,      setLogoVisible]      = useState(false);
  const [fadeOut,          setFadeOut]          = useState(false);

  const glitchTimer  = useRef(null);
  const mountedRef   = useRef(true);

  // Stable callback — prevents effect re-runs
  const done = useCallback(() => {
    if (mountedRef.current) onComplete();
  }, [onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearTimeout(glitchTimer.current);
    };
  }, []);

  // ── Phase sequencer ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = [
      setTimeout(() => mountedRef.current && setPhase(1), 300),
      setTimeout(() => mountedRef.current && setPhase(2), 950),
      setTimeout(() => mountedRef.current && setPhase(3), 1700),
      setTimeout(() => mountedRef.current && setFadeOut(true), 2500),
      setTimeout(() => done(), 2850),
    ];
    return () => t.forEach(clearTimeout);
  }, [done]);

  // ── Typewriter ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase < 1) return;
    let i = 0;
    // Slightly faster on mobile so it keeps up with shorter total time
    const iv = setInterval(() => {
      if (!mountedRef.current) { clearInterval(iv); return; }
      i++;
      setTypedText(BOOT_TEXT.slice(0, i));
      if (i >= BOOT_TEXT.length) clearInterval(iv);
    }, IS_MOBILE ? 14 : 18);
    return () => clearInterval(iv);
  }, [phase]);

  // ── Logo fragments + glitch ───────────────────────────────────────────────
  useEffect(() => {
    if (phase < 2) return;
    setFragmentsVisible(true);
    const showLogo = setTimeout(() => {
      if (mountedRef.current) setLogoVisible(true);
    }, 220);

    // Min interval between glitch bursts — relax on mobile for perf
    const MIN_INTERVAL = IS_MOBILE ? 160 : 40;
    const MAX_INTERVAL = IS_MOBILE ? 500 : 280;

    const fireGlitch = () => {
      if (!mountedRef.current) return;
      setGlitchActive(true);
      glitchTimer.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setGlitchActive(false);
        glitchTimer.current = setTimeout(
          fireGlitch,
          Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL
        );
      }, IS_MOBILE ? 60 : Math.random() * 100 + 40);
    };
    fireGlitch();

    return () => {
      clearTimeout(showLogo);
      clearTimeout(glitchTimer.current);
    };
  }, [phase]);

  // ── Progress bar ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase < 3) return;
    let val = 0;
    const iv = setInterval(() => {
      if (!mountedRef.current) { clearInterval(iv); return; }
      val += Math.random() * 9 + 3;
      if (val >= 100) { val = 100; clearInterval(iv); }
      setProgress(val);
    }, 35);
    return () => clearInterval(iv);
  }, [phase]);

  // ── Bar heights — stable across renders ──────────────────────────────────
  const barHeights = useMemo(
    () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 14) + 4),
    []
  );

  // ── Glitch offset — only computed when active ─────────────────────────────
  const glitchTransform = useMemo(
    () => glitchActive
      ? `translate(${(Math.random() - 0.5) * (IS_MOBILE ? 4 : 7)}px, ${(Math.random() - 0.5) * 3}px)`
      : "translate(0,0)",
    [glitchActive]
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{
        opacity:       fadeOut ? 0 : 1,
        transition:    fadeOut ? "opacity 0.35s ease-out" : "none",
        pointerEvents: fadeOut ? "none" : "all",
        // Force GPU layer for the whole screen — smooth fade-out
        willChange:    fadeOut ? "opacity" : "auto",
        touchAction:   "none",
      }}
    >
      <style>{`
        /* ── All animations: transform + opacity only (compositor thread) ── */

        @keyframes scanMove {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        @keyframes fragIn {
          from {
            opacity: 0;
            transform: translateX(var(--ftx)) translateY(var(--fty));
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
            filter: blur(0);
          }
        }
        @keyframes logoFlicker {
          0%,89%,100% { opacity: 1;    }
          90%          { opacity: 0.80; }
          92%          { opacity: 0.25; }
          94%          { opacity: 1;    }
          97%          { opacity: 0.60; }
        }
        @keyframes barBounce {
          0%,100% { transform: scaleY(1);    }
          50%     { transform: scaleY(0.60); }
        }

        .ls-scan {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          pointer-events: none;
          will-change: transform;
          background: linear-gradient(
            transparent,
            rgba(220,38,38,0.15),
            transparent
          );
          animation: scanMove 2.4s linear infinite;
        }

        .ls-frag {
          position: absolute;
          inset: 0;
          will-change: transform, opacity;
          animation: fragIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }

        .ls-logo-on {
          animation: logoFlicker 2.8s step-end infinite;
          will-change: opacity;
        }

        .ls-bar-col {
          will-change: transform;
          transform-origin: bottom;
        }
      `}</style>

      {/* ── Scanline ── */}
      <div className="ls-scan" aria-hidden="true" />

      {/* ── Noise texture — very light, GPU-composited ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
        }}
      />

      {/* ── LOGO + FRAGMENTS ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: "min(82vw, 480px)", aspectRatio: "2.6/1" }}
      >
        {/* Fragment fly-in — only while logo hasn't assembled yet */}
        {fragmentsVisible && !logoVisible && FRAGMENTS.map((f, i) => (
          <div
            key={i}
            className="ls-frag"
            style={{
              clipPath:       f.clip,
              animationDelay: f.delay,
              "--ftx":        `translateX(${f.tx})`,
              "--fty":        `translateY(${f.ty})`,
            }}
          >
            <img
              src="/epsilon-logo.png"
              alt=""
              draggable="false"
              className="w-full h-full object-contain select-none"
              style={{
                // Lighter glow on mobile — no heavy box-shadow equiv
                filter: IS_MOBILE
                  ? "drop-shadow(0 0 10px rgba(220,38,38,0.8)) brightness(1.1)"
                  : "drop-shadow(0 0 18px rgba(220,38,38,0.9)) brightness(1.15)",
              }}
            />
          </div>
        ))}

        {/* Assembled logo */}
        {logoVisible && (
          <div
            className={`absolute inset-0 ${IS_MOBILE ? "" : "ls-logo-on"}`}
            style={{ transform: glitchTransform, transition: glitchActive ? "none" : "transform 0.05s ease" }}
          >
            {/* Chromatic aberration — desktop only, skipped on mobile */}
            {!IS_MOBILE && glitchActive && (
              <>
                <img
                  src="/epsilon-logo.png" alt="" draggable="false"
                  className="absolute inset-0 w-full h-full object-contain select-none"
                  style={{ transform: "translateX(-3px)", mixBlendMode: "screen", opacity: 0.50, filter: "hue-rotate(0deg) saturate(3)" }}
                />
                <img
                  src="/epsilon-logo.png" alt="" draggable="false"
                  className="absolute inset-0 w-full h-full object-contain select-none"
                  style={{ transform: "translateX(3px)",  mixBlendMode: "screen", opacity: 0.50, filter: "hue-rotate(180deg) saturate(3)" }}
                />
              </>
            )}
            <img
              src="/epsilon-logo.png"
              alt="EPSILON 2K26"
              draggable="false"
              className="relative z-10 w-full h-full object-contain select-none"
              style={{
                filter: IS_MOBILE
                  ? "drop-shadow(0 0 20px rgba(220,38,38,0.8))"
                  : "drop-shadow(0 0 38px rgba(220,38,38,0.85)) drop-shadow(0 0 80px rgba(220,38,38,0.35))",
              }}
            />
          </div>
        )}
      </div>

      {/* ── TERMINAL TEXT ── */}
      <div
        className="mt-5 font-mono tracking-widest text-center leading-loose"
        style={{
          color:       "rgba(220,38,38,0.65)",
          fontSize:    "clamp(9px, 2.5vw, 11px)",
          minHeight:   "5.5rem",
          whiteSpace:  "pre-line",
          maxWidth:    "clamp(220px, 70vw, 300px)",
        }}
      >
        {typedText}
        {phase < 3 && (
          <span
            className="inline-block bg-red-500 ml-0.5 align-middle animate-pulse"
            style={{ width: "5px", height: "clamp(9px,2.5vw,11px)" }}
          />
        )}
      </div>

      {/* ── PROGRESS ── */}
      {phase >= 3 && (
        <div style={{ marginTop: "clamp(10px,2vw,16px)", width: "clamp(180px,55vw,240px)" }}>

          {/* Data bars */}
          <div className="flex items-end gap-[3px] mb-2 justify-center" style={{ height: "20px" }}>
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="ls-bar-col rounded-full bg-red-600"
                style={{
                  width:      "3px",
                  height:     `${h}px`,
                  opacity:    (progress / 100) > (i / barHeights.length) ? 1 : 0.12,
                  transition: "opacity 0.12s",
                  animation:  `barBounce ${0.5 + (i % 4) * 0.1}s ease-in-out ${i * 30}ms infinite`,
                }}
              />
            ))}
          </div>

          {/* Track */}
          <div
            className="rounded-full overflow-hidden"
            style={{ height: "3px", background: "rgba(220,38,38,0.15)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width:      `${progress}%`,
                background: "linear-gradient(90deg, #7f1d1d, #ef4444, #dc2626)",
                // Lighter glow on mobile
                boxShadow:  IS_MOBILE ? "none" : "0 0 10px rgba(220,38,38,0.9)",
                transition: "width 0.06s linear",
                willChange: "width",
              }}
            />
          </div>

          <div
            className="flex justify-between mt-1.5 font-mono"
            style={{ fontSize: "9px", color: "rgba(220,38,38,0.5)" }}
          >
            <span>SYS_BOOT</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* ── Corner brackets ── */}
      {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"
      ].map((cls, i) => (
        <div key={i} className={`absolute ${cls} border-red-900/30 w-6 h-6`} aria-hidden="true" />
      ))}

      {/* ── Footer label ── */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center" aria-hidden="true">
        <span
          className="font-mono tracking-[0.4em] uppercase"
          style={{ fontSize: "9px", color: "rgba(220,38,38,0.28)" }}
        >
          EEE · MSEC · EPSILON 2K26
        </span>
      </div>
    </div>
  );
}
