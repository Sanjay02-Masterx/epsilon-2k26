import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// BUGS FIXED IN THIS FILE:
//
// 1. VIDEO INVISIBLE — Root cause:
//    .home-video { z-index: -20 }  →  sits behind the browser body background
//    The two overlay divs used Tailwind "-z-10" = z-index:-10, also behind body.
//    Fix: give the video z-index:0, overlays z-index:1 & 2, content z-index:10.
//    All use explicit inline style (not Tailwind -z-*) so no stacking-context
//    surprises from parent divs.
//
// 2. PORTAL BUTTON — MOBILE LAGS:
//    a) Heavy effects (SVG lightning + grain boost) dropped on mobile — they
//       trigger full-page SVG filter repaints on every frame.
//    b) `will-change:clip-path` on .pcta-portal.open ONLY; removed from idle
//       state so mobile doesn't waste GPU layers between interactions.
//    c) `touch-action:manipulation` on the button eliminates 300 ms tap delay.
//    d) `onPointerDown` fires before React's synthetic onClick — zero delay.
//    e) All setPhase() calls guarded with mountedRef so no setState-after-unmount.
//    f) All timeouts stored in a ref and cleared on unmount.
//    g) Portal animation duration: 0.72s on desktop → 0.5s on mobile.
//    h) Letterbox height reduced: clamp(52px,10vh,90px) → clamp(42px,8vh,72px)
//       so portrait phones don't go fully black during transition.
//    i) min-width clamped so button never overflows a 320 px phone.
//    j) `overflow:visible` removed from button — causes Safari touch-target bug.
//
// 3. GRAIN OVERLAY z-index:98 — was covering interactive content on some
//    stacking contexts. Lowered to z-index:5, pointer-events:none confirmed.
//    Also skipped entirely on mobile (saves ~2 ms/frame on low-end devices).
//
// 4. cdBlink / cdPulse keyframes were inside StrangerThingsTitle's <style>.
//    They're used by DigitBlock / Colon which can mount before that <style>
//    is injected. Moved to the Home-level <style> block.
//
// 5. `Link` import removed — it was imported but never used.
//
// 6. epsilon-welcome uses st-credits-flash which was defined inside
//    StrangerThingsTitle's <style>. Moved that keyframe to Home-level <style>.
// ─────────────────────────────────────────────────────────────────────────────

// ── Mobile detection — stable, evaluated once at module load ──────────────────
const IS_MOBILE =
  typeof window !== "undefined" &&
  (window.matchMedia("(hover:none) and (pointer:coarse)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

// ── Haptic helper ─────────────────────────────────────────────────────────────
function haptic(pattern = 30) {
  try { if (navigator?.vibrate) navigator.vibrate(pattern); } catch (_) {}
}

// ── Countdown logic ───────────────────────────────────────────────────────────
const EVENT_DATE = new Date("2026-03-16T09:00:00+05:30");

function useCountdown() {
  const calc = useCallback(() => {
    const diff = EVENT_DATE - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
      over: false,
    };
  }, []);
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

function DigitBlock({ value, label, pulse }) {
  const str = String(value).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div className={pulse ? "cd-pulse" : ""} style={{
        minWidth: "clamp(52px,13vw,76px)",
        padding: "clamp(8px,1.8vw,14px) clamp(10px,2.2vw,16px)",
        borderRadius: "14px",
        background: "linear-gradient(135deg, rgba(90,10,8,0.22) 0%, rgba(15,3,3,0.32) 100%)",
        border: "1px solid rgba(193,27,31,0.22)",
        borderTop: "1px solid rgba(255,120,60,0.15)",
        backdropFilter: "blur(22px) saturate(1.5) brightness(1.05)",
        WebkitBackdropFilter: "blur(22px) saturate(1.5) brightness(1.05)",
        boxShadow: [
          "0 0 0 1px rgba(193,27,31,0.08)",
          "0 8px 32px rgba(0,0,0,0.35)",
          "inset 0 1px 0 rgba(255,130,70,0.10)",
          "inset 0 -1px 0 rgba(0,0,0,0.25)",
        ].join(", "),
        textAlign: "center",
        fontFamily: "'Bebas Neue','Anton','Impact',monospace",
        fontSize: "clamp(1.6rem,6vw,2.8rem)",
        fontWeight: 900,
        color: "rgba(255,205,170,0.90)",
        letterSpacing: "0.04em",
        lineHeight: 1,
        textShadow: [
          "0 0 10px rgba(255,90,40,0.65)",
          "0 0 26px rgba(193,27,31,0.45)",
          "0 1px 4px rgba(0,0,0,0.75)",
        ].join(", "),
        transition: "box-shadow 0.15s ease",
      }}>{str}</div>
      <span style={{
        fontSize: "clamp(0.42rem,1.4vw,0.58rem)",
        fontWeight: 700, letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(210,160,130,0.60)",
        fontFamily: "'Avant Garde', Avantgarde, 'Century Gothic', sans-serif",
      }}>{label}</span>
    </div>
  );
}

function Colon() {
  return (
    <div style={{
      fontSize: "clamp(1.2rem,4vw,2rem)", fontWeight: 900,
      color: "rgba(220,80,40,0.65)",
      alignSelf: "flex-start",
      paddingTop: "clamp(8px,1.8vw,14px)",
      animation: "cdBlink 1s step-start infinite",
      textShadow: "0 0 10px rgba(193,27,31,0.6)",
    }}>:</div>
  );
}

// ── Stranger Things Title ─────────────────────────────────────────────────────
function StrangerThingsTitle() {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'BenguiatITCW01-BoldCn';
          src: url('/assets/BenguiatProITC-BoldCond.woff') format('woff'),
               url('/assets/BenguiatProITC-BoldCond.ttf') format('truetype');
          font-style: normal; font-weight: bold;
        }
        .st-title-wrap {
          position: relative; display: flex; flex-direction: column;
          align-items: center; width: 100%; user-select: none;
          animation: st-title-entrance 1.4s cubic-bezier(0.15,0.7,0.26,0.88) both;
        }
        @keyframes st-title-entrance {
          0%  { opacity: 0; transform: scale(0.88); }
          60% { opacity: 1; }
          100%{ opacity: 1; transform: scale(1); }
        }
        .st-word {
          display: flex; align-items: center; justify-content: center;
          line-height: 0.9;
          font-family: 'BenguiatITCW01-BoldCn', 'Georgia', 'Times New Roman', serif;
          font-weight: bold; color: #000;
          -webkit-text-stroke: 0.45vmin #C11B1F;
          text-shadow: 0 0 2.2vmin rgba(193,27,31,0.55);
        }
        @supports not (-webkit-text-stroke: 1px red) {
          .st-word {
            color: #C11B1F;
            text-shadow: 3px 0 8px #C11B1F, -3px 0 8px #C11B1F,
                         0 -3px 8px #C11B1F, 0 3px 8px #C11B1F;
          }
        }
        .st-letter {
          display: inline-block;
          font-size: clamp(2.8rem, 14vmin, 18vmin);
          letter-spacing: -0.04em; position: relative;
          vertical-align: top; will-change: transform, opacity;
        }
        .st-letter-lg {
          font-size: clamp(3.4rem, 17vmin, 22vmin);
          transform: translateY(-2.8%); display: inline-block;
        }
        @keyframes st-E  { 0%    { transform:translateX(-180%); opacity:0; } 55%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-P  { 0%,5% { transform:translateY(-120%); opacity:0; } 60%,100%{ transform:translateY(0); opacity:1; } }
        @keyframes st-S  { 0%,10%{ transform:translateX(-80%);  opacity:0; } 62%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-I  { 0%,8% { transform:translateX(-25%);  opacity:0; } 55%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-L  { 0%,8% { transform:translateX(25%);   opacity:0; } 55%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-O  { 0%,12%{ transform:translateY(-120%); opacity:0; } 65%,100%{ transform:translateY(0); opacity:1; } }
        @keyframes st-N  { 0%,5% { transform:translateX(180%);  opacity:0; } 55%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-2  { 0%,15%{ transform:translateX(-60%);  opacity:0; } 68%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-K  { 0%,20%{ transform:translateY(180%);  opacity:0; } 72%,100%{ transform:translateY(0); opacity:1; } }
        @keyframes st-26 { 0%,18%{ transform:translateX(-40%);  opacity:0; } 70%,100%{ transform:translateX(0); opacity:1; } }
        @keyframes st-6  { 0%,15%{ transform:translateY(180%);  opacity:0; } 68%,100%{ transform:translateY(0); opacity:1; } }
        @keyframes st-bar-top  { 0%,62%{ transform:scaleX(0); } 70%,100%{ transform:scaleX(1); } }
        @keyframes st-bar-side { 0%,65%{ transform:scaleX(0); } 73%,100%{ transform:scaleX(1); } }
        .st-bar {
          display: block; height: 0;
          border: 0.35vmin solid #C11B1F; border-radius: 0.1vmin;
          box-shadow: 0 0 1.2vmin rgba(193,27,31,0.85), 0 0 0.5vmin rgba(193,27,31,0.85) inset;
          will-change: transform;
        }
        .st-bar-top  { width:min(72vw,680px); transform-origin:center; animation:st-bar-top  1.4s cubic-bezier(0.15,0.7,0.26,0.88) both; margin-bottom:0.6vmin; }
        .st-bar-left { width:38%; transform-origin:right; animation:st-bar-side 1.4s cubic-bezier(0.15,0.7,0.26,0.88) both; }
        .st-bar-right{ width:38%; transform-origin:left;  animation:st-bar-side 1.4s cubic-bezier(0.15,0.7,0.26,0.88) both; }
        @keyframes st-credits-wiggle {
          0%  { transform:translateX(0) translateY(0);          }
          20% { transform:translateX(0) translateY(-0.5px);     }
          40% { transform:translateX(0.5px) translateY(-0.5px); }
          60% { transform:translateX(0) translateY(0.5px);      }
          80% { transform:translateX(-0.5px) translateY(0);     }
          100%{ transform:translateX(-0.5px) translateY(0.5px); }
        }
        .st-subtitle {
          font-family: 'Avant Garde', Avantgarde, 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
          font-weight: bold; text-transform: uppercase; letter-spacing: 0.3em;
          background: linear-gradient(180deg, #B2B0B1 0%, #A8A6A7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          position: relative;
          animation: st-credits-wiggle 200ms linear infinite 1.4s,
                     st-credits-flash  2.2s  linear infinite 1.4s;
          font-size: clamp(0.55rem, 2vmin, 1rem);
        }
        .st-subtitle::after {
          content: attr(data-text); position: absolute; z-index: -1; inset: 0;
          background: none; -webkit-text-fill-color: transparent;
          text-shadow: 0.3vmin 0.3vmin 0.15vmin rgba(0,0,0,0.9);
        }
        /* Grain — skipped on mobile (rendered conditionally in JSX) */
        @keyframes st-grain {
          0%  { transform:translate(8%,-5%);   } 10%{ transform:translate(0%,0%);     }
          20% { transform:translate(10%,-15%); } 30%{ transform:translate(-10%,0%);   }
          40% { transform:translate(25%,15%);  } 50%{ transform:translate(10%,-10%);  }
          60% { transform:translate(-5%,5%);   } 70%{ transform:translate(15%,0%);    }
          80% { transform:translate(-20%,-10%);} 90%{ transform:translate(20%,15%);   }
          100%{ transform:translate(4%,7%);    }
        }
        .st-grain {
          position: fixed; top:-50vh; left:-50vw; height:200vh; width:200vw;
          pointer-events: none;
          z-index: 5;           /* FIX: was 98 — covered interactive UI */
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          animation: st-grain 4s steps(8) infinite;
        }
      `}</style>

      {/* Grain overlay — desktop only. Saves ~2ms/frame on mobile. */}
      {!IS_MOBILE && <div className="st-grain" aria-hidden="true" />}

      <div className="st-title-wrap" aria-label="EPSILON 2K26">
        <div className="st-bar st-bar-top" />

        <div className="st-word" style={{ fontSize: 0 }}>
          <span className="st-letter" style={{ animation: "st-E 1.4s ease both" }}>
            <span className="st-letter-lg">E</span>
          </span>
          <span className="st-letter" style={{ animation: "st-P 1.4s ease both" }}>P</span>
          <span className="st-letter" style={{ animation: "st-S 1.4s ease both" }}>S</span>
          <span className="st-letter" style={{ animation: "st-I 1.4s ease both" }}>I</span>
          <span className="st-letter" style={{ animation: "st-L 1.4s ease both" }}>L</span>
          <span className="st-letter" style={{ animation: "st-O 1.4s ease both" }}>O</span>
          <span className="st-letter" style={{ animation: "st-N 1.4s ease both" }}>
            <span className="st-letter-lg">N</span>
          </span>
        </div>

        <div className="st-word" style={{ fontSize: 0, marginTop: "clamp(-28px,-3.8vmin,-18px)" }}>
          <span className="st-letter" style={{ animation: "st-2  1.4s ease both" }}>2</span>
          <span className="st-letter" style={{ animation: "st-K  1.4s ease both" }}>K</span>
          <span className="st-letter" style={{ animation: "st-26 1.4s ease both" }}>2</span>
          <span className="st-letter" style={{ animation: "st-6  1.4s ease both" }}>
            <span className="st-letter-lg">6</span>
          </span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", width:"min(72vw,680px)", marginTop:"0.5vmin" }}>
          <div className="st-bar st-bar-left" />
          <div className="st-bar st-bar-right" />
        </div>

        <p className="st-subtitle" data-text="National Level Technical Symposium"
          style={{ marginTop: "clamp(8px,2vmin,16px)" }}>
          National Level Technical Symposium
        </p>
      </div>
    </>
  );
}

// ── PortalCTA ─────────────────────────────────────────────────────────────────
function PortalCTA() {
  const navigate   = useNavigate();
  const btnRef     = useRef(null);
  const mountedRef = useRef(true);
  const timersRef  = useRef([]);

  const [phase, setPhase]   = useState("idle");
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  // Guard setState after unmount; clear all pending timers
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const safeSet = useCallback((v) => {
    if (mountedRef.current) setPhase(v);
  }, []);

  const trigger = useCallback(() => {
    if (phase !== "idle") return;
    haptic([20, 40, 80]);
    safeSet("charging");

    // Shorter timeline on mobile so the transition feels snappy, not sluggish
    const D = IS_MOBILE
      ? { portal: 150, lbox: 480, creds: 680, nav: 1600 }
      : { portal: 180, lbox: 600, creds: 820, nav: 1900 };

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [
      setTimeout(() => safeSet("portal"),    D.portal),
      setTimeout(() => safeSet("letterbox"), D.lbox),
      setTimeout(() => safeSet("credits"),   D.creds),
      setTimeout(() => { if (mountedRef.current) navigate("/events"); }, D.nav),
    ];
  }, [phase, navigate, safeSet]);

  // Capture exact pointer position (works for both mouse and touch)
  const handlePointerDown = (e) => {
    if (phase !== "idle") return;
    if (btnRef.current) {
      const r  = btnRef.current.getBoundingClientRect();
      const cx = e.touches?.[0]?.clientX ?? e.clientX;
      const cy = e.touches?.[0]?.clientY ?? e.clientY;
      setOrigin({
        x: (cx / window.innerWidth)  * 100,
        y: (cy / window.innerHeight) * 100,
      });
    }
    trigger();
  };

  const isActive   = phase !== "idle";
  const showPortal = ["portal", "letterbox", "credits"].includes(phase);
  const showBars   = ["letterbox", "credits"].includes(phase);
  const showCreds  = phase === "credits";

  // Heavy visual effects are desktop-only; they cause full-page repaints on mobile
  const showLightning = !IS_MOBILE && ["charging", "portal"].includes(phase);
  const showRGBFlash  = !IS_MOBILE && ["charging", "portal", "letterbox", "credits"].includes(phase);
  const showGrain     = !IS_MOBILE && showPortal;

  return (
    <>
      <style>{`
        /* ── Button ───────────────────────────────────────────────── */
        .pcta-btn {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          gap: 10px;
          /* clamp padding so button fits 320px phones without wrapping */
          padding: clamp(13px,2.8vw,18px) clamp(26px,5.5vw,52px);
          border-radius: 6px; cursor: pointer; border: none;
          background: transparent; outline: none;
          -webkit-tap-highlight-color: transparent; user-select: none;
          /* FIX: touch-action:manipulation removes 300ms tap delay on iOS/Android */
          touch-action: manipulation;
          font-family: 'Avant Garde', Avantgarde, 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
          font-size: clamp(0.68rem, 2vw, 0.95rem);
          font-weight: 800; letter-spacing: 0.32em; text-transform: uppercase;
          color: #C11B1F;
          text-shadow: 0 0 14px rgba(193,27,31,0.75), 0 0 40px rgba(193,27,31,0.35);
          animation: pcta-label-flash 2.4s step-end infinite;
          /* FIX: min 48px touch target height; width clamped for small phones */
          min-height: 48px;
          min-width: clamp(200px, 55vw, 340px);
          /* FIX: overflow:visible removed — causes Safari touch hit-area bugs */
        }
        .pcta-btn:disabled { cursor: not-allowed; opacity: 0.6; }

        @keyframes pcta-label-flash {
          0%,30%  { opacity: 1;    } 40%     { opacity: 0.88; }
          42%,85% { opacity: 1;    } 92%     { opacity: 0.82; }
          94%,100%{ opacity: 1;    }
        }

        .pcta-ring-outer {
          position: absolute; inset: -2px; border-radius: 8px;
          border: 1.5px solid rgba(193,27,31,0.55);
          box-shadow: 0 0 10px rgba(193,27,31,0.45), 0 0 28px rgba(193,27,31,0.18),
                      inset 0 0 10px rgba(193,27,31,0.12);
          animation: pcta-ring-pulse 1.8s ease-in-out infinite; pointer-events: none;
        }
        .pcta-ring-inner { position:absolute; inset:3px; border-radius:4px;
          border:1px solid rgba(193,27,31,0.20); pointer-events:none; }

        @keyframes pcta-ring-pulse {
          0%,100%{ box-shadow:0 0 10px rgba(193,27,31,0.45),0 0 28px rgba(193,27,31,0.18),inset 0 0 10px rgba(193,27,31,0.12); border-color:rgba(193,27,31,0.55); }
          50%    { box-shadow:0 0 22px rgba(193,27,31,0.80),0 0 55px rgba(193,27,31,0.40),0 0 90px rgba(255,60,30,0.20),inset 0 0 18px rgba(193,27,31,0.25); border-color:rgba(255,80,60,0.85); }
        }

        .pcta-bar-h {
          position: absolute; left:12px; right:12px; height:0;
          border-top: 0.3vmin solid #C11B1F; border-radius: 0.1vmin;
          box-shadow: 0 0 0.8vmin rgba(193,27,31,0.75), 0 0 0.3vmin rgba(193,27,31,0.75) inset;
          transform: scaleX(0); transform-origin: center;
          animation: pcta-bar-grow 0.6s cubic-bezier(0.15,0.7,0.26,0.88) 0.3s both;
        }
        .pcta-bar-top    { top:-2px; }
        .pcta-bar-bottom { bottom:-2px; }
        @keyframes pcta-bar-grow { from{transform:scaleX(0);} to{transform:scaleX(1);} }

        .pcta-btn.charging { animation: pcta-charge 0.18s steps(1) infinite; }
        @keyframes pcta-charge {
          0%  { color:#fff;    text-shadow:0 0 24px #fff,0 0 60px rgba(255,80,30,0.9); }
          33% { color:#C11B1F; text-shadow:0 0 40px rgba(193,27,31,1),0 0 80px rgba(255,60,30,0.7); }
          66% { color:#ff8866; text-shadow:0 0 18px rgba(255,120,60,0.9); }
        }

        /* ── Overlay effects (desktop only) ──────────────────────── */
        .pcta-lightning { position:fixed; inset:0; pointer-events:none; z-index:9001; opacity:0; }
        .pcta-lightning.active { opacity:1; animation:pcta-lightning-fade 0.55s ease-out forwards; }
        @keyframes pcta-lightning-fade { 0%{opacity:1;filter:brightness(2);} 40%{opacity:0.85;} 100%{opacity:0;} }

        .pcta-rgb-flash {
          position:fixed; inset:0; z-index:9000; pointer-events:none;
          opacity:0; background:rgba(193,27,31,0.06); mix-blend-mode:screen;
          animation:pcta-rgb 0.38s steps(1) forwards;
        }
        @keyframes pcta-rgb {
          0%  {opacity:0;filter:none;}
          15% {opacity:1;filter:hue-rotate(0deg);  transform:translateX(-3px);}
          30% {opacity:1;filter:hue-rotate(180deg);transform:translateX(3px); }
          50% {opacity:0.8;filter:hue-rotate(90deg);transform:translateX(-2px);}
          75% {opacity:0.4;}
          100%{opacity:0;transform:translateX(0);}
        }

        /* ── Portal wipe ─────────────────────────────────────────── */
        /* FIX: will-change only while animation is active — avoids
           wasting a permanent compositor layer on mobile devices      */
        .pcta-portal {
          position:fixed; inset:0; z-index:9002; pointer-events:none;
          background:#000;
          clip-path: circle(0% at var(--pcta-ox) var(--pcta-oy));
        }
        .pcta-portal.open {
          will-change: clip-path;
          animation: pcta-portal-open var(--pcta-dur, 0.72s) cubic-bezier(0.76,0,0.24,1) forwards;
        }
        @keyframes pcta-portal-open {
          0%  { clip-path:circle(0%   at var(--pcta-ox) var(--pcta-oy)); }
          100%{ clip-path:circle(160% at var(--pcta-ox) var(--pcta-oy)); }
        }

        /* Grain boost (desktop only — heavy repaint on mobile) */
        .pcta-grain-boost {
          position:fixed; inset:0; z-index:9003; pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");
          background-size:160px; mix-blend-mode:overlay; opacity:0;
          animation:pcta-grain-in 0.22s ease 0.18s forwards,
                    pcta-grain-wiggle 0.5s steps(5) 0.18s infinite;
        }
        @keyframes pcta-grain-in { from{opacity:0;} to{opacity:1;} }
        @keyframes pcta-grain-wiggle {
          0%  {transform:translate(8%,-5%);}   20%{transform:translate(-10%,0%);}
          40% {transform:translate(15%,-15%);} 60%{transform:translate(-5%,10%);}
          80% {transform:translate(20%,5%);}   100%{transform:translate(4%,7%);}
        }

        /* ── Letterbox ───────────────────────────────────────────── */
        .pcta-lbox {
          position:fixed; left:0; right:0; z-index:9004;
          background:#000; pointer-events:none;
          transform:scaleY(0);
          /* CSS transition (not animation) is compositor-friendly on mobile */
          transition:transform 0.32s cubic-bezier(0.76,0,0.24,1);
        }
        .pcta-lbox.open { transform:scaleY(1); }
        /* FIX: reduced height on mobile so portrait phones keep content visible */
        .pcta-lbox-top { top:0;    height:clamp(42px,8vh,72px); transform-origin:top;    }
        .pcta-lbox-bot { bottom:0; height:clamp(42px,8vh,72px); transform-origin:bottom; }
        .pcta-lbox-top::after, .pcta-lbox-bot::before {
          content:''; position:absolute; left:0; right:0; height:0;
          border-bottom:0.3vmin solid #C11B1F;
          box-shadow:0 0 1vmin rgba(193,27,31,0.9),0 0 0.4vmin rgba(193,27,31,0.9) inset;
          animation:pcta-bar-glow 0.4s ease 0.28s both;
        }
        .pcta-lbox-top::after  { bottom:0; }
        .pcta-lbox-bot::before { top:0;    }
        @keyframes pcta-bar-glow {
          from{opacity:0;transform:scaleX(0);transform-origin:center;}
          to  {opacity:1;transform:scaleX(1);transform-origin:center;}
        }

        /* ── Credits ─────────────────────────────────────────────── */
        .pcta-credits {
          position:fixed; inset:0; z-index:9005;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          pointer-events:none;
          gap:clamp(5px,1.2vh,12px);
          /* horizontal padding so text doesn't bleed off small phones */
          padding:0 clamp(12px,4vw,24px);
        }
        .pcta-credit-line {
          font-family:'Avant Garde',Avantgarde,'Century Gothic',CenturyGothic,AppleGothic,sans-serif;
          font-weight:bold; text-transform:uppercase; letter-spacing:0.28em;
          text-align:center; position:relative; opacity:0;
        }
        .pcta-credit-line.show {
          background:linear-gradient(180deg,#B2B0B1 0%,#A8A6A7 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          opacity:1;
          animation:pcta-cred-in 0.28s ease both,
                    pcta-wiggle  200ms linear infinite 0.28s,
                    pcta-flash   2.2s  linear infinite 0.28s;
        }
        .pcta-credit-line.show::after {
          content:attr(data-text); position:absolute; inset:0;
          background:none; -webkit-text-fill-color:transparent;
          text-shadow:0.3vmin 0.3vmin 0.15vmin rgba(0,0,0,0.9);
        }
        .pcta-credit-sub   { font-size:clamp(0.5rem,1.5vw,0.75rem); }
        .pcta-credit-title {
          font-family:'BenguiatITCW01-BoldCn','Georgia','Times New Roman',serif;
          font-size:clamp(1.3rem,4.5vw,2.8rem); font-weight:bold;
          color:#000; -webkit-text-stroke:0.45vmin #C11B1F;
          text-shadow:0 0 2.2vmin rgba(193,27,31,0.6);
          letter-spacing:-0.02em; -webkit-text-fill-color:unset; background:none; opacity:0;
        }
        .pcta-credit-title.show {
          opacity:1;
          animation:pcta-cred-in 0.35s ease 0.18s both,
                    pcta-wiggle  200ms linear infinite 0.5s,
                    pcta-flash   2.2s  linear infinite 0.5s;
        }
        @keyframes pcta-cred-in  { from{opacity:0;transform:scale(0.96);} to{opacity:1;transform:scale(1);} }
        @keyframes pcta-wiggle {
          0%  {transform:translateX(0) translateY(0);}          20%{transform:translateX(0) translateY(-0.5px);}
          40% {transform:translateX(0.5px) translateY(-0.5px);} 60%{transform:translateX(0) translateY(0.5px);}
          80% {transform:translateX(-0.5px) translateY(0);}     100%{transform:translateX(-0.5px) translateY(0.5px);}
        }
        @keyframes pcta-flash {
          0%,30%{opacity:1;} 40%{opacity:0.88;} 42%,85%{opacity:1;} 92%{opacity:0.82;} 94%,100%{opacity:1;}
        }
        .pcta-credit-bar {
          width:clamp(80px,25vw,240px); height:0;
          border-top:0.3vmin solid #C11B1F;
          box-shadow:0 0 1vmin rgba(193,27,31,0.85),0 0 0.4vmin rgba(193,27,31,0.85) inset;
          opacity:0; transform:scaleX(0);
        }
        .pcta-credit-bar.show {
          opacity:1; animation:pcta-bar-slide 0.45s cubic-bezier(0.15,0.7,0.26,0.88) 0.12s both;
        }
        @keyframes pcta-bar-slide { from{transform:scaleX(0);opacity:0;} to{transform:scaleX(1);opacity:1;} }

        /* Tactile feedback on mobile tap */
        .pcta-btn:active:not(:disabled) {
          transform:scale(0.96); transition:transform 0.08s ease;
        }
      `}</style>

      {/* Desktop-only: RGB flash */}
      {showRGBFlash && <div className="pcta-rgb-flash" aria-hidden="true" />}

      {/* Desktop-only: Lightning SVG (12 bolts). Heavy SVG filter → skipped on mobile */}
      {showLightning && (
        <svg className="pcta-lightning active" viewBox="0 0 100 100"
          preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="pcta-glow">
              <feGaussianBlur stdDeviation="0.6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="pcta-grad" x1="50%" y1="50%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#fff8f0" stopOpacity="1"/>
              <stop offset="30%"  stopColor="#ff6030" stopOpacity="0.95"/>
              <stop offset="70%"  stopColor="#C11B1F" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#C11B1F" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          {[
            [50,50, 2,5,   20,15, 8,2  ],[50,50, 50,0,  50,18,50,4  ],
            [50,50, 98,5,  75,15,92,3  ],[50,50,100,40,  85,28,98,38 ],
            [50,50, 98,95, 82,70,96,92 ],[50,50, 50,100, 50,75,50,98 ],
            [50,50,  2,95, 18,72, 4,94 ],[50,50,  0,55,  14,55, 2,55 ],
            [50,50, 15,20, 25,28,12,18 ],[50,50, 85,20,  75,28,88,18 ],
            [50,50, 12,78, 22,65, 8,80 ],[50,50, 88,78,  78,65,92,80 ],
          ].map(([x1,y1,x2,y2,cx1,cy1,cx2,cy2],i) => (
            <path key={i}
              d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
              stroke="url(#pcta-grad)" strokeWidth={i<4?"0.6":"0.35"}
              fill="none" filter="url(#pcta-glow)" strokeLinecap="round"
              opacity={i<6?1:0.7}/>
          ))}
        </svg>
      )}

      {/* Portal wipe */}
      {showPortal && (
        <div className="pcta-portal open" aria-hidden="true"
          style={{
            "--pcta-ox": `${origin.x}%`,
            "--pcta-oy": `${origin.y}%`,
            /* FIX: shorter animation on mobile so it doesn't feel sluggish */
            "--pcta-dur": IS_MOBILE ? "0.5s" : "0.72s",
          }}
        />
      )}

      {/* Desktop-only: grain boost (SVG filter repaints every frame) */}
      {showGrain && <div className="pcta-grain-boost" aria-hidden="true" />}

      {/* Letterbox bars — both mobile and desktop */}
      <div className={`pcta-lbox pcta-lbox-top ${showBars ? "open" : ""}`} aria-hidden="true" />
      <div className={`pcta-lbox pcta-lbox-bot ${showBars ? "open" : ""}`} aria-hidden="true" />

      {/* Credits */}
      {showCreds && (
        <div className="pcta-credits" aria-hidden="true">
          <p className="pcta-credit-line pcta-credit-sub show" data-text="A MSEC EEE Production">
            A MSEC EEE Production
          </p>
          <div className="pcta-credit-bar show" />
          <p className="pcta-credit-title show">EPSILON 2K26</p>
          <div className="pcta-credit-bar show" style={{ animationDelay:"0.22s" }} />
          <p className="pcta-credit-line pcta-credit-sub show"
            data-text="National Level Technical Symposium"
            style={{ animationDelay:"0.08s" }}>
            National Level Technical Symposium
          </p>
        </div>
      )}

      {/* THE BUTTON */}
      <div className="mt-8 sm:mt-12 flex justify-center w-full">
        <button
          ref={btnRef}
          className={`pcta-btn ${phase === "charging" ? "charging" : ""}`}
          /* FIX: onPointerDown fires immediately — no 300ms synthetic delay.
             Works for both mouse (desktop) and touch (mobile). */
          onPointerDown={handlePointerDown}
          disabled={isActive}
          aria-label="Enter Epsilon 2K26 Events"
        >
          <span className="pcta-bar-h pcta-bar-top"    aria-hidden="true" />
          <span className="pcta-bar-h pcta-bar-bottom" aria-hidden="true" />
          <span className="pcta-ring-outer" aria-hidden="true" />
          <span className="pcta-ring-inner" aria-hidden="true" />
          <span style={{ position:"relative", zIndex:1 }}>
            {phase === "idle"     ? "TAP TO ENTER" :
             phase === "charging" ? "OPENING..."   : "ENTERING..."}
          </span>
          <span style={{
            position:"relative", zIndex:1, fontSize:"0.7em", opacity:0.7,
            animation: phase === "idle" ? "pcta-label-flash 2.4s step-end infinite" : "none",
          }} aria-hidden="true">▶</span>
        </button>
      </div>
    </>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const videoRef  = useRef(null);
  const countdown = useCountdown();

  // Robust autoplay — handles browsers that block autoplay until explicit call
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted     = true;   // required by every browser's autoplay policy
    v.playsInline = true;
    const play = () => v.play().catch(() => { /* blocked — poster shows */ });
    if (v.readyState >= 2) { play(); }
    else {
      v.addEventListener("canplay",    play, { once: true });
      v.addEventListener("loadeddata", play, { once: true });
    }
    return () => {
      v.removeEventListener("canplay",    play);
      v.removeEventListener("loadeddata", play);
    };
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          Global keyframes placed here (not inside sub-components) so they are
          registered before any component that uses them mounts.
          cdBlink / cdPulse — used by Colon and DigitBlock.
          st-credits-flash  — used by .epsilon-welcome below.
         ───────────────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes cdBlink {
          0%,100%{ opacity: 1;    }
          50%    { opacity: 0.12; }
        }
        @keyframes cdPulse {
          0%  { box-shadow:0 0 0 1px rgba(193,27,31,0.08),0 8px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,130,70,0.10); }
          50% { box-shadow:0 0 0 1px rgba(193,27,31,0.20),0 0 40px rgba(193,27,31,0.55),0 0 80px rgba(255,80,30,0.20),inset 0 1px 0 rgba(255,150,80,0.20); }
          100%{ box-shadow:0 0 0 1px rgba(193,27,31,0.08),0 8px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,130,70,0.10); }
        }
        .cd-pulse { animation: cdPulse 0.6s ease-in-out; }

        @keyframes st-credits-flash {
          0%,30%  { opacity: 1;    } 40%     { opacity: 0.93; }
          42%,85% { opacity: 1;    } 92%     { opacity: 0.88; }
          94%,100%{ opacity: 1;    }
        }

        .epsilon-welcome {
          color: #A8A6A7;
          font-family: 'Avant Garde', Avantgarde, 'Century Gothic', sans-serif;
          font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase;
          font-size: clamp(0.5rem,1.6vw,0.78rem);
          text-shadow: 0 0 18px rgba(193,27,31,0.6);
          animation: st-credits-flash 2.2s linear infinite;
        }
        .epsilon-sub {
          color: #A8A6A7;
          font-family: 'Avant Garde', Avantgarde, 'Century Gothic', sans-serif;
          font-size: clamp(0.7rem,1.8vw,0.95rem); line-height: 1.85;
          text-shadow: 0 2px 8px rgba(0,0,0,0.9);
        }
        .epsilon-sub-dept { color:#C11B1F; font-weight:600; letter-spacing:0.05em; }

        /* ══════════════════════════════════════════════════════════════
           VIDEO BACKGROUND — THE ROOT FIX
           ══════════════════════════════════════════════════════════════
           ORIGINAL BUG: .home-video { z-index: -20 }
           The <video> is position:fixed, so it lives in its own stacking
           context at the root level. z-index:-20 places it BEHIND the
           browser's default html/body background → completely invisible.
           The two overlay divs used Tailwind "-z-10" (= z-index:-10),
           which is also below the body background.

           CORRECT STACKING (all position:fixed siblings):
             video            → z-index: 0   (base, always painted)
             dark gradient    → z-index: 1   (dims the video)
             red tint radial  → z-index: 2   (colour grade)
             content wrapper  → z-index: 10  (interactive elements)
           ══════════════════════════════════════════════════════════════ */
        .home-video {
          position: fixed; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          z-index: 0;           /* FIX: was -20 */
          pointer-events: none;
        }
        .home-overlay-dark {
          position: fixed; inset: 0;
          background: linear-gradient(to bottom,
            rgba(0,0,0,0.80) 0%,
            rgba(0,0,0,0.55) 45%,
            rgba(0,0,0,0.85) 100%);
          z-index: 1;           /* FIX: was Tailwind -z-10 */
          pointer-events: none;
        }
        .home-overlay-tint {
          position: fixed; inset: 0;
          background:
            radial-gradient(circle at 30% 20%, rgba(193,27,31,0.22), transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(120,0,0,0.22),   transparent 65%);
          opacity: 0.45; filter: blur(8px);
          z-index: 2;           /* FIX: was Tailwind -z-10 */
          pointer-events: none;
        }
        .home-content {
          position: relative;
          z-index: 10;          /* above all overlays */
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">

        {/* ── VIDEO — z-index:0 ── */}
        <video
          ref={videoRef}
          className="home-video"
          src="/bg-video.mp4"
          autoPlay muted loop playsInline
          preload={IS_MOBILE ? "metadata" : "auto"}
          aria-hidden="true"
        />

        {/* ── DARK GRADIENT — z-index:1 ── */}
        <div className="home-overlay-dark" />

        {/* ── RED RADIAL TINT — z-index:2 ── */}
        <div className="home-overlay-tint" />

        {/* ── CONTENT — z-index:10 ── */}
        <div className="home-content min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">

          <p className="epsilon-welcome mt-20 sm:mt-16 mb-6 sm:mb-8">
            Welcome to EPSILON 2K26
          </p>

          <StrangerThingsTitle />

          <p className="epsilon-sub mt-6 sm:mt-8 max-w-xs sm:max-w-lg md:max-w-2xl px-2">
            <span className="epsilon-sub-dept">
              Department of Electrical and Electronics Engineering (EEE)
            </span>
            <br />
            Meenakshi Sundararajan Engineering College
          </p>

          {countdown.over ? (
            <div style={{
              marginTop:"clamp(18px,3vw,28px)",
              padding:"10px 24px", borderRadius:"12px",
              background:"rgba(0,0,0,0.5)",
              border:"1px solid rgba(193,27,31,0.45)",
              backdropFilter:"blur(12px)",
              fontSize:"clamp(0.7rem,2.5vw,1rem)", fontWeight:700,
              letterSpacing:"0.2em", textTransform:"uppercase",
              color:"#C11B1F", textShadow:"0 0 16px rgba(193,27,31,0.75)",
              fontFamily:"'Avant Garde', Avantgarde, 'Century Gothic', sans-serif",
            }}>
              ⚡ Event is Live Today!
            </div>
          ) : (
            <div style={{ marginTop:"clamp(18px,3vw,28px)", textAlign:"center" }}>
              <p style={{
                fontSize:"clamp(0.44rem,1.5vw,0.6rem)", fontWeight:700,
                letterSpacing:"0.25em", textTransform:"uppercase",
                color:"rgba(200,150,120,0.50)", marginBottom:"10px",
                fontFamily:"'Avant Garde', Avantgarde, 'Century Gothic', sans-serif",
              }}>
                Countdown to March 16
              </p>
              <div style={{
                display:"flex", alignItems:"flex-start",
                gap:"clamp(5px,1.5vw,12px)", justifyContent:"center",
              }}>
                <DigitBlock value={countdown.days}    label="Days"    pulse={countdown.seconds === 0} />
                <Colon />
                <DigitBlock value={countdown.hours}   label="Hours"   pulse={countdown.minutes === 0 && countdown.seconds === 0} />
                <Colon />
                <DigitBlock value={countdown.minutes} label="Minutes" pulse={countdown.seconds === 0} />
                <Colon />
                <DigitBlock value={countdown.seconds} label="Seconds" pulse={true} />
              </div>
            </div>
          )}

          <PortalCTA />

          <div className="h-12" />
        </div>
      </div>
    </>
  );
}
