import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/saankeethikafilled.png";

export default function Home() {
  const canvasRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    const coarse =
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    const ua =
      typeof navigator !== "undefined" ? navigator.userAgent : "";
    const mobileUA = /Android|iPhone|iPad|iPod/i.test(ua);
    return coarse || small || mobileUA;
  }, []);

  useEffect(() => {
    let bg = null;
    let destroyed = false;
    let rafId = null;
    let t = 0;

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else rafId = requestAnimationFrame(animate);
    };

    async function init() {
      try {
        const module = await import(
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js"
        );
        const Grid1Background = module.default;

        if (!canvasRef.current || destroyed) return;

        const canvas = canvasRef.current;

        // Create background properly
        bg = Grid1Background(canvas);

        const RED1 = 0xff1744;
        const RED2 = 0xb00020;
        const RED3 = 0x5c0011;

        bg.grid.setColors([RED1, RED2, RED3]);
        bg.grid.light1.color.set(RED1);
        bg.grid.light2.color.set(RED2);

        if (isMobile) {
          bg.renderer.setPixelRatio(1);
          bg.grid.light1.intensity = 1000;
          bg.grid.light2.intensity = 450;
        } else {
          bg.grid.light1.intensity = 1800;
          bg.grid.light2.intensity = 750;
        }

        if (bg.grid?.material) {
          bg.grid.material.opacity = 0.85;
          bg.grid.material.transparent = true;
        }

        document.addEventListener("visibilitychange", onVisibility);
        rafId = requestAnimationFrame(animate);
      } catch (err) {
        console.error("Failed to init background:", err);
      }
    }

    function animate() {
      if (destroyed || !bg) return;

      t += isMobile ? 0.01 : 0.015;

      const pulse = 0.85 + Math.sin(t) * 0.12;
      const flicker =
        1 + (Math.random() - 0.5) * 0.03;

      bg.grid.light1.intensity =
        (isMobile ? 1000 : 1800) *
        pulse *
        flicker;

      bg.grid.light2.intensity =
        (isMobile ? 450 : 750) *
        (0.9 + Math.sin(t * 0.6) * 0.08);

      rafId = requestAnimationFrame(animate);
    }

    init();

    return () => {
      destroyed = true;
      stop();
      document.removeEventListener(
        "visibilitychange",
        onVisibility
      );
      try {
        if (bg?.destroy) bg.destroy();
        if (bg?.dispose) bg.dispose();
      } catch {}
    };
  }, [isMobile]);

  return (
    <div className="relative min-h-screen">
      {/* Glitch Styles */}
      <style>{`
        @keyframes autoGlitch {
          0%, 85%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
            opacity: 1;
          }
          86% {
            transform: translate(-3px, 2px);
            filter: hue-rotate(90deg);
            opacity: 0.9;
          }
          88% {
            transform: translate(3px, -2px);
            filter: hue-rotate(-90deg);
            opacity: 0.8;
          }
          90% {
            transform: translate(-3px, -2px);
            filter: hue-rotate(45deg);
            opacity: 1;
          }
          92% {
            transform: translate(3px, 2px);
            filter: hue-rotate(-45deg);
            opacity: 0.9;
          }
          95% {
            transform: translate(-2px, 0);
            filter: hue-rotate(0);
          }
          98% {
            transform: translate(0);
            filter: hue-rotate(0);
          }
        }

        .animate-auto-glitch {
          animation: autoGlitch 3s step-end infinite;
        }
      `}</style>

      {/* Background Canvas (ALL devices) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
      />

      {/* Overlays */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-black/70 to-red-950/30" />
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,23,68,0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(140,0,0,0.25),transparent_65%)] opacity-40 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="mt-16 mb-8 text-red-400 font-bold tracking-[0.3em] uppercase animate-pulse text-sm md:text-base drop-shadow-2xl">
          Welcome to EPSILON 2K26
        </p>

        <div className="relative flex items-center justify-center w-full max-w-4xl mx-auto select-none">
          <img
            src={Logo}
            alt="EPSILON Logo"
            className="w-full max-w-[300px] md:max-w-[750px] object-contain drop-shadow-[0_0_55px_rgba(255,23,68,0.65)] animate-auto-glitch transition-all duration-300"
          />
        </div>

        <div className="relative flex flex-col items-center mt-5 w-full">
          <div className="w-1/3 md:w-1/4 h-1 bg-red-500/60 blur-md rounded-full"></div>
          <div className="-mt-1 w-1/5 md:w-1/6 h-0.5 bg-red-300 shadow-[0_0_25px_rgba(255,23,68,0.95)] rounded-full"></div>
        </div>

        <p className="mt-12 text-gray-200 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-xl">
          National Level Technical Symposium <br />
          <span className="text-red-400 font-semibold tracking-wide">
            Department of Electrical and Electronics Engineering (EEE)
          </span>
        </p>

        <div className="mt-14 flex flex-col sm:flex-row gap-6">
          <Link
            to="/events"
            className="px-10 py-5 rounded-lg border-2 border-red-500/50 bg-black/30 backdrop-blur-md text-red-200 font-bold uppercase tracking-widest hover:bg-red-500/10 hover:border-red-300 transition hover:shadow-[0_0_45px_rgba(255,23,68,0.5)]"
          >
            Explore Events
          </Link>

          <Link
            to="/events"
            className="px-10 py-5 rounded-lg border border-gray-600/40 bg-black/30 backdrop-blur-md text-gray-100 font-bold uppercase tracking-widest hover:border-red-500/60 hover:text-red-300 transition hover:shadow-[0_0_35px_rgba(255,23,68,0.35)]"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}