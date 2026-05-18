'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { LandingPage } from '../../../lib/supabase';

/* ── Helpers ──────────────────────────────────────────────── */
function fallbackImg(id: string) {
  const s = id.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'cmcx';
  return `https://picsum.photos/seed/${s}/600/400`;
}

/* ── BandCard ─────────────────────────────────────────────── */
function BandCard({ page, active, isNewest }: { page: LandingPage; active: boolean; isNewest: boolean }) {
  const [src, setSrc] = useState<string>(page.image_url || fallbackImg(page.id));

  /* Neuester Artikel: goldener Rahmen + Glow */
  const newestBorder  = '1.5px solid rgba(251,191,36,0.75)';
  const newestShadow  = '0 0 28px rgba(251,191,36,0.25), 0 8px 32px rgba(0,0,0,0.4)';
  const activeBorder  = '1px solid rgba(124,92,252,0.65)';
  const defaultBorder = '1px solid rgba(124,92,252,0.18)';

  return (
    <a
      href={`/lp/${page.id}`}
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none',
        borderRadius: 16, overflow: 'hidden', flexShrink: 0, width: 260,
        border:     isNewest ? newestBorder : active ? activeBorder : defaultBorder,
        background: 'var(--color-surface)',
        boxShadow:  isNewest
          ? newestShadow
          : active
            ? '0 0 36px rgba(124,92,252,0.32), 0 14px 44px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.25)',
        transform:   active ? 'scale(1.06)' : 'scale(1)',
        transition:  'transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s, border-color 0.4s',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* NEU-Badge oben rechts */}
      {isNewest && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 10,
          padding: '3px 8px', borderRadius: 99,
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          color: '#1a0a00', fontSize: 9, fontWeight: 900,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          boxShadow: '0 2px 8px rgba(251,191,36,0.5)',
        }}>
          ✦ Neu
        </div>
      )}

      <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0 }}>
        <Image src={src} alt={page.title} fill sizes="280px"
          style={{ objectFit: 'cover' }}
          onError={() => setSrc(fallbackImg(page.id))} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,15,0.88) 0%,transparent 55%)' }} />
        {/* Goldener Schimmer für neuestem Artikel */}
        {isNewest && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(251,191,36,0.08), transparent 60%)', pointerEvents: 'none' }} />
        )}
        <div style={{ position: 'absolute', top: 10, left: 12 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 99, background: 'rgba(124,92,252,0.22)', border: '1px solid rgba(124,92,252,0.35)', color: '#a78bfa' }}>
            {page.tone}
          </span>
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
        <p style={{ color: '#eeeeff', fontWeight: 700, fontSize: 13, lineHeight: 1.45, fontFamily: 'var(--font-display)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
          {page.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: isNewest ? '#fbbf24' : active ? '#c4b5fd' : '#7c5cfc', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
          Lesen
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5h6M5 2l2.5 2.5L5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </a>
  );
}

/* ── GridCard ─────────────────────────────────────────────── */
function GridCard({ page, isNewest }: { page: LandingPage; isNewest: boolean }) {
  const [src, setSrc] = useState<string>(page.image_url || fallbackImg(page.id));
  return (
    <a href={`/lp/${page.id}`}
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none', position: 'relative',
        borderRadius: 14, overflow: 'hidden',
        border: isNewest ? '1.5px solid rgba(251,191,36,0.75)' : '1px solid rgba(124,92,252,0.18)',
        background: 'var(--color-surface)',
        boxShadow: isNewest ? '0 0 24px rgba(251,191,36,0.2)' : 'none',
        transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s',
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px) scale(1.02)'; if (!isNewest) { el.style.borderColor = 'rgba(124,92,252,0.5)'; el.style.boxShadow = '0 20px 56px rgba(124,92,252,0.22)'; } }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; if (!isNewest) { el.style.borderColor = 'rgba(124,92,252,0.18)'; el.style.boxShadow = ''; } }}>
      {isNewest && (
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, padding: '3px 8px', borderRadius: 99, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#1a0a00', fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(251,191,36,0.5)' }}>
          ✦ Neu
        </div>
      )}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', flexShrink: 0 }}>
        <Image src={src} alt={page.title} fill sizes="(max-width:1440px) 16vw, 220px" style={{ objectFit: 'cover' }} onError={() => setSrc(fallbackImg(page.id))} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,15,0.85) 0%,transparent 55%)' }} />
        {isNewest && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(251,191,36,0.07),transparent 60%)', pointerEvents: 'none' }} />}
        <div style={{ position: 'absolute', top: 8, left: 10 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 99, background: 'rgba(124,92,252,0.22)', border: '1px solid rgba(124,92,252,0.35)', color: '#a78bfa' }}>{page.tone}</span>
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ color: '#eeeeff', fontWeight: 700, fontSize: 12, lineHeight: 1.45, fontFamily: 'var(--font-display)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{page.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: isNewest ? '#fbbf24' : '#7c5cfc', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Lesen <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5h6M5 2l2.5 2.5L5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </a>
  );
}

/* ── Constants ────────────────────────────────────────────── */
const CARD_W      = 260;
const CARD_GAP    = 16;
const STEP        = CARD_W + CARD_GAP;
const AUTO_SPEED  = 1.0;   // px/frame auto-scroll
const MAX_SPEED   = 14.0;  // px/frame max mouse-controlled speed
const DEAD_ZONE   = 0.20;  // inner 40% of band width = neutral zone

/* ── Main ─────────────────────────────────────────────────── */
interface Props { pages: LandingPage[] }

export default function CylinderGallery({ pages }: Props) {
  if (pages.length === 0) return null;

  const [showGrid,  setShowGrid]  = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const wrapRef    = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  /* Animation state — mutable, not reactive */
  const st = useRef({
    pos:       0,
    vel:       0,
    targetVel: AUTO_SPEED,
    inside:    false,
    time:      0,
  });

  const N = pages.length;
  /* Duplicate cards for seamless infinite loop */
  const doubled = [...pages, ...pages];
  const loopLen = N * STEP; // width of one full set

  useEffect(() => {
    if (showGrid) return;
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const s = st.current;
    s.pos = 0; s.vel = 0; s.targetVel = AUTO_SPEED;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      s.inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!s.inside) { s.targetVel = AUTO_SPEED; return; }

      /* Normalised position from center: -1 (far left) .. +1 (far right) */
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);

      /* Dead zone in the middle */
      let driven: number;
      if (Math.abs(nx) <= DEAD_ZONE) {
        driven = 0;
      } else {
        const sign = nx > 0 ? 1 : -1;
        const t    = (Math.abs(nx) - DEAD_ZONE) / (1 - DEAD_ZONE); // 0..1
        driven = sign * t * MAX_SPEED;
      }
      s.targetVel = driven;
    };

    const onLeave = () => { s.inside = false; s.targetVel = AUTO_SPEED; };

    window.addEventListener('mousemove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);

    let rafId: number;
    const tick = (ts: number) => {
      s.time = ts * 0.001;

      /* Lerp velocity towards target */
      s.vel += (s.targetVel - s.vel) * 0.10;

      s.pos += s.vel;

      /* Seamless infinite loop */
      if (s.pos >= loopLen)  s.pos -= loopLen;
      if (s.pos < 0)         s.pos += loopLen;

      track.style.transform = `translateX(${-s.pos}px)`;

      /* Per-card: tilt (rotateZ) based on velocity + gentle individual wobble */
      const tiltBase = s.vel * 0.55;   // lean with speed direction
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const wobble = Math.sin(s.time * 1.8 + i * 0.9) * 0.6; // subtle sway
        el.style.transform = `rotateZ(${(tiltBase + wobble).toFixed(3)}deg)`;
      });

      /* Which card is nearest the viewport center? */
      const viewCenterX = wrap.getBoundingClientRect().width / 2;
      const centerPos   = s.pos + viewCenterX - 80;
      const idx         = Math.round(centerPos / STEP) % N;
      setActiveIdx(((idx % N) + N) % N);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [showGrid, N, loopLen]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* ── Controls ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: showGrid ? 0 : 1, transition: 'opacity 0.3s', pointerEvents: showGrid ? 'none' : 'auto' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', opacity: 0.55 }}>
            ← Mitte = Stop &nbsp;·&nbsp; Rand = Schnell →
          </span>
        </div>

        <button
          onClick={() => setShowGrid(g => !g)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10, background: showGrid ? 'rgba(124,92,252,0.18)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showGrid ? 'rgba(124,92,252,0.45)' : 'rgba(255,255,255,0.1)'}`, color: showGrid ? '#a78bfa' : 'var(--color-muted)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s' }}>
          {showGrid ? (
            <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 4h10M2 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>Band-Ansicht</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="8" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="8" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>Alle {pages.length} Pages</>
          )}
        </button>
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      {showGrid && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
          {pages.map((p, i) => <GridCard key={p.id} page={p} isNewest={i === 0} />)}
        </div>
      )}

      {/* ── Band ──────────────────────────────────────────────── */}
      {!showGrid && (
        <div style={{ position: 'relative' }}>
          {/* Left fog */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg,var(--color-bg) 0%,transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />
          {/* Right fog */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(270deg,var(--color-bg) 0%,transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />

          {/* Viewport clip */}
          <div ref={wrapRef} style={{ overflow: 'hidden', padding: '16px 80px 20px' }}>
            {/* Scrolling track — translated by RAF */}
            <div ref={trackRef} style={{ display: 'flex', gap: CARD_GAP, width: 'max-content', willChange: 'transform' }}>
              {doubled.map((page, i) => (
                <div key={`${page.id}-${i}`} ref={el => { cardRefs.current[i] = el; }}
                  style={{ willChange: 'transform', transformOrigin: 'center bottom' }}>
                  <BandCard page={page} active={(i % N) === activeIdx} isNewest={(i % N) === 0} />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            {pages.map((_, i) => (
              <div key={i} style={{ width: i === activeIdx ? 22 : 6, height: 6, borderRadius: 99, background: i === activeIdx ? '#7c5cfc' : 'rgba(124,92,252,0.25)', transition: 'all 0.3s cubic-bezier(.4,0,.2,1)' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
