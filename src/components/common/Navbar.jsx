import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/saankeethikafilled.png";

const Navbar = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "events", label: "Events" },
    { id: "about", label: "About" },
  ];

  const handleNavClick = (pageId) => {
    const target = pageId === "home" ? "home" : pageId;
    if (onNavigate) onNavigate(target);
    setIsOpen(false);
  };

  const isActive = (id) => {
    if (id === "home") return currentPage === "home" || currentPage === "/";
    return currentPage === id;
  };

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(220,38,38,0.4)); }
          50% { filter: drop-shadow(0 0 22px rgba(220,38,38,0.8)); }
        }

        @keyframes autoGlitch {
          0%, 90%, 100% { transform: translate(0); filter: hue-rotate(0deg); opacity: 1; }
          92% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); opacity: 0.8; }
          94% { transform: translate(2px, -1px); filter: hue-rotate(-90deg); opacity: 0.9; }
          96% { transform: translate(-1px, 2px); filter: hue-rotate(180deg); }
        }

        @keyframes pulseHeight {
          0%, 100% { height: 10px; opacity: 0.3; }
          50% { height: 24px; opacity: 1; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scaleX(1); }
          50% { opacity: 0.3; transform: scaleX(0.8); }
        }

        .animate-auto-glitch { animation: autoGlitch 5s step-end infinite; }
        .animate-data-pulse { animation: pulseHeight 2s ease-in-out infinite; }
        .animate-data-blink { animation: blink 1.5s ease-in-out infinite; }
      `}</style>

      <div
        className={`
          fixed z-50 w-full transition-all duration-500
          ${scrolled ? "top-2 md:top-6" : "top-4 md:top-10"}
          px-4 md:px-12 pointer-events-none
        `}
      >
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">

          {/* LOGO */}
          <div
            className={`
              pointer-events-auto relative z-50
              flex items-center justify-between
              w-full md:w-auto
              bg-black/80 backdrop-blur-xl border border-red-900/40
              shadow-[0_0_25px_rgba(220,38,38,0.15)]
              rounded-2xl
              md:bg-transparent md:backdrop-blur-none md:border-none
              md:shadow-none md:rounded-none md:p-0
              transition-all duration-300
              ${scrolled ? "py-2 px-4 md:py-0 md:px-0" : "py-3 px-8 md:py-0 md:px-0"}
              group
            `}
          >
            <div
              className="flex items-center gap-3 md:gap-4 cursor-pointer"
              onClick={() => handleNavClick("home")}
            >
              <div className="w-1 bg-red-600 rounded-full animate-data-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />

              <img
                src={logo}
                alt="EPSILON 2K26"
                className={`
                  w-auto transition-all duration-300
                  drop-shadow-[0_0_12px_rgba(220,38,38,0.45)]
                  animate-auto-glitch brightness-110
                  ${scrolled ? "h-9 md:h-14 opacity-90" : "h-10 md:h-16 opacity-100"}
                `}
              />

              <div className="flex flex-col gap-1 md:gap-1.5 opacity-80">
                <div className="w-3 md:w-4 h-[2px] bg-red-600 animate-data-blink" />
                <div className="w-5 md:w-7 h-[2px] bg-zinc-600" />
                <div className="w-2 md:w-3 h-[2px] bg-red-600/50 animate-data-blink [animation-delay:0.5s]" />
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-red-500 p-1 hover:text-red-400 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* DESKTOP NAV */}
          <div
            className={`
              hidden md:flex pointer-events-auto items-center gap-2
              bg-black/80 backdrop-blur-xl border border-red-900/40
              shadow-[0_0_25px_rgba(220,38,38,0.15)]
              rounded-full p-1.5 transition-all duration-300
            `}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`
                  group relative h-10 w-28 overflow-hidden rounded-full
                  font-bold uppercase tracking-wider text-xs
                  transition-all duration-300
                  ${isActive(link.id) ? "bg-red-900/20 border border-red-900/30" : ""}
                `}
              >
                <span
                  className={`
                    absolute inset-0 flex items-center justify-center
                    transition-transform duration-500
                    group-hover:-translate-y-full
                    ${isActive(link.id) ? "text-red-400" : "text-gray-400"}
                  `}
                >
                  {link.label}
                </span>

                <span
                  className="
                    absolute inset-0 flex items-center justify-center
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-500
                    bg-red-700 text-white
                  "
                >
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`
            md:hidden mt-2 pointer-events-auto
            bg-black/95 backdrop-blur-xl border border-red-900/30 rounded-2xl overflow-hidden
            transition-all duration-500 origin-top
            ${isOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"}
          `}
        >
          <div className="p-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`
                  block w-full text-left px-5 py-3 rounded-xl
                  font-bold uppercase tracking-wider text-sm
                  transition-all duration-200 border
                  ${isActive(link.id)
                    ? "bg-red-900/20 text-red-400 border-red-900/30"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"}
                `}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;