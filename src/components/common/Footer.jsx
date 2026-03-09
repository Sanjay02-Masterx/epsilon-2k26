import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  MessageCircle,
  Globe,
  ArrowUpRight,
  Phone,
  Headset,
  X,
  User,
  ChevronUp,
  Zap,
} from "lucide-react";

// ── Circuit Board SVG pattern ─────────────────────────────────────────────────
const CIRCUIT_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='none'/%3E%3Cg stroke='%23ff2222' stroke-width='0.6' fill='none' opacity='0.55'%3E%3Cline x1='0' y1='30' x2='40' y2='30'/%3E%3Cline x1='50' y1='30' x2='120' y2='30'/%3E%3Cline x1='0' y1='90' x2='70' y2='90'/%3E%3Cline x1='80' y1='90' x2='120' y2='90'/%3E%3Cline x1='30' y1='0' x2='30' y2='20'/%3E%3Cline x1='30' y1='40' x2='30' y2='80'/%3E%3Cline x1='30' y1='100' x2='30' y2='120'/%3E%3Cline x1='90' y1='0' x2='90' y2='80'/%3E%3Cline x1='90' y1='100' x2='90' y2='120'/%3E%3Cpolyline points='50,30 50,60 80,60'/%3E%3Cpolyline points='70,90 70,60 80,60'/%3E%3Cpolyline points='90,80 90,90 80,90'/%3E%3Ccircle cx='30' cy='30' r='3.5' fill='%23ff2222' opacity='0.5'/%3E%3Ccircle cx='90' cy='30' r='3.5' fill='%23ff2222' opacity='0.5'/%3E%3Ccircle cx='30' cy='90' r='3.5' fill='%23ff2222' opacity='0.5'/%3E%3Ccircle cx='90' cy='90' r='3.5' fill='%23ff2222' opacity='0.5'/%3E%3Ccircle cx='80' cy='60' r='3' fill='%23ff2222' opacity='0.4'/%3E%3Ccircle cx='50' cy='60' r='2.5' fill='%23ff2222' opacity='0.35'/%3E%3Crect x='38' y='44' width='24' height='16' rx='2' fill='none' stroke='%23ff4444' stroke-width='0.8' opacity='0.5'/%3E%3Cline x1='41' y1='44' x2='41' y2='40' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='46' y1='44' x2='46' y2='40' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='51' y1='44' x2='51' y2='40' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='56' y1='44' x2='56' y2='40' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='41' y1='60' x2='41' y2='64' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='46' y1='60' x2='46' y2='64' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='51' y1='60' x2='51' y2='64' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3Cline x1='56' y1='60' x2='56' y2='64' stroke='%23ff4444' stroke-width='0.6' opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`;

// ── Live clock ────────────────────────────────────────────────────────────────
function useLiveClock() {
  const [t, setT] = useState(() =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  );
  useEffect(() => {
    const id = setInterval(() =>
      setT(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
      , 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ── Scroll progress ───────────────────────────────────────────────────────────
function useScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setPct(Math.min(1, d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight)));
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return pct;
}

// ── Haptic ────────────────────────────────────────────────────────────────────
function haptic(ms = 25) {
  try { if (navigator?.vibrate) navigator.vibrate(ms); } catch { /* ignore */ }
}

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const clock = useLiveClock();
  const scrollPct = useScrollProgress();
  const year = new Date().getFullYear();

  // SVG ring for scroll indicator
  const R = 17;
  const circ = 2 * Math.PI * R;

  const generalContacts = [
    { name: "Reshi Teja", phone: "9790767435", role: "Lead Coordinator" },
    { name: "Sivaguru", phone: "9025569463", role: "Operations" },
    { name: "Sujitraj", phone: "9790990587", role: "Technical Support" },
    { name: "Thilak", phone: "9360677941", role: "Logistics" },
    { name: "Sanjay", phone: "9344246602", role: "Registration" },
  ];

  return (
    <>
      <style>{`
        /* ── Ember rise ── */
        @keyframes ember-rise {
          0%   { transform:translateY(0) translateX(0) scale(1); opacity:0; }
          10%  { opacity:0.75; }
          85%  { opacity:0.35; }
          100% { transform:translateY(-280px) translateX(var(--ex)) scale(0.2); opacity:0; }
        }
        .footer-ember {
          position:absolute; bottom:0; border-radius:50%;
          background:radial-gradient(circle,#ff8844,#ff2200);
          box-shadow:0 0 6px 2px rgba(255,80,20,0.65);
          pointer-events:none;
          animation:ember-rise var(--ed) ease-in var(--edelay) infinite;
        }

        /* ── Power line flicker ── */
        @keyframes powerline-flicker {
          0%,100% { box-shadow:0 -4px 28px rgba(255,0,0,0.75),0 0 10px rgba(255,0,0,0.4); }
          45%     { box-shadow:0 -4px 55px rgba(255,0,0,1),0 0 26px rgba(255,0,0,0.9); }
          50%     { box-shadow:0 -4px 14px rgba(255,0,0,0.3),0 0 6px rgba(255,0,0,0.2); opacity:.7; }
          55%     { box-shadow:0 -4px 55px rgba(255,0,0,1),0 0 26px rgba(255,0,0,0.9); }
        }
        .footer-powerline {
          height:2px; width:100%;
          background:linear-gradient(90deg,transparent 0%,#dc2626 15%,#ff5555 50%,#dc2626 85%,transparent 100%);
          animation:powerline-flicker 3.5s ease-in-out infinite;
        }

        /* ── Marquee ── */
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .footer-marquee-inner {
          display:inline-block; white-space:nowrap;
          animation:marquee 28s linear infinite;
        }
        .footer-marquee-inner:hover { animation-play-state:paused; }

        /* ── Cursor blink ── */
        @keyframes cur-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .term-cursor {
          display:inline-block; width:6px; height:11px; vertical-align:middle;
          background:#dc2626; margin-left:2px;
          animation:cur-blink 1.1s step-start infinite;
        }

        /* ── Node pulse ── */
        @keyframes node-pulse { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.7;transform:scale(1.35)} }

        /* ── Location scan line ── */
        @keyframes loc-scan {
          0%  {top:0%;   opacity:0;}
          5%  {opacity:.55;}
          95% {opacity:.55;}
          100%{top:100%; opacity:0;}
        }
        .loc-scanline {
          position:absolute; left:0; right:0; height:2px; pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(220,38,38,.7) 40%,rgba(255,100,100,.95) 50%,rgba(220,38,38,.7) 60%,transparent);
          animation:loc-scan 4s linear infinite;
        }

        /* ── Contact modal slide up ── */
        @keyframes modal-up { from{opacity:0;transform:translateY(30px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .modal-panel { animation:modal-up .22s cubic-bezier(.34,1.4,.64,1) forwards; }

        /* ── Contact row hover ── */
        .contact-row { transition:background .2s,border-color .2s,transform .2s; }
        .contact-row:hover { background:rgba(220,38,38,.06)!important; border-color:rgba(220,38,38,.3)!important; transform:translateX(4px); }

        /* ── Nav links ── */
        .f-nav-link {
          display:flex; align-items:center; gap:8px;
          color:rgba(255,255,255,.45); font-size:.82rem; font-weight:500;
          letter-spacing:.06em; text-decoration:none; padding:7px 0;
          transition:color .2s; position:relative;
          -webkit-tap-highlight-color:transparent;
        }
        .f-nav-link::after {
          content:''; position:absolute; bottom:2px; left:0;
          width:0; height:1px;
          background:linear-gradient(90deg,#dc2626,#ff6644);
          transition:width .3s cubic-bezier(.4,0,.2,1);
        }
        .f-nav-link:hover { color:#fff; }
        .f-nav-link:hover::after { width:100%; }

        /* ── Social pill links ── */
        .f-social {
          display:flex; align-items:center; gap:10px;
          padding:10px 13px; border-radius:12px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          color:rgba(255,255,255,.5); text-decoration:none;
          font-size:clamp(.62rem,1.7vw,.75rem); font-weight:500;
          transition:all .25s ease; -webkit-tap-highlight-color:transparent;
        }
        .f-social:hover { background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.16); color:#fff; transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.4); }
        .f-social-icon {
          width:30px; height:30px; border-radius:8px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
        }

        /* ── Section labels ── */
        .f-label {
          display:flex; align-items:center; gap:7px; margin-bottom:14px;
          font-size:.56rem; font-weight:800; letter-spacing:.22em;
          text-transform:uppercase; color:#dc2626;
        }
        .f-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(220,38,38,.35),transparent); }

        /* ── Scroll-to-top button ── */
        .scroll-btn {
          position:relative; width:44px; height:44px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(220,38,38,.1); border:1px solid rgba(220,38,38,.22);
          color:#f87171; cursor:pointer;
          transition:background .2s,transform .2s,box-shadow .2s;
          -webkit-tap-highlight-color:transparent;
        }
        .scroll-btn:hover { background:rgba(220,38,38,.22); box-shadow:0 0 22px rgba(220,38,38,.4); transform:translateY(-3px); }
        .scroll-btn:active { transform:scale(.9); }

        /* ════ MOBILE GRID BREAKPOINTS ════ */
        /* Tablet: 2-col */
        @media(max-width:1023px) {
          .footer-main-grid { grid-template-columns:1fr 1fr !important; row-gap:36px !important; }
          .footer-terminal  { grid-column:1 / -1; }
        }
        /* Mobile: 1-col stacked */
        @media(max-width:599px) {
          .footer-main-grid { grid-template-columns:1fr !important; row-gap:32px !important; }
          .footer-terminal  { grid-column:auto; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          CONTACT MODAL
          — Sheet on mobile, centered on desktop
      ══════════════════════════════════════ */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setShowContactModal(false)}
          />

          {/* Panel */}
          <div
            className="modal-panel relative w-full sm:max-w-lg overflow-hidden"
            style={{
              background: "#080a0d",
              border: "1px solid rgba(220,38,38,.2)",
              borderBottom: "none",
              borderRadius: "22px 22px 0 0",
              boxShadow: "0 -8px 60px rgba(220,38,38,.15),0 0 100px rgba(0,0,0,.8)",
              maxHeight: "92dvh",
            }}
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(255,255,255,.15)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,.06)", background: "linear-gradient(135deg,rgba(220,38,38,.08),transparent)" }}
            >
              <div className="flex items-center gap-3">
                <div style={{ padding: 8, borderRadius: 12, background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.25)" }}>
                  <Headset className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">General Help</h3>
                  <p className="text-xs font-mono" style={{ color: "rgba(248,113,113,.55)" }}>EMERGENCY FREQUENCIES</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact list */}
            <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(92dvh - 140px)" }}>
              {generalContacts.map((c, i) => (
                <div
                  key={i}
                  className="contact-row rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                        style={{ background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.25)", color: "#f87171" }}
                      >
                        {c.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{c.name}</p>
                        <p className="text-xs truncate" style={{ color: "rgba(248,113,113,.5)" }}>{c.role}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,.22)", letterSpacing: ".08em" }}>+91 {c.phone}</p>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`tel:${c.phone}`}
                        onClick={() => haptic()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{ background: "rgba(255,255,255,.08)", color: "#fff", border: "1px solid rgba(255,255,255,.1)", minHeight: 36 }}
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${c.phone}`}
                        target="_blank" rel="noreferrer"
                        onClick={() => haptic()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{ background: "rgba(37,211,102,.1)", color: "#4ade80", border: "1px solid rgba(37,211,102,.25)", minHeight: 36 }}
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WA
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid rgba(220,38,38,.1)", background: "rgba(220,38,38,.03)" }}>
              <p className="font-mono uppercase tracking-widest" style={{ color: "rgba(248,113,113,.4)", fontSize: ".58rem" }}>
                ⚡ Support Team Available 24 / 7
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MAIN FOOTER
      ══════════════════════════════════════ */}
      <footer className="relative text-white overflow-hidden" style={{ marginTop: "clamp(48px,8vw,128px)" }}>

        {/* Flickering power line */}
        <div className="footer-powerline" />

        {/* ── LAYERED BACKGROUND ── */}
        <div
          className="relative"
          style={{ padding: "clamp(40px,7vw,80px) clamp(16px,4vw,24px) clamp(24px,4vw,48px)" }}
        >
          {/* Layer 1 — dark base */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,#020408 0%,#050a10 40%,#030608 70%,#000 100%)" }} />

          {/* Layer 2 — circuit PCB tile */}
          <div className="absolute inset-0" style={{ backgroundImage: CIRCUIT_BG, backgroundSize: "120px 120px", opacity: .042 }} />

          {/* Layer 3 — red nebula mesh */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
            radial-gradient(ellipse 70% 50% at 15% 60%,rgba(180,0,0,.15) 0%,transparent 60%),
            radial-gradient(ellipse 55% 40% at 85% 25%,rgba(120,0,0,.11) 0%,transparent 55%),
            radial-gradient(ellipse 45% 60% at 55% 90%,rgba(220,38,38,.09) 0%,transparent 50%),
            radial-gradient(ellipse 35% 30% at 70% 55%,rgba(80,0,0,.08) 0%,transparent 45%)
          ` }} />

          {/* Layer 4 — ember particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i} className="footer-ember" style={{
                left: `${4 + (i * 4.3) % 92}%`,
                "--ex": `${(i % 2 === 0 ? 1 : -1) * (8 + (i * 7) % 32)}px`,
                "--ed": `${3.5 + (i % 5) * .8}s`,
                "--edelay": `${(i * .37) % 4}s`,
                width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              }} />
            ))}
          </div>

          {/* ── ALL CONTENT ── */}
          <div className="relative z-10 max-w-6xl mx-auto">

            {/* ════ LOCATION GATEWAY ════ */}
            <div className="max-w-5xl mx-auto mb-10 sm:mb-14">
              <a
                href="https://maps.app.goo.gl/8XmBGRBJ2j8oDLRM9"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden"
                onClick={() => haptic()}
                style={{ borderRadius: "clamp(14px,3vw,24px)", border: "1px solid rgba(220,38,38,.25)", boxShadow: "0 0 40px rgba(220,38,38,.07)" }}
              >
                <img
                  src="/college-location.png"
                  alt="College Location"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ height: "clamp(160px,35vw,320px)", objectPosition: "center" }}
                />
                {/* Animated scan line */}
                <div className="loc-scanline" />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                  style={{ background: "linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.52) 50%,rgba(0,0,0,.28) 100%)" }}
                >
                  <p style={{ fontSize: "clamp(.46rem,1.4vw,.62rem)", letterSpacing: ".28em", color: "#f87171", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                    Pinpoint Us — Interactive Spot
                  </p>
                  <h2 style={{
                    fontFamily: "'Bebas Neue','Anton','Impact',sans-serif",
                    fontSize: "clamp(.95rem,3.8vw,2.4rem)", fontWeight: 900,
                    lineHeight: 1.05, letterSpacing: ".04em",
                    textShadow: "0 2px 20px rgba(0,0,0,.9)",
                  }}>
                    Meenakshi Sundararajan Engineering College
                  </h2>
                  <p style={{ fontSize: "clamp(.58rem,1.6vw,.78rem)", color: "rgba(255,255,255,.5)", marginTop: 7 }}>
                    Tap to open real-world map portal
                  </p>
                  <div style={{
                    marginTop: 10, padding: "4px 14px", borderRadius: 20,
                    background: "rgba(220,38,38,.18)", border: "1px solid rgba(220,38,38,.4)",
                    fontSize: "clamp(.48rem,1.3vw,.6rem)", fontWeight: 700,
                    letterSpacing: ".14em", textTransform: "uppercase", color: "#fca5a5",
                  }}>
                    363, Arcot Road, Kodambakkam, Chennai – 600 024
                  </div>
                </div>
              </a>
            </div>

            {/* ════ CONTACT BUTTON ════ */}
            <div className="flex justify-center mb-12 sm:mb-16">
              <button
                onClick={() => { haptic(40); setShowContactModal(true); }}
                className="group relative inline-flex items-center justify-center p-1 w-full max-w-md overflow-hidden rounded-xl font-medium text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-red-600 via-purple-600 to-red-600 animate-[spin_4s_linear_infinite] group-hover:from-red-400 group-hover:via-orange-500 group-hover:to-red-400" />
                <span className="relative flex h-full w-full items-center justify-center gap-3 rounded-[10px] bg-black px-8 py-5 text-lg font-black uppercase tracking-widest transition-all group-hover:bg-gray-900"
                  style={{ fontSize: "clamp(.7rem,2.2vw,1rem)" }}
                >
                  <Headset className="w-6 h-6 text-red-500 group-hover:animate-bounce" />
                  Contact General Help
                </span>
                <span className="absolute -inset-3 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>

            {/* ════ MAIN GRID ════ */}
            <div
              className="footer-main-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(20px,3.5vw,52px)" }}
            >

              {/* ── SYSTEM TERMINAL ── */}
              <div className="footer-terminal">
                <div className="f-label">
                  <Zap className="w-3 h-3 flex-shrink-0" /> System Terminal
                </div>
                <div
                  className="font-mono space-y-2 p-4 rounded-xl"
                  style={{
                    background: "rgba(0,0,0,.5)", border: "1px solid rgba(220,38,38,.1)",
                    boxShadow: "inset 0 0 30px rgba(0,0,0,.5)",
                    fontSize: "clamp(.58rem,1.5vw,.7rem)",
                  }}
                >
                  {[
                    ["NODE ID", "MSEC-2026", false],
                    ["DEPARTMENT", "EEE", false],
                    ["STATUS", "ACTIVE", true],
                    ["DATA LINK", "STABLE", false],
                    ["UPTIME", "99.9%", false],
                  ].map(([k, v, green]) => (
                    <div key={k} className="flex gap-2">
                      <span style={{ color: "rgba(220,38,38,.5)", minWidth: "4.8rem", flexShrink: 0 }}>{k}</span>
                      <span style={{ color: "rgba(255,255,255,.14)" }}>:</span>
                      <span style={{ color: green ? "#4ade80" : "rgba(255,255,255,.52)" }}>{v}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
                    <span style={{ color: "rgba(220,38,38,.5)", minWidth: "4.8rem", flexShrink: 0 }}>LOCAL TIME</span>
                    <span style={{ color: "rgba(255,255,255,.14)" }}>:</span>
                    <span style={{ color: "#f87171" }}>{clock}<span className="term-cursor" /></span>
                  </div>
                </div>
              </div>

              {/* ── QUICK NAVIGATION ── */}
              <div>
                <div className="f-label">
                  <span style={{ color: "rgba(220,38,38,.6)" }}>◈</span> Quick Navigation
                </div>
                <nav className="flex flex-col">
                  {[
                    { to: "/", label: "Home", hint: "Mission Control" },
                    { to: "/events", label: "Events", hint: "Active Modules" },
                    { to: "/about", label: "About", hint: "System Info" },
                  ].map(({ to, label, hint }) => (
                    <Link key={to} to={to} className="f-nav-link" onClick={() => haptic()}>
                      <span style={{ color: "rgba(220,38,38,.45)", fontSize: ".65rem" }}>›</span>
                      <span>
                        {label}
                        <span style={{ display: "block", fontSize: "clamp(.44rem,1.1vw,.52rem)", color: "rgba(255,255,255,.2)", marginTop: 1, letterSpacing: ".1em" }}>{hint}</span>
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* ── EXTERNAL CHANNELS ── */}
              <div>
                <div className="f-label">
                  <span style={{ color: "rgba(220,38,38,.6)" }}>◈</span> External Channels
                </div>
                <div className="flex flex-col gap-2">
                  <a href="https://www.instagram.com/epsilon_2k26?utm_source=qr&igsh=MTZuMDYxdjdjcjE4ZQ==" target="_blank" rel="noreferrer" className="f-social" onClick={() => haptic()}>
                    <span className="f-social-icon" style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}>
                      <Instagram className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span>
                      <span style={{ display: "block", fontWeight: 700, fontSize: "clamp(.6rem,1.6vw,.72rem)" }}>Instagram</span>
                      <span style={{ display: "block", fontSize: "clamp(.48rem,1.2vw,.56rem)", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Public Broadcast Channel</span>
                    </span>
                  </a>
                  <a href="https://chat.whatsapp.com/Bx0jIVojXiA5ZzfTgWCtHQ?mode=gi_t" target="_blank" rel="noreferrer" className="f-social" onClick={() => haptic()}>
                    <span className="f-social-icon" style={{ background: "rgba(37,211,102,.18)", border: "1px solid rgba(37,211,102,.3)" }}>
                      <MessageCircle className="w-3.5 h-3.5" style={{ color: "#25d366" }} />
                    </span>
                    <span>
                      <span style={{ display: "block", fontWeight: 700, fontSize: "clamp(.6rem,1.6vw,.72rem)" }}>WhatsApp</span>
                      <span style={{ display: "block", fontSize: "clamp(.48rem,1.2vw,.56rem)", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Transport Network Group</span>
                    </span>
                  </a>
                  <a href="https://www.msec.edu.in" target="_blank" rel="noreferrer" className="f-social" onClick={() => haptic()}>
                    <span className="f-social-icon" style={{ background: "rgba(59,130,246,.15)", border: "1px solid rgba(59,130,246,.28)" }}>
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                    </span>
                    <span>
                      <span style={{ display: "block", fontWeight: 700, fontSize: "clamp(.6rem,1.6vw,.72rem)" }}>College Website</span>
                      <span style={{ display: "block", fontSize: "clamp(.48rem,1.2vw,.56rem)", color: "rgba(255,255,255,.28)", marginTop: 1 }}>msec.edu.in</span>
                    </span>
                  </a>
                </div>
              </div>

              {/* ── CREDITS + BACK TO TOP ── */}
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="f-label">
                    <span style={{ color: "rgba(220,38,38,.6)" }}>◈</span> Credits
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "clamp(.56rem,1.5vw,.68rem)", color: "rgba(255,255,255,.26)", lineHeight: 1.85 }}>
                    <p style={{ color: "rgba(255,255,255,.5)", fontWeight: 700, marginBottom: 3 }}>EPSILON 2K26</p>
                    <p>Department of Electrical and</p>
                    <p>Electronics Engineering</p>
                    <p style={{ marginTop: 6 }}>Meenakshi Sundararajan</p>
                    <p>Engineering College</p>
                    <p style={{ marginTop: 6, color: "rgba(220,38,38,.38)" }}>Authorized Access Only</p>
                  </div>
                </div>

                {/* Back to top with scroll-progress ring */}
                <div className="flex items-center gap-3">
                  <button
                    className="scroll-btn"
                    onClick={() => { haptic(20); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    aria-label="Back to top"
                  >
                    <svg width="44" height="44" className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="22" cy="22" r={R} fill="none" stroke="rgba(220,38,38,.12)" strokeWidth="2" />
                      <circle cx="22" cy="22" r={R} fill="none" stroke="#dc2626" strokeWidth="2"
                        strokeDasharray={`${circ * scrollPct} ${circ}`} strokeLinecap="round"
                        style={{ transition: "stroke-dasharray .3s ease" }} />
                    </svg>
                    <ChevronUp className="w-4 h-4 relative z-10" />
                  </button>
                  <div>
                    <p style={{ fontSize: "clamp(.58rem,1.5vw,.68rem)", fontWeight: 700, color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}>Back to Top</p>
                    <p style={{ fontSize: "clamp(.46rem,1.2vw,.54rem)", color: "rgba(255,255,255,.18)", fontFamily: "monospace", marginTop: 2 }}>
                      {Math.round(scrollPct * 100)}% scrolled
                    </p>
                  </div>
                </div>
              </div>

            </div>{/* /main grid */}

            {/* ════ TICKER ════ */}
            <div
              className="overflow-hidden whitespace-nowrap"
              style={{ marginTop: "clamp(28px,5vw,60px)", borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: "clamp(12px,2.5vw,18px)" }}
            >
              <div
                className="footer-marquee-inner"
                style={{ fontSize: "clamp(.5rem,1.4vw,.62rem)", color: "rgba(255,255,255,.18)", fontFamily: "monospace", letterSpacing: ".12em" }}
              >
                <span style={{ color: "rgba(220,38,38,.45)" }}>▸ </span>
                Monitoring transport grid… portal stability nominal… node synchronization complete… system secure… external signals stable… epsilon 2k26 online… all modules operational…&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: "rgba(220,38,38,.45)" }}>▸ </span>
                Monitoring transport grid… portal stability nominal… node synchronization complete… system secure… external signals stable… epsilon 2k26 online… all modules operational…&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </div>

            {/* ════ COPYRIGHT ════ */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-2"
              style={{ marginTop: "clamp(12px,2vw,18px)", paddingTop: "clamp(10px,2vw,16px)", borderTop: "1px solid rgba(255,255,255,.04)" }}
            >
              <p style={{ fontSize: "clamp(.48rem,1.3vw,.58rem)", color: "rgba(255,255,255,.16)", fontFamily: "monospace", letterSpacing: ".08em", textAlign: "center" }}>
                © {year} Meenakshi Sundararajan Engineering College — Epsilon 2K26
              </p>
              <div className="flex items-center gap-2" style={{ fontSize: "clamp(.46rem,1.2vw,.55rem)", color: "rgba(255,255,255,.14)", fontFamily: "monospace" }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block",
                  boxShadow: "0 0 6px #4ade80", animation: "node-pulse 2s ease-in-out infinite",
                }} />
                All systems nominal
              </div>
            </div>

          </div>{/* /z-10 */}
        </div>{/* /padded */}
      </footer>
    </>
  );
}
