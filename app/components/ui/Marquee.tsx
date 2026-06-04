export default function Marquee() {
  const items = [
    'KI-generiert',
    'Vollautomatisch',
    'Landing Pages',
    'Content Orchestration',
    'CMCx Platform',
    'No-Code AI',
    'Scroll-driven Design',
    'Stitch-powered',
  ];

  return (
    <div
      className="relative overflow-hidden py-5 border-y"
      style={{
        borderColor: 'rgba(124,92,252,0.15)',
        background: 'rgba(6,6,15,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-24 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(6,6,15,0.85), transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 w-24 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(6,6,15,0.85), transparent)' }}
      />

      <div className="marquee-track" aria-hidden>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-6 whitespace-nowrap">
            <span
              className="font-display font-semibold text-[13px] uppercase tracking-widest"
              style={{ color: 'var(--color-muted)' }}
            >
              {item}
            </span>
            <span style={{ color: 'var(--color-accent)', opacity: 0.5 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
