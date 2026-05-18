'use client';

import { useEffect, useRef } from 'react';

/* Deterministisches Pseudo-Random (kein Math.random() → kein Hydration-Fehler) */
function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const r2 = (n: number) => Math.round(n * 100) / 100;

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x:        r2(seeded(i * 3)     * 100),
  y:        r2(seeded(i * 3 + 1) * 100),
  size:     r2(seeded(i * 3 + 2) * 3 + 1),
  duration: r2(seeded(i * 5)     * 10 + 8),
  delay:    r2(seeded(i * 7)     * 6),
  color: i % 3 === 0 ? '#7c5cfc' : i % 3 === 1 ? '#06c8d9' : '#f72585',
}));

export default function ParallaxHero() {
  const bgRef  = useRef<HTMLDivElement>(null);
  const txtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current)  bgRef.current.style.transform  = `translateY(${y * 0.45}px)`;
      if (txtRef.current) {
        txtRef.current.style.transform = `translateY(${y * 0.18}px)`;
        txtRef.current.style.opacity   = `${Math.max(0, 1 - y / 550)}`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}
    >
      {/* ── Parallax BG ───────────────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        {/* Grid */}
        <div className="absolute inset-0 grid-bg" style={{ opacity: 0.7 }} />

        {/* Orbs */}
        <div className="orb orb-purple" style={{ width: 800, height: 800, top: '-25%', left: '-15%', opacity: 0.55 }} />
        <div className="orb orb-cyan"   style={{ width: 600, height: 600, top: '5%',   right: '-10%', opacity: 0.4  }} />
        <div className="orb orb-pink"   style={{ width: 500, height: 500, bottom: '0', left: '25%',   opacity: 0.3  }} />
        <div className="orb orb-purple" style={{ width: 300, height: 300, top: '60%',  right: '15%',  opacity: 0.25, animationDelay: '3s' }} />

        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 20%, var(--color-bg) 100%)' }} />
      </div>

      {/* ── Particles ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: p.color, opacity: 0.55,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Scan lines ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none scanlines" />

      {/* ── Hero content ───────────────────────────────────────── */}
      <div
        ref={txtRef}
        className="relative z-10 text-center px-6"
        style={{ maxWidth: 900, willChange: 'transform, opacity' }}
      >
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 badge mb-8">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
          Powered by CMCx · KI-generierte Landing Pages
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold leading-none mb-6"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', letterSpacing: '-0.03em' }}
        >
          <span className="gradient-text" style={{ display: 'block' }}>CMCx</span>
          <span style={{ color: 'var(--color-text)', display: 'block', fontSize: '0.6em', fontWeight: 300, letterSpacing: '-0.01em' }}>
            Pages
          </span>
        </h1>

        {/* Glowing line */}
        <div
          className="mx-auto mb-8"
          style={{
            height: 2, width: 160,
            background: 'linear-gradient(90deg, transparent, #7c5cfc, #06c8d9, transparent)',
            borderRadius: 999,
            boxShadow: '0 0 20px rgba(124,92,252,0.8)',
          }}
        />

        {/* Subline */}
        <p
          className="text-[18px] leading-relaxed mb-10 mx-auto"
          style={{ color: 'var(--color-muted)', maxWidth: 500 }}
        >
          Jede Seite vollautomatisch aus einer Idee —{' '}
          <span style={{ color: 'var(--color-accent2)', fontWeight: 500 }}>
            kein Template, kein manuelles Schreiben.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#pages" className="btn-primary">
            Pages entdecken
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="btn-outline">
            ← CMCx Tool
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-muted)' }}>Scroll</span>
          <div className="scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
