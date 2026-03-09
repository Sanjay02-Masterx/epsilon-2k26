import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  STTitleReveal — Stranger Things–Style Per-Letter Cinematic Title Assembly
// ─────────────────────────────────────────────────────────────────────────────
//
//  HOW TO USE (drop-in, zero layout change):
//  ------------------------------------------
//  In Events.jsx, wrap each GlitchText heading like this:
//
//    <STTitleReveal>
//      <GlitchText as="h1" className="..." intensity="medium" color="#dc2626">
//        Pick Your Card!
//      </GlitchText>
//    </STTitleReveal>
//
//  That's it. GlitchText renders exactly as before underneath.
//  STTitleReveal adds a cinematic letter-assembly overlay on scroll entry.
//  After the animation completes (~2.2s) the overlay removes itself from DOM.
//  The original GlitchText underneath becomes fully visible and takes over.
//
//  PROPS:
//    children   — your existing GlitchText (or any heading element)
//    delay      — ms before animation starts after scroll trigger (default: 0)
//    className  — extra wrapper classes if needed
// ─────────────────────────────────────────────────────────────────────────────

// ── Direction pool — each letter draws from this to get a unique origin ──────
// Mirrors the Stranger Things source: letters fly in from varied directions
const DIRECTIONS = [
  { x: -180, y:    0 },  // hard left
  { x:  180, y:    0 },  // hard right
  { x:    0, y: -140 },  // straight down from above
  { x:    0, y:  140 },  // rise from below
  { x: -140, y:  -90 },  // top-left diagonal
  { x:  140, y:  -90 },  // top-right diagonal
  { x: -100, y:   90 },  // bottom-left diagonal
  { x:  100, y:   90 },  // bottom-right diagonal
  { x: -220, y:  -40 },  // far left, slight up
  { x:  220, y:   40 },  // far right, slight down
];

// Assign a direction per letter index — deterministic so it looks intentional
function dirFor(idx, total) {
  // alternate sides so it feels balanced, not random chaos
  const base = DIRECTIONS[idx % DIRECTIONS.length];
  // scale intensity: letters near center travel less, edges travel more
  const edgeFactor = 0.7 + (Math.abs(idx - total / 2) / (total / 2)) * 0.5;
  return { x: base.x * edgeFactor, y: base.y * edgeFactor };
}

// Stagger delay per letter — slight acceleration curve (first letters faster)
function staggerMs(idx, total) {
  // quadratic ease-in stagger: first few letters arrive quickly, last one lands with weight
  const t = idx / Math.max(total - 1, 1);
  return Math.round(t * t * 680); // 0ms … 680ms spread
}

// ── The overlay that plays the animation ────────────────────────────────────
// Extract text content from children to drive the letter animation
function extractText(node) {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node))
    return node.map(extractText).join("");
  if (node?.props?.children)
    return extractText(node?.props?.children);
  return "";
}

function LetterAssemblyOverlay({ text, color, onDone }) {
  const [phase, setPhase] = useState("fly"); // fly → settle → glow → done
  const letters = text.split("").filter(ch => ch !== "\n");
  const total   = letters.length;

  // Phase timeline:
  //  0ms       — letters start flying in (staggered)
  //  680ms     — last letter arrives
  //  780ms     — all settled → trigger settle phase (stroke appears)
  //  1100ms    — glow burst fires
  //  1800ms    — fade overlay out, call onDone
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("settle"), 780);
    const t2 = setTimeout(() => setPhase("glow"),   1100);
    const t3 = setTimeout(() => { setPhase("done"); onDone(); }, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const isDone = phase === "done";

  return (
    <div
      aria-hidden="true"
      style={{
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        pointerEvents:  "none",
        zIndex:         20,
        opacity:        isDone ? 0 : 1,
        transition:     isDone ? "opacity 0.35s ease" : "none",
        // Match the heading's text alignment exactly
        flexWrap:       "wrap",
        gap:            0,
        padding:        "0 4px",
      }}
    >
      {letters.map((ch, i) => {
        const dir      = dirFor(i, total);
        const delay    = staggerMs(i, total);
        const isSpace  = ch === " ";

        return (
          <span
            key={i}
            style={{
              display:        "inline-block",
              // Preserve spacing
              width:          isSpace ? "0.32em" : "auto",
              whiteSpace:     "pre",

              // ── FLY phase: letter is at its origin offset, invisible ──
              // ── SETTLE/GLOW phase: letter is at (0,0), fully visible ──
              transform: (phase === "fly")
                ? `translate(${dir.x}px, ${dir.y}px) scale(1.15)`
                : "translate(0,0) scale(1)",

              opacity: (phase === "fly") ? 0 : 1,

              // ── Typography — mirrors the existing heading sizes ──────────
              fontFamily:     "inherit",
              fontSize:       "inherit",
              fontWeight:     "inherit",
              lineHeight:     "inherit",
              letterSpacing:  "inherit",
              textTransform:  "inherit",

              // ── GLOW phase: red stroke appears when fully settled ────────
              WebkitTextStroke: (phase === "glow")
                ? `1.5px ${color}`
                : "0px transparent",
              textShadow: (phase === "glow")
                ? `0 0 18px ${color}, 0 0 45px ${color}88, 0 0 80px ${color}44`
                : "none",
              color: (phase === "fly" || phase === "settle") ? "inherit" : undefined,

              // Stroke + glow fade in smoothly — single transition property
              transition: (phase === "fly")
                ? "none"
                : (phase === "glow")
                  ? `transform   0.52s cubic-bezier(0.22,1.0,0.36,1) ${delay}ms,
                     opacity     0.38s ease                           ${delay}ms,
                     text-shadow 0.45s ease                           ${Math.round(delay * 0.4)}ms,
                     -webkit-text-stroke 0.3s ease                   ${Math.round(delay * 0.3)}ms`
                  : `transform 0.52s cubic-bezier(0.22,1.0,0.36,1) ${delay}ms,
                     opacity   0.38s ease                           ${delay}ms`,
            }}
          >
            {ch}
          </span>
        );
      })}

      {/* ── Global glow burst behind the whole title ── */}
      {phase === "glow" && (
        <div style={{
          position:   "absolute",
          inset:      "-20px -40px",
          background: `radial-gradient(ellipse at 50% 50%, ${color}28 0%, transparent 68%)`,
          animation:  "stGlowPulse 0.9s ease-out forwards",
          pointerEvents: "none",
          borderRadius: "12px",
        }} />
      )}
    </div>
  );
}

// ── Main exported component ──────────────────────────────────────────────────
export default function STTitleReveal({
  children,
  delay = 0,
  color = "#dc2626",
  className = "",
}) {
  const wrapRef      = useRef(null);
  const [fired,  setFired]  = useState(false); // has IntersectionObserver triggered?
  const [active, setActive] = useState(false); // is overlay currently playing?
  const [done,   setDone]   = useState(false); // is animation fully complete?

  // Extract text content from children to drive the letter animation
  const rawText  = extractText(children);
  // Normalize: collapse newlines to spaces, trim
  const text     = rawText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  // IntersectionObserver — trigger once on scroll into view
  useEffect(() => {
    if (fired) return;
    const el = wrapRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          setFired(true);
          const t = setTimeout(() => setActive(true), delay);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.35 } // at least 35% visible before firing
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fired, delay]);

  const handleDone = useCallback(() => {
    setActive(false);
    setDone(true);
  }, []);

  return (
    <>
      <style>{`
        /* ── Global glow burst keyframe ────────────────────────────────── */
        @keyframes stGlowPulse {
          0%   { opacity: 0;   transform: scale(0.94); }
          35%  { opacity: 1;   transform: scale(1.02); }
          100% { opacity: 0;   transform: scale(1.08); }
        }

        /* ── Subtle final shimmer on the children heading after done ─── */
        @keyframes stPostGlow {
          0%, 100% { filter: brightness(1)   drop-shadow(0 0  0px transparent); }
          50%      { filter: brightness(1.06) drop-shadow(0 0 14px ${color}55); }
        }

        .st-reveal-done {
          animation: stPostGlow 3.5s ease-in-out infinite;
          animation-delay: 0.3s;
        }
      `}</style>

      <div
        ref={wrapRef}
        className={`st-reveal-wrap ${className}`}
        style={{
          position: "relative",
          display:  "inline-block",
          width:    "100%",
          textAlign: "center",
        }}
      >
        {/* ── Original children (GlitchText) ─────────────────────────────
            Visibility:
              • Before fired → fully visible (SSR / no-JS fallback)
              • While active  → invisible (overlay is playing)
              • After done    → fully visible again + subtle post-glow
        ─────────────────────────────────────────────────────────────── */}
        <div
          className={done ? "st-reveal-done" : ""}
          style={{
            opacity:    (fired && active) ? 0 : 1,
            transition: active ? "none" : "opacity 0.4s ease",
          }}
        >
          {children}
        </div>

        {/* ── Letter Assembly Overlay — only mounts while active ─────── */}
        {active && text && (
          <LetterAssemblyOverlay
            text={text}
            color={color}
            onDone={handleDone}
          />
        )}
      </div>
    </>
  );
}
