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
      style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
    >
      {/* ── Dark overlay so text stays readable over RYZE bg ──── */}
      <div className="absolute inset-0" style={{ background: 'rgba(6,6,15,0.55)' }} />

      {/* ── Parallax BG effects ────────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        {/* Grid */}
        <div className="absolute inset-0 grid-bg" style={{ opacity: 0.4 }} />

        {/* Orbs */}
        <div className="orb orb-purple" style={{ width: 700, height: 700, top: '-25%', left: '-15%', opacity: 0.35 }} />
        <div className="orb orb-cyan"   style={{ width: 500, height: 500, top: '5%',   right: '-10%', opacity: 0.25 }} />
        <div className="orb orb-pink"   style={{ width: 400, height: 400, bottom: '0', left: '25%',   opacity: 0.2  }} />

        {/* Bottom fade to blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,6,15,0.9))' }} />
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
        {/* Logo — COP composite */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cop_ryze_logo_composite01.png"
          alt="RYZE COP – Content Orchestration Platform"
          style={{ height: 'clamp(140px, 22vw, 220px)', width: 'auto', display: 'block', margin: '0 auto 48px' }}
        />

        {/* Headline */}
        <h1
          className="font-display font-bold uppercase tracking-[0.12em]"
          style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.12em',
            lineHeight: 1.4,
            marginBottom: 16,
          }}
        >
          KI-generierte Landing Pages · Powered by RYZE
        </h1>

        {/* Subline */}
        <p
          className="font-display font-medium tracking-[0.06em]"
          style={{
            fontSize: 'clamp(14px, 1.8vw, 18px)',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.06em',
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Jede Seite vollautomatisch aus einer Idee — kein Template, kein manuelles Schreiben.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap" style={{ marginBottom: 48 }}>
          <a
            href="#pages"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 12,
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.35)',
              color: '#fbbf24',
              fontSize: 14, fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.16)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.08)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.35)';
            }}
          >
            Seiten entdecken
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-3" style={{ opacity: 0.85 }}>
          <span className="font-display font-semibold uppercase tracking-[0.25em]" style={{ fontSize: '11px', color: '#ffffff' }}>Scroll</span>
          <div className="scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
