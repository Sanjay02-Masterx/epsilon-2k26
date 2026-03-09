import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import events from "../data/events";
import { getRegistrationStatus, getStatusStyle } from "../utils/registrationStatus";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Phone,
  MessageCircle,
  X,
  HelpCircle,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Trophy,
  MapPin,
  Clock,
  Calendar,
  Users
} from "lucide-react";

// ── Full-screen image lightbox ────────────────────────────────────────────────
function PosterLightbox({ src, title, onClose }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white font-bold text-sm uppercase tracking-widest truncate max-w-[60%]">
          {title} — Official Poster
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/60 text-xs font-mono w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(3, z + 0.25))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <a
            href={src}
            download
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600/60 text-red-300 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={`${title} poster`}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
            maxWidth: "100%",
            maxHeight: zoom === 1 ? "calc(100vh - 100px)" : "none",
            borderRadius: "8px",
            boxShadow: "0 0 60px rgba(0,0,0,0.8)",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

// ── PDF viewer modal ──────────────────────────────────────────────────────────
function BrochureModal({ src, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white font-bold text-sm uppercase tracking-widest truncate max-w-[60%]">
          {title} — Official Brochure / SOP
        </span>
        <div className="flex items-center gap-2">
          <a
            href={src}
            download
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" /> Open in Tab
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600/60 text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF embed */}
      <div
        className="flex-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`${src}#view=FitH`}
          title={`${title} brochure`}
          className="w-full h-full border-0"
          style={{ background: "#1a1a1a" }}
        />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EventDetails() {
  const { eventId } = useParams();
  const navigate    = useNavigate();

  const [showCoordinatorPopup, setShowCoordinatorPopup] = useState(false);
  const [showPoster,           setShowPoster]           = useState(false);
  const [showBrochure,         setShowBrochure]         = useState(false);
  const [posterLoaded,         setPosterLoaded]         = useState(false); // ✅ FIX: was used in onLoad but never declared

  const event = events.find((e) => e.id === eventId);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-3xl font-bold mb-6 text-red-500">Event not found</h2>
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Events
        </button>
      </div>
    );
  }

  const g1 = event.gradient?.[0] || "#dc2626";
  const g2 = event.gradient?.[1] || "#7f1d1d";

  const descriptionText =
    Array.isArray(event.details?.description) && event.details.description.length > 0
      ? event.details.description[0]
      : event.description || "";

  const specs        = event.details?.specs         || event.details?.specifications || [];
  const requirements = event.details?.requirements  || [];
  const rules        = event.details?.rules         || [];
  const rounds       = event.details?.rounds        || [];
  const judging      = event.details?.judgingCriteria || [];
  const coordinators = event.coordinators           || (event.coordinator ? [event.coordinator] : []);

  const handleRegisterClick = () => {
    try { if (navigator.vibrate) navigator.vibrate(30); } catch { /* ignore */ }
    if (event.registrationLink) window.open(event.registrationLink, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-hidden selection:bg-red-500/30">

      {/* Lightbox modals */}
      {showPoster   && event.poster   && <PosterLightbox  src={event.poster}   title={event.title} onClose={() => setShowPoster(false)}   />}
      {showBrochure && event.brochure && <BrochureModal   src={event.brochure} title={event.title} onClose={() => setShowBrochure(false)} />}

      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Poster blurred as bg if available */}
        {event.poster ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-110"
            style={{ backgroundImage: `url('${event.poster}')` }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-105"
            style={{ backgroundImage: "url('https://i.pinimg.com/originals/44/6e/3b/446e3b79395a287ca32f7977dd83b290.jpg')" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/90 to-black" />
        {/* Gradient accent from event color */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at 20% 20%, ${g1}, transparent 55%)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 sm:pb-32">

        {/* Back */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => navigate("/events")}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-medium"
          >
            <div className="p-2 rounded-full bg-zinc-800/50 group-hover:bg-red-600/20 group-hover:text-red-400 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back to Events
          </button>
        </div>

        {/* ── HERO: Poster + Title side by side ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12 sm:mb-16 items-start">

          {/* Poster card */}
          {event.poster && (
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border border-white/10"
                style={{ boxShadow: `0 0 40px ${g1}30` }}
                onClick={() => setShowPoster(true)}
              >
                {/* Loading shimmer shown until image loads */}
                {!posterLoaded && (
                  <div className="w-full bg-zinc-800 animate-pulse" style={{ height: "420px" }} />
                )}
                <img
                  src={event.poster}
                  alt={`${event.title} poster`}
                  className="w-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{
                    maxHeight: "420px",
                    objectPosition: "top",
                    opacity: posterLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease, transform 0.7s ease",
                    display: "block",
                  }}
                  onLoad={() => setPosterLoaded(true)}
                  onError={(e) => { e.target.style.display = "none"; setPosterLoaded(true); }}
                />

                {/* Hover zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 text-white text-sm font-medium">
                    <ZoomIn className="w-4 h-4" /> View Full Poster
                  </div>
                </div>
                {/* Corner label */}
                <div
                  className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white"
                  style={{ background: `${g1}cc` }}
                >
                  Official Poster
                </div>
              </div>

              {/* PDF Brochure button below poster */}
              {event.brochure && (
                <button
                  onClick={() => setShowBrochure(true)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-sm font-medium group"
                >
                  <FileText className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                  View Official Brochure / SOP
                  <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-red-400 transition-colors" />
                </button>
              )}
            </div>
          )}

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            {event.subtitle && (
              <span
                className="inline-block mb-4 py-1 px-3 rounded text-xs font-bold uppercase tracking-[0.2em]"
                style={{ background: `${g1}20`, border: `1px solid ${g1}40`, color: g1 }}
              >
                {event.subtitle}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none drop-shadow-lg mb-6">
              {event.title}
            </h1>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {event.date && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm">
                  <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">{event.date}</span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm">
                  <Clock className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">{event.time}</span>
                </div>
              )}
              {event.venue && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">{event.venue}</span>
                </div>
              )}
              {event.meta?.teamSize && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm">
                  <Users className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-zinc-200 font-medium">{event.meta.teamSize}</span>
                </div>
              )}
              {event.prize && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-yellow-500/20 text-sm">
                  <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="text-yellow-200 font-medium">{event.prize}</span>
                </div>
              )}
              {/* Registration Status Badge */}
              {(() => {
                const status = getRegistrationStatus();
                const s      = getStatusStyle(status);
                return (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold uppercase tracking-widest"
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      color: s.color,
                      boxShadow: `0 0 14px ${s.dot}33`,
                      backdropFilter: "blur(10px)",
                      letterSpacing: "0.15em",
                      fontSize: "0.65rem",
                    }}
                  >
                    <span style={{ color: s.dot, fontSize: "0.75rem" }}>{s.icon}</span>
                    Registration {s.label}
                  </div>
                );
              })()}
            </div>

            {/* Description */}
            {descriptionText && (
              <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-7 shadow-xl">
                <p className="text-base sm:text-lg leading-relaxed text-zinc-200">
                  {descriptionText}
                </p>
                {event.note && (
                  <p className="mt-4 text-sm text-red-300/70 italic">{event.note}</p>
                )}
                <button
                  onClick={() => setShowCoordinatorPopup(true)}
                  className="mt-5 text-red-400 hover:text-white text-sm font-medium underline underline-offset-4 decoration-zinc-700 hover:decoration-white transition-all flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" /> Have a question? Contact Coordinator
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Media action row (if no sidebar poster) ── */}
        {!event.poster && (event.brochure) && (
          <div className="flex flex-wrap gap-3 mb-10">
            {event.brochure && (
              <button
                onClick={() => setShowBrochure(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-sm font-medium"
              >
                <FileText className="w-4 h-4" /> Official Brochure / SOP
              </button>
            )}
          </div>
        )}

        {/* ── Details grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">

          {/* Rules */}
          {rules.length > 0 && (
            <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-8 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider flex items-center gap-2" style={{ color: g1 }}>
                <CheckCircle2 className="w-5 h-5" /> Rules & Regulations
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: g1 }} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements + Specs */}
          {(specs.length > 0 || requirements.length > 0) && (
            <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-8 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider flex items-center gap-2" style={{ color: g1 }}>
                <ChevronRight className="w-5 h-5" /> Requirements
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {[...requirements, ...specs].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base">
                    <ChevronRight className="w-5 h-5 shrink-0 mt-0.5" style={{ color: g1 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rounds — full width */}
          {rounds.length > 0 && (
            <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-8 shadow-xl md:col-span-2">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider" style={{ color: g1 }}>
                Round Structure
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {rounds.map((round, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                    <div
                      className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: `linear-gradient(135deg,${g1},${g2})` }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm mb-1">{round.title}</p>
                      <p className="text-zinc-400 text-sm leading-relaxed">{round.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Judging Criteria */}
          {judging.length > 0 && (
            <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-8 shadow-xl md:col-span-2">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 uppercase tracking-wider flex items-center gap-2" style={{ color: g1 }}>
                <Trophy className="w-5 h-5" /> Judging Criteria
              </h2>
              <div className="space-y-3">
                {judging.map((j, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-zinc-300 text-sm flex-1">{j.criterion}</span>
                    {j.marks != null && (
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24 sm:w-40 h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(j.marks / 100) * 100}%`,
                              background: `linear-gradient(90deg,${g1},${g2})`
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold font-mono w-12 text-right" style={{ color: g1 }}>
                          {j.marks} pts
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10 flex justify-end">
                  <span className="text-sm font-bold font-mono" style={{ color: g1 }}>
                    Total: {judging.reduce((acc, j) => acc + (j.marks || 0), 0)} pts
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Register CTA ── */}
        <div className="text-center space-y-4">
          <button
            onClick={handleRegisterClick}
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[280px] px-6 sm:px-10 py-4 rounded-xl font-bold text-base sm:text-lg uppercase tracking-wider transition-all duration-300 text-white hover:scale-105 active:scale-95 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${g1}, ${g2})`,
              boxShadow: `0 8px 32px ${g1}50`
            }}
          >
            Register Now →
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-zinc-500 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> No Registration Fees
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> Physical Certificate Provided
            </span>
            {event.email && (
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-zinc-500" />
                <a href={`mailto:${event.email}`} className="hover:text-zinc-300 transition-colors">
                  {event.email}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Coordinator Popup ── */}
      {showCoordinatorPopup && coordinators.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowCoordinatorPopup(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 pr-6">Contact Coordinator</h3>
            <div className="space-y-4">
              {coordinators.map((coord, i) => (
                <div key={i} className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">
                    Coordinator {coordinators.length > 1 ? i + 1 : ""}
                  </p>
                  <p className="text-lg font-semibold text-white">{coord.name}</p>
                  <p className="text-xs text-zinc-400 font-mono mt-1">+91 {coord.phone}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <a
                      href={`tel:${coord.phone}`}
                      className="flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${coord.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-2 px-3 rounded-lg transition-colors border border-[#25D366]/20 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
