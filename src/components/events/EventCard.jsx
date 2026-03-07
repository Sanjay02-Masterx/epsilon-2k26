import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { getRegistrationStatus, getStatusStyle } from "../../utils/registrationStatus";

// ── Registration status badge ─────────────────────────────────────────────────
function RegStatusBadge() {
  const status = getRegistrationStatus();
  const s      = getStatusStyle(status);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`,
      backdropFilter: "blur(10px)",
      fontSize: "0.55rem", fontWeight: 800,
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: s.color, whiteSpace: "nowrap",
      boxShadow: `0 0 10px ${s.dot}33`,
    }}>
      <span style={{ color: s.dot, fontSize: "0.6rem" }}>{s.icon}</span>
      {s.label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle Burst — guarded against post-unmount setState
// ─────────────────────────────────────────────────────────────────────────────
function ParticleBurst({ x, y, g1, g2, onDone }) {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 90 + 45;
    const size  = Math.random() * 5 + 3;
    const color = [g1, g2, "#ffffff", "#ff8888", g1][Math.floor(Math.random() * 5)];
    return { angle, speed, size, color, delay: Math.random() * 50 };
  });

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => { if (alive) onDone(); }, 700);
    return () => { alive = false; clearTimeout(t); };
  }, [onDone]);

  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 9999 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: p.size, height: p.size,
          borderRadius: "50%", background: p.color,
          boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
          animation: `ecParticleFly 0.65s cubic-bezier(0.22,1,0.36,1) ${p.delay}ms both`,
          "--dx": `${Math.cos(p.angle) * p.speed}px`,
          "--dy": `${Math.sin(p.angle) * p.speed}px`,
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Touch detection
// ─────────────────────────────────────────────────────────────────────────────
function useIsTouch() {
  const [v, setV] = useState(false);
  useEffect(() => {
    setV(
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
  }, []);
  return v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rounds badge
// ─────────────────────────────────────────────────────────────────────────────
function RoundsBadge({ count, color }) {
  if (!count) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 20,
      background: `${color}22`, border: `1px solid ${color}55`,
      fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#fff", backdropFilter: "blur(8px)",
      whiteSpace: "nowrap",
    }}>
      <span style={{ color, fontWeight: 900 }}>{count}</span>&nbsp;Rounds
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main EventCard — fully mobile responsive
// ─────────────────────────────────────────────────────────────────────────────
export default function EventCard({ event }) {
  const navigate   = useNavigate();
  const isTouch    = useIsTouch();
  const cardRef    = useRef(null);
  const mountedRef = useRef(true);

  const [expanded, setExpanded] = useState(false);
  const [burst,    setBurst]    = useState(null);
  const [imgError, setImgError] = useState(false);
  const [glitch,   setGlitch]   = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const g1 = event.gradient?.[0] || "#dc2626";
  const g2 = event.gradient?.[1] || "#7f1d1d";

  const hasPoster  = !!event.poster && !imgError;
  const isTech     = event.category === "Technical";
  const roundCount = event.details?.rounds?.length || 0;

  const descText =
    Array.isArray(event.details?.description) && event.details.description.length > 0
      ? event.details.description[0].slice(0, 140) + (event.details.description[0].length > 140 ? "…" : "")
      : "Discover exciting challenges and workshops.";

  const doNavigate = useCallback((e) => {
    try { if (navigator.vibrate) navigator.vibrate(30); } catch(_) {}
    setGlitch(true);
    const rect = cardRef.current?.getBoundingClientRect();
    setBurst({
      x: e?.clientX ?? rect.left + rect.width / 2,
      y: e?.clientY ?? rect.top  + rect.height / 2,
    });
    setTimeout(() => {
      if (mountedRef.current) navigate(`/events/${event.id}`);
    }, 320);
  }, [navigate, event.id]);

  const handleTap = (e) => {
    if (!isTouch) { doNavigate(e); return; }
    if (!expanded) { e.stopPropagation(); setExpanded(true); return; }
    doNavigate(e);
  };

  useEffect(() => {
    if (!expanded) return;
    const h = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        if (mountedRef.current) setExpanded(false);
      }
    };
    document.addEventListener("touchstart", h);
    return () => document.removeEventListener("touchstart", h);
  }, [expanded]);

  return (
    <>
      <style>{`
        @keyframes ecParticleFly {
          from { transform: translate(0,0) scale(1); opacity: 1; }
          to   { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes ecScan {
          0%   { top: -6px; opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.8; }
          100% { top: 105%; opacity: 0; }
        }
        @keyframes ecShimmer {
          0%   { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(250%) skewX(-18deg); }
        }
        @keyframes ecGlitch {
          0%   { clip-path: inset(0 0 95% 0); transform: translate(-4px,0); opacity:0.8; }
          25%  { clip-path: inset(40% 0 50% 0); transform: translate(4px,0); }
          50%  { clip-path: inset(60% 0 20% 0); transform: translate(-3px,0); }
          75%  { clip-path: inset(20% 0 70% 0); transform: translate(2px,0); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity:0; }
        }
        @keyframes ecTapPulse {
          0%,100% { opacity: 0.28; }
          50%     { opacity: 0.65; }
        }
        @property --ec-ba {
          syntax: "<angle>"; initial-value: 0deg; inherits: false;
        }
        @keyframes ecBSpin { to { --ec-ba: 360deg; } }

        /* ──────────── CARD SHELL ──────────── */
        .ec-wrap {
          position: relative;
          width: 100%; height: 100%;
          border-radius: 16px; overflow: hidden; cursor: pointer;
          transition: transform 0.42s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s ease;
          box-shadow: 0 6px 28px rgba(0,0,0,0.65);
          isolation: isolate;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        @media (hover: hover) {
          .ec-wrap:hover {
            transform: translateY(-10px) scale(1.025);
            box-shadow: 0 24px 64px rgba(0,0,0,0.8), 0 0 50px var(--ec-glow);
          }
        }
        .ec-wrap.ec-active {
          transform: translateY(-5px) scale(1.015);
          box-shadow: 0 16px 48px rgba(0,0,0,0.8), 0 0 38px var(--ec-glow);
        }

        /* ──────────── POSTER IMAGE ──────────── */
        .ec-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease;
          filter: brightness(0.82) saturate(1.1) contrast(1.04);
          will-change: transform, filter;
          user-select: none; -webkit-user-select: none;
        }
        @media (hover: hover) {
          .ec-wrap:hover .ec-img {
            transform: scale(1.08);
            filter: brightness(0.45) saturate(1.5) contrast(1.1);
          }
        }
        .ec-wrap.ec-active .ec-img {
          transform: scale(1.05);
          filter: brightness(0.48) saturate(1.4) contrast(1.08);
        }

        /* ──────────── GRADIENT FALLBACK ──────────── */
        .ec-grad-bg {
          position: absolute; inset: 0;
          transition: transform 0.7s ease, filter 0.5s ease;
        }
        @media (hover: hover) {
          .ec-wrap:hover .ec-grad-bg { transform: scale(1.08); filter: brightness(0.7); }
        }
        .ec-wrap.ec-active .ec-grad-bg { transform: scale(1.05); filter: brightness(0.72); }

        /* ──────────── OVERLAYS ──────────── */
        .ec-noise {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.04; mix-blend-mode: overlay;
        }
        .ec-vig { position: absolute; inset: 0; pointer-events: none; }
        .ec-tint {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0; transition: opacity 0.5s ease; mix-blend-mode: screen;
        }
        @media (hover: hover) { .ec-wrap:hover .ec-tint { opacity: 1; } }
        .ec-wrap.ec-active .ec-tint { opacity: 1; }

        /* ──────────── SCANLINE ──────────── */
        .ec-scan {
          position: absolute; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent 0%,
            rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.85) 50%,
            rgba(255,255,255,0.5) 60%, transparent 100%);
          pointer-events: none; opacity: 0;
        }
        @media (hover: hover) {
          .ec-wrap:hover .ec-scan { animation: ecScan 3s linear infinite; }
        }
        .ec-wrap.ec-active .ec-scan { animation: ecScan 3s linear infinite; }

        /* ──────────── SHIMMER ──────────── */
        .ec-shimmer {
          position: absolute; inset: 0; pointer-events: none; opacity: 0;
          background: linear-gradient(108deg, transparent 38%,
            rgba(255,255,255,0.06) 50%, transparent 62%);
        }
        @media (hover: hover) {
          .ec-wrap:hover .ec-shimmer { opacity: 1; animation: ecShimmer 2.4s ease infinite; }
        }
        .ec-wrap.ec-active .ec-shimmer { opacity: 1; animation: ecShimmer 2.4s ease infinite; }

        /* ──────────── BORDER RING ──────────── */
        .ec-ring {
          position: absolute; inset: 0; border-radius: 16px; padding: 1.5px;
          animation: ecBSpin 5s linear infinite;
          background: conic-gradient(from var(--ec-ba),
            transparent 0%, transparent 65%,
            rgba(255,255,255,0.07) 72%, rgba(255,255,255,0.3) 76%,
            rgba(255,255,255,0.07) 80%, transparent 87%);
          pointer-events: none;
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
                        linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        @media (hover: hover) { .ec-wrap:hover .ec-ring { animation-duration: 1.5s; } }
        .ec-wrap.ec-active .ec-ring { animation-duration: 1.8s; }

        /* ──────────── GLITCH ──────────── */
        .ec-glitch {
          position: absolute; inset: 0; pointer-events: none; z-index: 20;
          background: rgba(255,255,255,0.18); opacity: 0;
        }
        .ec-glitch.on { animation: ecGlitch 0.28s steps(1) forwards; }

        /* ──────────── BADGES (top) ──────────── */
        .ec-badges {
          position: absolute; top: 11px; left: 11px; right: 11px; z-index: 5;
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 5px;
          pointer-events: none;
        }
        .ec-cat {
          font-size: 0.54rem; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 20px;
          backdrop-filter: blur(10px); white-space: nowrap;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        /* ──────────── CONTENT ──────────── */
        .ec-body {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .ec-panel {
          padding: clamp(26px,5vw,38px) clamp(13px,2.8vw,18px) clamp(13px,2.8vw,16px);
        }

        /* Title — fluid, 2-line max */
        .ec-title {
          font-family: 'Bebas Neue','Anton','Impact','Arial Black',sans-serif;
          font-size: clamp(1.1rem, 5vw, 1.55rem);
          font-weight: 900; line-height: 1.0; color: #fff;
          letter-spacing: 0.03em;
          text-shadow: 0 2px 18px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.7);
          margin-bottom: 3px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .ec-sub {
          font-size: clamp(0.47rem, 1.4vw, 0.54rem);
          font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); margin-bottom: 7px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Divider */
        .ec-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--ec-g1) 0%, transparent 100%);
          margin-bottom: 9px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.42s cubic-bezier(0.4,0,0.2,1) 0.04s;
        }
        @media (hover: hover) { .ec-wrap:hover .ec-divider { transform: scaleX(1); } }
        .ec-wrap.ec-active .ec-divider { transform: scaleX(1); }

        /* Description */
        .ec-desc {
          font-size: clamp(0.58rem, 1.7vw, 0.67rem);
          line-height: 1.55; color: rgba(255,255,255,0.72);
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
          max-height: 0; opacity: 0; margin-bottom: 0;
          transition: max-height 0.42s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.33s ease 0.07s, margin-bottom 0.35s ease;
          text-shadow: 0 1px 8px rgba(0,0,0,0.95);
        }
        @media (hover: hover) {
          .ec-wrap:hover .ec-desc { max-height: 78px; opacity: 1; margin-bottom: 9px; }
        }
        .ec-wrap.ec-active .ec-desc { max-height: 78px; opacity: 1; margin-bottom: 9px; }

        /* Chips */
        .ec-chips {
          display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
          margin-bottom: 9px; opacity: 0; transform: translateY(6px);
          transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        }
        @media (hover: hover) { .ec-wrap:hover .ec-chips { opacity: 1; transform: translateY(0); } }
        .ec-wrap.ec-active .ec-chips { opacity: 1; transform: translateY(0); }
        .ec-chip {
          font-size: clamp(0.46rem, 1.4vw, 0.54rem);
          font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 20px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.62); white-space: nowrap;
          max-width: 130px; overflow: hidden; text-overflow: ellipsis;
        }

        /* Explore button */
        .ec-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: clamp(6px,1.4vw,9px) clamp(11px,2.5vw,17px);
          border-radius: 8px;
          font-size: clamp(0.55rem, 1.7vw, 0.67rem);
          font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; cursor: pointer;
          background: rgba(255,255,255,0.1); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.22);
          opacity: 0; transform: translateY(8px);
          transition: background 0.25s, border 0.25s, box-shadow 0.25s,
                      opacity 0.3s ease 0.14s, transform 0.3s ease 0.14s;
          white-space: nowrap;
          min-height: 34px; /* accessible touch target */
        }
        @media (hover: hover) {
          .ec-wrap:hover .ec-btn { opacity: 1; transform: translateY(0); }
          .ec-btn:hover {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.45);
            transform: translateX(4px) translateY(0) !important;
          }
          .ec-btn:hover .ec-arr { transform: translateX(4px); }
        }
        .ec-wrap.ec-active .ec-btn { opacity: 1; transform: translateY(0); }
        .ec-arr { transition: transform 0.2s ease; display: inline-block; }

        /* Date */
        .ec-date {
          display: flex; align-items: center; gap: 4px;
          font-size: clamp(0.46rem, 1.4vw, 0.53rem);
          font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-top: 7px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* Tap hint */
        .ec-tap {
          position: absolute; bottom: 9px; right: 11px;
          font-size: 0.47rem; font-family: monospace; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          pointer-events: none;
          animation: ecTapPulse 2s ease-in-out infinite;
        }

        /* ──────────── MOBILE OVERRIDES (≤480px) ──────────── */
        @media (max-width: 480px) {
          .ec-wrap  { border-radius: 13px; }
          .ec-ring  { border-radius: 13px; }
          .ec-badges { top: 10px; left: 10px; right: 10px; }
          .ec-cat   { font-size: 0.5rem; padding: 2px 6px; }
          /* Larger title on phones so it's clearly readable */
          .ec-title { font-size: clamp(1.2rem, 6vw, 1.6rem); }
        }

        /* ──────────── VERY SMALL (≤360px) ──────────── */
        @media (max-width: 360px) {
          .ec-title { font-size: 1.1rem; }
          .ec-chip  { font-size: 0.44rem; padding: 2px 5px; }
        }
      `}</style>

      {burst && (
        <ParticleBurst
          x={burst.x} y={burst.y} g1={g1} g2={g2}
          onDone={() => { if (mountedRef.current) setBurst(null); }}
        />
      )}

      <div
        ref={cardRef}
        className={`ec-wrap${expanded ? " ec-active" : ""}`}
        style={{ "--ec-g1": g1, "--ec-g2": g2, "--ec-glow": `${g1}55` }}
        onClick={handleTap}
      >
        {/* Poster or gradient */}
        {hasPoster ? (
          <img
            src={event.poster}
            alt={event.title}
            className="ec-img"
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : (
          <div
            className="ec-grad-bg"
            style={{ background: `linear-gradient(155deg, ${g1} 0%, ${g2} 55%, #050505 100%)` }}
          />
        )}

        <div className="ec-noise" />

        <div
          className="ec-vig"
          style={{
            background: hasPoster
              ? `linear-gradient(to bottom,
                  rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.0) 16%,
                  rgba(0,0,0,0.46) 46%, rgba(0,0,0,0.93) 74%,
                  rgba(0,0,0,0.98) 100%)`
              : `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.96) 100%)`,
          }}
        />

        <div
          className="ec-tint"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${g1}60 0%, transparent 68%)` }}
        />

        <div className="ec-scan" />
        <div className="ec-shimmer" />
        <div className="ec-ring" />

        <div
          className={`ec-glitch${glitch ? " on" : ""}`}
          onAnimationEnd={() => setGlitch(false)}
        />

        {/* TOP BADGES */}
        <div className="ec-badges">
          {/* Row 1: category + rounds */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span
              className="ec-cat"
              style={{
                background: isTech ? "rgba(220,38,38,0.85)" : "rgba(202,138,4,0.88)",
                color:      isTech ? "#fff" : "#1a0e00",
                border:     `1px solid ${isTech ? "rgba(255,100,100,0.4)" : "rgba(255,210,0,0.45)"}`,
              }}
            >
              {event.category}
            </span>
            <RoundsBadge count={roundCount} color={g1} />
          </div>
          {/* Row 2: registration status */}
          <RegStatusBadge />
        </div>

        {/* CONTENT */}
        <div className="ec-body">
          <div className="ec-panel">
            {event.subtitle && <div className="ec-sub">{event.subtitle}</div>}

            <h3 className="ec-title">{event.title}</h3>

            <div className="ec-divider" />

            <p className="ec-desc">{descText}</p>

            <div className="ec-chips">
              {event.meta?.teamSize && (
                <span className="ec-chip">👥 {event.meta.teamSize}</span>
              )}
              {event.venue && (
                <span className="ec-chip">📍 {event.venue}</span>
              )}
            </div>

            <button
              className="ec-btn"
              style={{ borderColor: `${g1}70`, boxShadow: `0 0 18px ${g1}28` }}
              onClick={(e) => { e.stopPropagation(); doNavigate(e); }}
              aria-label={`Explore ${event.title}`}
            >
              {isTouch && !expanded ? "Tap to expand" : "Explore Event"}
              <span className="ec-arr">→</span>
            </button>

            {event.date && (
              <div className="ec-date">
                <span>📅</span>
                <span>{event.date}</span>
              </div>
            )}
          </div>
        </div>

        {isTouch && !expanded && <span className="ec-tap">tap</span>}
      </div>
    </>
  );
}
