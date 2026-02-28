import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const g1 = event.gradient?.[0] || "#ff1744";
  const g2 = event.gradient?.[1] || "#5c0011";

  const descriptionText =
    Array.isArray(event.details?.description) &&
    event.details.description.length > 0
      ? event.details.description[0]
      : event.description ||
        "Discover exciting technical challenges and workshops.";

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        relative 
        w-full max-w-[280px] h-[340px]
        flex justify-center items-center
        transition-all duration-500
        cursor-pointer group
      "
    >
      {/* Gradient Layers */}
      <div
        className="
          absolute top-0 left-[35px]
          w-1/2 h-full rounded-xl
          skew-x-[15deg]
          transition-all duration-500
          group-hover:skew-x-0 group-hover:left-[12px]
          group-hover:w-[calc(100%-70px)]
        "
        style={{
          background: `linear-gradient(315deg, ${g1}, ${g2})`,
        }}
      />

      <div
        className="
          absolute top-0 left-[35px]
          w-1/2 h-full rounded-xl
          skew-x-[15deg]
          transition-all duration-500
          blur-[20px] opacity-80
          group-hover:skew-x-0 group-hover:left-[12px]
          group-hover:w-[calc(100%-70px)]
        "
        style={{
          background: `linear-gradient(315deg, ${g1}, ${g2})`,
        }}
      />

      {/* Content Box */}
      <div
        className="
          relative z-10
          w-[220px]
          rounded-xl
          px-6 py-6
          bg-white/5 backdrop-blur-lg
          shadow-[0_5px_15px_rgba(0,0,0,0.25)]
          border border-white/10
          text-white
          transition-all duration-500
          font-mono
          group-hover:-translate-x-4
          group-hover:py-10
        "
      >
        <h3 className="text-2xl font-bold mb-2 drop-shadow-xl leading-tight">
          {event.title}
        </h3>

        {event.subtitle && (
          <p className="text-xs uppercase tracking-wider text-red-200/90 mb-2 font-medium">
            {event.subtitle}
          </p>
        )}

        {event.meta && (
          <div className="text-xs text-gray-300/80 mb-3 font-mono tracking-wider uppercase">
            {event.meta.topic} • {event.meta.teamSize}
          </div>
        )}

        <p className="text-[13px] leading-relaxed text-gray-200/85 mb-4 line-clamp-3">
          {descriptionText}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="
            inline-block
            text-[12px]
            font-bold
            bg-white text-black
            px-3 py-1.5 rounded-lg
            transition-all duration-300
            hover:opacity-95 hover:scale-[1.05]
            shadow-lg
          "
          style={{
            boxShadow: `0 0 15px ${g1}55`,
          }}
        >
          Explore
        </button>

        <div className="mt-3 text-[11px] tracking-widest uppercase text-white/60 font-mono">
          {event.category}
        </div>
      </div>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(8px); }
          50% { transform: translate(-8px, -4px); }
        }
      `}</style>
    </div>
  );
}