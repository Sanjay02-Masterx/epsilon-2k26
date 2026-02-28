import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, 
  MessageCircle, 
  Globe, 
  ArrowUpRight, 
  Phone, 
  Headset, 
  X, 
  User 
} from "lucide-react";

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const year = new Date().getFullYear();

  // --- DATA: GENERAL CONTACTS ---
  const generalContacts = [
    { name: "Reshi Teja", phone: "9790767435" },
    { name: "Sivaguru", phone: "7418496591" },
    { name: "Sujitraj", phone: "7338826197" },
    { name: "Thilak", phone: "9014285527" },
    { name: "Sanjay", phone: "9344246602" },
  ];

  return (
    <>
      {/* 🔴 MODAL: CONTACT POPUP */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
            onClick={() => setShowContactModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-red-900/40 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900/20 to-black p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-full">
                  <Headset className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">General Help</h3>
                  <p className="text-xs text-red-300 font-mono">EMERGENCY FREQUENCIES</p>
                </div>
              </div>
              <button 
                onClick={() => setShowContactModal(false)}
                className="p-2 bg-white/5 hover:bg-red-600 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: Contact List */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {generalContacts.map((contact, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-red-500/30 transition-all">
                  
                  {/* Name Info */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{contact.name}</h4>
                      <p className="text-xs text-gray-500 font-mono tracking-widest">+91 {contact.phone}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a 
                      href={`https://wa.me/91${contact.phone}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/30 rounded-lg text-xs font-bold transition-all"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-red-950/10 text-center border-t border-red-900/20">
               <p className="text-[10px] text-red-400/60 uppercase font-mono tracking-widest">
                 Support Team Available 24/7
               </p>
            </div>
          </div>
        </div>
      )}

      {/* 🦶 MAIN FOOTER COMPONENT */}
      <footer className="relative mt-32 text-white overflow-hidden">

        {/* 🔴 Portal Energy Line */}
        <div className="h-[2px] w-full bg-red-600 shadow-[0_-5px_30px_rgba(255,0,0,0.8)]" />

        <div className="bg-gradient-to-b from-black via-[#05070d] to-black px-6 py-20 relative">

          {/* 🌍 LOCATION GATEWAY */}
          <div className="max-w-5xl mx-auto mb-12 text-center">
            <a
              href="https://www.google.com/maps/place/Meenakshi+Sundararajan+Engineering+College/@13.0558027,80.2265107,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5266f499eee457:0x4d3f7e677496e707!8m2!3d13.0558027!4d80.2265107!16s%2Fm%2F0hndktj?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-3xl border border-red-500/30"
            >
              <img
                src="/college-location.png"
                alt="College Location"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <p className="text-xs tracking-[0.3em] text-red-400">PINPOINT US – INTERACTIVE SPOT</p>
                <h2 className="text-2xl md:text-4xl font-black mt-2">
                  MEENAKSHI SUNDARARAJAN ENGINEERING COLLEGE
                </h2>
                <p className="text-sm text-gray-300 mt-1">Tap to open real-world map portal</p>
              </div>
            </a>
          </div>

          {/* ✨ CENTERED BIG CONTACT BUTTON WITH NEON LOOP */}
          <div className="flex justify-center mb-20 relative">
            <button
              onClick={() => setShowContactModal(true)}
              className="group relative inline-flex items-center justify-center p-1 w-full max-w-md overflow-hidden rounded-xl font-medium text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              {/* 🔄 Moving Neon Gradient Background */}
              <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-red-600 via-purple-600 to-red-600 animate-[spin_4s_linear_infinite] group-hover:from-red-400 group-hover:via-orange-500 group-hover:to-red-400"></span>
              
              {/* Black Inner Button */}
              <span className="relative flex h-full w-full items-center justify-center gap-3 rounded-[10px] bg-black px-8 py-5 text-lg font-black uppercase tracking-widest transition-all group-hover:bg-gray-900">
                 <Headset className="w-6 h-6 text-red-500 group-hover:animate-bounce" />
                 Contact General Help
              </span>
              
              {/* Outer Glow */}
              <span className="absolute -inset-3 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* 🧠 MAIN FOOTER GRID */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-14 text-sm">

            {/* SYSTEM TERMINAL */}
            <div className="font-mono text-gray-400 space-y-2">
              <p className="text-red-500 font-bold">SYSTEM TERMINAL</p>
              <p>NODE ID: MSEC-2026</p>
              <p>DEPARTMENT: EEE</p>
              <p>EVENT STATUS: ACTIVE</p>
              <p>DATA LINK: STABLE</p>
            </div>

            {/* QUICK LINKS */}
            <div className="space-y-3">
              <p className="text-red-500 font-bold">QUICK NAVIGATION</p>
              {[
                ["/", "Home"],
                ["/about", "About"],
                ["/events", "Events"]
              ].map(([path, label], i) => (
                <Link key={i} to={path} className="block hover:text-red-400 transition">
                  {label}
                </Link>
              ))}
            </div>

            {/* EXTERNAL COMMUNICATION */}
            <div className="space-y-4">
              <p className="text-red-500 font-bold">EXTERNAL CHANNELS</p>

              <a href="https://www.instagram.com/epsilon_2k26?utm_source=qr&igsh=MTZuMDYxdjdjcjE4ZQ==" target="_blank" className="flex items-center gap-3 hover:text-red-400">
                <Instagram className="w-4 h-4" /> Public Broadcast Channel
              </a>

              <a href="https://chat.whatsapp.com/Bx0jIVojXiA5ZzfTgWCtHQ?mode=gi_t" target="_blank" className="flex items-center gap-3 hover:text-green-400">
                <MessageCircle className="w-4 h-4" /> Transport Network Group
              </a>

              <a href="https://www.msec.edu.in" target="_blank" className="flex items-center gap-3 hover:text-blue-400">
                <Globe className="w-4 h-4" /> College Website
              </a>
            </div>

            {/* BACK TO TOP */}
            <div className="flex flex-col justify-between text-gray-500 text-xs">
              <div>
                <p>EPSILON 2K26</p>
                <p>Department of Electrical and Electronics Engineering</p>
                <p>Meenakshi Sundararajan Engineering College</p>
                <p>Authorized Access Only</p>
              </div>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                Back to Top <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 📡 TRANSMISSION TICKER */}
          <div className="mt-20 border-t border-white/10 pt-6 text-xs text-gray-500 overflow-hidden whitespace-nowrap">
            <div className="animate-[marquee_25s_linear_infinite]">
              Monitoring transport grid... portal stability nominal... node synchronization complete... system secure... external signals stable...
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="text-center text-xs text-gray-600 mt-8">
            © {year} Meenakshi Sundararajan Engineering College — Epsilon 2K26
          </div>
        </div>
      </footer>
    </>
  );
}