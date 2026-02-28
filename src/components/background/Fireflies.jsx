export default function Fireflies({ count = 15 }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span className="firefly" key={i} />
      ))}
    </div>
  );
}
