import React, { useEffect, useRef, useState } from "react";
import { Shield, Zap, BookOpen, AlertTriangle, Cpu, Globe, Award, ChevronDown, Radio } from "lucide-react";

// Placeholder for the local asset. 
// In your project, uncomment the real import below and use it:
import epsilon from "../assets/epsilonlogo.png";
//const saankethika = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";

const About = () => {
  const sceneRef = useRef(null);
  const carRef = useRef(null);
  const trackRef = useRef(null);
  const particlesRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isGsapLoaded, setIsGsapLoaded] = useState(false);
  
  // STEP 1: Add particle state (React controls creation, GSAP controls animation)
  const [particles, setParticles] = useState([]);

  // --- CONTENT DATA ---
  const sections = [
    {
      id: 1,
      range: [0.30, 0.42],
      title: "The Department",
      subtitle: "Electrical & Electronics.",
      desc: "Since 2001, the EEE Department has been transmitting excellence. With 180 initiates annually, modern labs, and industry-aligned frequencies, we amplify potential into power.",
      quote: "We control the frequency. You just resonate with it.",
      stats: [
        { label: "Intake", value: "180 Seats" },
        { label: "Setup", value: "Modern Labs" },
        { label: "Staff", value: "Top Faculty" }
      ],
      icon: <Shield size={28} className="text-red-500" />,
      image: epsilon,
    },
    {
      id: 2,
      range: [0.52, 0.65],
      title: "The Protocol",
      subtitle: "Vision & Mission",
      desc: "Our directive is to establish centers of excellence and interact with the industrial matrix. We are committed to upskilling society and imparting domain-specific skills that define the future.",
      quote: "Mission: Survive the semester. Vision: Look cool doing it.",
      stats: [
        { label: "Drive", value: "Innovation" },
        { label: "Mode", value: "Collab" },
        { label: "Goal", value: "Service" }
      ],
      icon: <Cpu size={28} className="text-yellow-400" />,
      image: epsilon,
    },
    {
      id: 3,
      range: [0.66, 0.74], // FIXED
      title: "Achievements",
      subtitle: "Milestones",
      desc: "Recognized for academic excellence and innovation.",
      quote: "Excellence is not an act, it is a habit.",
      stats: [
        { label: "NAAC", value: "A Grade" },
        { label: "NBA", value: "Accredited" },
        { label: "AICTE", value: "Approved" }
      ],
      icon: <Award size={28} className="text-blue-400" />,
      image: epsilon,
    },
    {
      id: 4,
      range: [0.75, 0.88],
      title: "Epsilon '26",
      subtitle:  "Igniting Innovation",
      desc: "Epsilon 2K26 is a national-level technical symposium organized by the Department of Electrical and Electronics Engineering at Meenakshi Sundararajan Engineering College, uniting innovation, competition, and creativity.",
      quote: "Powering ideas. Energizing innovation.",
      stats: [
        { label: "Event", value: "Symposium" },
        { label: "Dept", value: "EEE" },
        { label: "Year", value: "2026" }
      ],
      icon: <Radio size={28} className="text-red-600 animate-pulse" />,
      image: epsilon, 
    },
  ];

  // --- DYNAMIC SCRIPT LOADING ---
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MotionPathPlugin.min.js"),
    ])
      .then(() => {
        setIsGsapLoaded(true);
      })
      .catch((err) => console.error("GSAP Load Error:", err));
  }, []);

  // STEP 2: Create particles with React (once)
  useEffect(() => {
    const p = Array.from({ length: 40 }).map(() => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      red: Math.random() > 0.9,
    }));
    setParticles(p);
  }, []);

  // --- ANIMATION LOGIC ---
  useEffect(() => {
    if (!isGsapLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const MotionPathPlugin = window.MotionPathPlugin;

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // 🔥 FIX 3: Removed ScrollTrigger.saveStyles() to prevent conflict

    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      const ctx = gsap.context(() => {

        const isMobile = window.innerWidth < 768;

        // STEP 4: GSAP animates particles (Selecting DOM elements created by React)
        gsap.utils.toArray(".particle").forEach(p => {
            gsap.to(p, {
                y: `-=${Math.random() * 200 + 100}`,
                x: `+=${Math.random() * 100 - 50}`,
                opacity: 0,
                duration: Math.random() * 5 + 3,
                repeat: -1,
                ease: "none",
            });
        });

        // 🚗 MAIN TIMELINE
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneRef.current, // 🔥 FIX 2: Trigger on the wrapper
            start: "top top",
            end: isMobile ? "+=2500" : "+=4000",
            scrub: isMobile ? 0.8 : 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const current = sections.find((s) => p >= s.range[0] && p <= s.range[1]);
              setActiveSection(current ? current.id : null);
            },
          },
        });

        // 🎬 Intro fade
        gsap.to(".intro-screen", {
          opacity: 0,
          scrollTrigger: {
            trigger: sceneRef.current,
            start: "top top",
            end: isMobile ? "+=300" : "+=500",
            scrub: true
          }
        });

        // 🛣️ Car movement
        tl.to(carRef.current, {
          motionPath: {
            path: "#roadPath",
            align: "#roadPath",
            alignOrigin: [0.5, 0.5],
            autoRotate: 90, 
          },
          ease: "none",
          duration: 1,
        });

        // 🛣️ Dash line draw
        const pathLength = document.querySelector("#dashPath")?.getTotalLength() || 1000;
        gsap.set("#dashPath", { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to("#dashPath", { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

      }, sceneRef);

      return () => ctx.revert();
    });

    return () => mm.revert();

  }, [isGsapLoaded, particles]);


  if (!isGsapLoaded) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-red-600 font-mono animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Roboto+Mono:wght@400;700&display=swap');

        .bg-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.95) 100%);
        }

        .bg-fog {
          background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/img/fog1.png");
          background-size: cover;
          animation: fogDrift 60s linear infinite;
        }

        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3));
          background-size: 100% 4px;
        }

        .clip-headlight {
           clip-path: polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%);
        }
        
        @keyframes fogDrift {
          0% { transform: translateX(0); }
          50% { transform: translateX(-5%); }
          100% { transform: translateX(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Hide Scrollbar */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 🔥 FIX 1: Wrapper with specific styling, NO ref here */}
      <div className="about-page relative w-full bg-black selection:bg-red-500/30 overflow-hidden">
        
        {/* 🔥 FIX 2: Inner Scene Wrapper which gets pinned */}
        <div ref={sceneRef} className="scene-wrapper h-screen w-full relative overflow-hidden">

            {/* --- LAYERS --- */}
            {/* 1. Deep Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#2a0a0a_0%,#000000_100%)] z-0" />
            
            {/* 2. Fog Layer */}
            <div className="fixed inset-0 bg-fog opacity-20 z-[1] pointer-events-none mix-blend-screen" />
            
            {/* 3. Spores/Particles (Rendered via React) */}
            <div ref={particlesRef} className="fixed inset-0 z-[2] pointer-events-none">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            position: "absolute",
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            backgroundColor: p.red ? "#ff0000" : "#cccccc",
                            opacity: Math.random() * 0.6 + 0.1
                        }}
                    />
                ))}
            </div>

            {/* 4. Vignette Overlay */}
            <div className="fixed inset-0 z-[20] pointer-events-none bg-vignette" />

            {/* --- INTRO SCREEN --- */}
            <div className="intro-screen absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-10 pointer-events-none px-4">
            <div className="relative">
                <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-red-800 to-black stroke-red-500 font-serif tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] text-center">
                    ABOUT US
                </h1>
                <div className="absolute -inset-2 bg-red-600/20 blur-xl -z-10 animate-pulse" />
            </div>
            
            <p className="mt-8 text-red-500/80 font-mono tracking-[0.3em] text-xs md:text-sm animate-bounce flex items-center gap-2">
                <ChevronDown size={14} /> SCROLL TO ENTER THE UPSIDE DOWN <ChevronDown size={14} />
            </p>
            </div>

            {/* --- MAP & CAR --- */}
            <div className="fixed inset-0 flex items-center justify-center z-[5] pointer-events-none">
            <svg 
                ref={trackRef} 
                viewBox="0 0 1440 1024" 
                className="w-[240%] h-[240%] md:w-[90%] md:h-[90%] opacity-80 transition-transform duration-700 ease-out"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Visible Road */}
                <path 
                    id="roadPath" 
                    d="M 200 -100 C 200 300 600 200 600 500 C 600 800 200 700 200 900 C 200 1100 1200 1100 1200 900 C 1200 700 800 600 800 400 C 800 200 1200 200 1200 -100" 
                    fill="none" 
                    stroke="#1a0505" 
                    strokeWidth="80"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_20px_rgba(0,0,0,1)]"
                />
                {/* Road Glow */}
                <path 
                    d="M 200 -100 C 200 300 600 200 600 500 C 600 800 200 700 200 900 C 200 1100 1200 1100 1200 900 C 1200 700 800 600 800 400 C 800 200 1200 200 1200 -100" 
                    fill="none" 
                    stroke="#ff0000" 
                    strokeWidth="2"
                    className="opacity-20 blur-sm"
                />
                {/* Dashed Center Line */}
                <path 
                    id="dashPath"
                    d="M 200 -100 C 200 300 600 200 600 500 C 600 800 200 700 200 900 C 200 1100 1200 1100 1200 900 C 1200 700 800 600 800 400 C 800 200 1200 200 1200 -100" 
                    fill="none" 
                    stroke="#ff2222" 
                    strokeWidth="3"
                    strokeDasharray="30 60"
                    className="opacity-60 mix-blend-screen"
                />
            </svg>
            </div>

            {/* --- CAR ELEMENT --- */}
            <div 
            ref={carRef} 
            className="fixed top-0 left-0 z-30 w-10 md:w-28 aspect-[1/2] -ml-5 md:-ml-14 -mt-5 md:-mt-14 pointer-events-none"
            >
                <img 
                src="/car.png" 
                alt="Car"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,1)]"
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3202/3202926.png"; 
                }}
                />
                
                {/* Functional Headlights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[95%] w-[1500px] md:w-[200px] h-[100px] md:h-[500px] bg-gradient-to-t from-yellow-100/30 via-yellow-500/5 to-transparent blur-md clip-headlight z-[-1] mix-blend-hard-light" />
                
                {/* Brake Lights */}
                <div className="absolute bottom-[10%] left-[10%] w-1.5 h-1.5 bg-red-600 rounded-full blur-[2px] shadow-[0_0_10px_red]" />
                <div className="absolute bottom-[10%] right-[10%] w-1.5 h-1.5 bg-red-600 rounded-full blur-[2px] shadow-[0_0_10px_red]" />
            </div>

            {/* --- HUD POPUPS --- */}
            <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center p-4">
            {sections.map((section) => (
                <div
                key={section.id}
                className={`
                    absolute w-full max-w-6xl px-4 md:px-0
                    transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
                    ${activeSection === section.id 
                        ? "opacity-100 translate-y-0 scale-100 filter blur-0" 
                        : "opacity-0 translate-y-20 scale-95 filter blur-lg"}
                `}
                >
                    {/* HUD Card */}
                    <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-red-900/40 p-1 rounded-2xl shadow-[0_0_100px_-20px_rgba(220,38,38,0.3)] overflow-hidden relative group">
                        
                        {/* Background Glitch Effects */}
                        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

                        {/* Scrollable Content for Mobile */}
                        <div className="flex flex-col md:flex-row max-h-[80vh] md:max-h-none overflow-y-auto md:overflow-visible bg-neutral-950/80 rounded-xl">
                            
                            {/* Image Section */}
                            <div className="w-full md:w-2/5 relative h-48 md:h-auto overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-red-900/20 z-10 mix-blend-overlay" />
                                <img 
                                src={section.image} 
                                alt={section.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Icon Badge */}
                                <div className="absolute top-4 left-4 z-20 bg-black/90 p-2 rounded-lg border border-red-900/50 backdrop-blur-sm">
                                    {section.icon}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                                {/* Decorative Grid */}
                                <div className="absolute top-4 right-4 flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-500 animate-ping' : 'bg-red-900'}`} />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest border border-red-900/50 px-2 py-0.5 rounded">
                                        {section.subtitle}
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-white font-serif tracking-wide mb-4 uppercase leading-tight">
                                    {section.title}
                                </h2>
                                
                                <p className="text-gray-400 font-mono text-xs md:text-sm leading-relaxed border-l-2 border-red-900 pl-4 mb-4">
                                    {section.desc}
                                </p>

                                {/* Quote */}
                                <p className="text-red-400 font-mono text-[20px] italic mb-6 opacity-80 border-b border-red-900/30 pb-2 inline-block">
                                    "{section.quote}"
                                </p>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                                    {section.stats.map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{stat.label}</div>
                                            <div className="text-xs font-bold text-red-100 truncate">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
        
        {/* 🔥 FIX 4: Manual Spacer for scroll height */}
        {/* Manual Scroll Spacer */}
      </div>
    </>
  );
};

export default About;