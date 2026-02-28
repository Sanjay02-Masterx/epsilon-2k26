import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import events from "../data/events";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Phone,
  MessageCircle,
  X,
  HelpCircle
} from "lucide-react";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [showCoordinatorPopup, setShowCoordinatorPopup] = useState(false);

  const event = events.find((e) => e.id === eventId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-3xl font-bold mb-6 text-red-500">
          Event not found
        </h2>
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>
      </div>
    );
  }

  const descriptionText =
    Array.isArray(event.details?.description) &&
    event.details.description.length > 0
      ? event.details.description[0]
      : event.description || "";

  const handleRegisterClick = () => {
  if (event.registrationLink) {
    window.open(event.registrationLink, "_blank");
  }
};

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-hidden selection:bg-red-500/30">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/originals/44/6e/3b/446e3b79395a287ca32f7977dd83b290.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/90 to-black" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-32">

        {/* Back Button */}
        <div className="mb-12">
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

        {/* Title Section */}
        <div className="mb-16 text-center md:text-left">
          {event.subtitle && (
            <span className="inline-block mb-4 py-1 px-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-[0.2em]">
              {event.subtitle}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none drop-shadow-lg">
            {event.title}
          </h1>
        </div>

        {/* Description */}
        {descriptionText && (
          <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 mb-16 shadow-xl text-center md:text-left">
            <p className="text-lg md:text-xl leading-relaxed text-zinc-200 max-w-4xl mx-auto md:mx-0">
              {descriptionText}
            </p>

            <button
              onClick={() => setShowCoordinatorPopup(true)}
              className="mt-6 text-red-400 hover:text-white text-sm font-medium underline underline-offset-4 decoration-zinc-700 hover:decoration-white transition-all flex items-center gap-2 justify-center md:justify-start"
            >
              <HelpCircle className="w-4 h-4" />
              Have a question? Contact Coordinator
            </button>
          </div>
        )}

        {/* Rules & Specifications */}
        {event.details && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

            {/* Rules */}
            {event.details.rules && (
              <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-red-400 mb-6 uppercase tracking-wider">
                  Rules & Regulations
                </h2>

                <ul className="space-y-4">
                  {event.details.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-300">
                      <CheckCircle2 className="w-5 h-5 text-red-500 mt-1" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {event.details.specifications && (
              <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-red-400 mb-6 uppercase tracking-wider">
                  Specifications
                </h2>

                <ul className="space-y-4">
                  {event.details.specifications.map((spec, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-300">
                      <ChevronRight className="w-5 h-5 text-red-500 mt-1" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

        {/* Registration Section */}
        <div className="text-center">
          <button
            onClick={handleRegisterClick}
            className="min-w-[280px] px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 bg-red-600 hover:bg-red-700 text-white hover:scale-105 active:scale-95 shadow-red-900/20"
          >
            Register Now (No Registration Fee)
          </button>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 text-sm text-zinc-500 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              No Registration Fees
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Physical Certificate Provided
            </span>
          </div>
        </div>

      </div>

      {/* Coordinator Popup */}
      {showCoordinatorPopup && event.coordinator && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setShowCoordinatorPopup(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              Contact Coordinator
            </h3>

            <div className="space-y-6">
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">
                  Coordinator
                </p>
                <p className="text-lg font-semibold text-white">
                  {event.coordinator.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${event.coordinator.phone}`}
                  className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl transition-colors font-medium border border-white/5"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>

                <a
                  href={`https://wa.me/91${event.coordinator.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-3 px-4 rounded-xl transition-colors font-medium border border-[#25D366]/20"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}