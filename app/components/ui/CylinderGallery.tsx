'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { LandingPage } from '../../../lib/supabase';

function fallbackImg(id: string) {
  const s = id.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'cmcx';
  return `https://picsum.photos/seed/${s}/600/400`;
}

/* Per-card image with automatic error→fallback */
function CardImage({ page }: { page: LandingPage }) {
  const [src, setSrc] = useState<string>(page.image_url || fallbackImg(page.id));
  return (
    <Image
      src={src}
      alt={page.title}
      fill
      sizes="340px"
      style={{ objectFit: 'cover' }}
      onError={() => setSrc(fallbackImg(page.id))}
    />
  );
}

interface Props { pages: LandingPage[] }

export default function CylinderGallery({ pages }: Props) {
  if (pages.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<HTMLDivElement>(null);
  const wrapRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs    = useRef<(HTMLAnchorElement | null)[]>([]);

  const N          = pages.length;
  const CARD_W     = 320;
  const CARD_H     = 210;
  /* radius so cards don't overlap */
  const RADIUS     = Math.max(560,
    Math.round(CARD_W / (2 * Math.tan(Math.PI / Math.max(N, 5)))) + 40);
  const ANGLE_STEP = 360 / N;

  /* MAX_ROT_SPEED: deg/frame at full mouse edge → 60fps → ~2°×60 = 120°/s */
  const MAX_ROT_SPEED = 2.2;
  const DEAD_ZONE     = 0.10;  /* center fraction where velocity = 0 */

  const st = useRef({
    rotY:        0,   /* accumulated — never resets */
    rotVel:      0,   /* current deg/frame */
    targetRotVel:0,   /* desired deg/frame from mouse */
    mouseNX: 0, mouseNY: 0,
    inside: false,
    time: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const scene     = sceneRef.current;
    if (!container || !scene) return;

    const s = st.current;

    /* ── Dead-zone helper ────────────────────────────────────── */
    const applyDeadZone = (v: number) => {
      if (Math.abs(v) < DEAD_ZONE) return 0;
      return v > 0
        ? (v - DEAD_ZONE) / (1 - DEAD_ZONE)
        : (v + DEAD_ZONE) / (1 - DEAD_ZONE);
    };

    /* ── Mouse tracking ──────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      s.inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      s.mouseNX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width  / 2)));
      s.mouseNY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

      if (s.inside) {
        s.targetRotVel = applyDeadZone(s.mouseNX) * MAX_ROT_SPEED;
      } else {
        s.targetRotVel = 0;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    /* ── Animation loop ──────────────────────────────────────── */
    let rafId: number;
    const tick = (ts: number) => {
      s.time = ts * 0.001;

      /* Smooth velocity (acceleration / deceleration) */
      s.rotVel += (s.targetRotVel - s.rotVel) * 0.08;

      /* Accumulate rotation — endlos */
      s.rotY += s.rotVel;

      if (scene) {
        scene.style.transform = `rotateY(${s.rotY}deg)`;
      }

      /* ── Per-card effects ──────────────────────────────────── */
      for (let i = 0; i < N; i++) {
        const inner = innerRefs.current[i];
        if (!inner) continue;

        /* World angle — s.rotY accumulates endlessly, use modulo */
        let worldAngle = ((ANGLE_STEP * i - (s.rotY % 360) + 360) % 360);
        if (worldAngle > 180) worldAngle -= 360;           /* -180..180 */
        const absAngle = Math.abs(worldAngle);

        /* facing: 1 = front, 0 = 90° sideways */
        const facing = Math.max(0, Math.cos(absAngle * Math.PI / 180));
        const isFront = facing > 0.25;

        /* Wobble: gentle oscillation while facing */
        const wobble = Math.sin(s.time * 1.4 + i * 1.3) * 5 * facing;

        /* Tilt toward mouse — only for front cards */
        const tiltX = wobble * facing;
        const tiltY = s.mouseNX * 12 * facing;

        /* Scale + glow */
        const scale = 1 + 0.16 * facing;
        const glow  = facing * 0.75;

        inner.style.transform =
          `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;

        inner.style.boxShadow = isFront
          ? `0 0 ${facing * 70}px rgba(124,92,252,${(glow * 0.85).toFixed(2)}),` +
            `0 ${facing * 20}px ${facing * 60}px rgba(0,0,0,0.55),`             +
            `inset 0 1px 0 rgba(255,255,255,${(facing * 0.12).toFixed(2)})`
          : '0 4px 20px rgba(0,0,0,0.4)';

        /* Backface: hide cards that have rotated past ~100° */
        const wrap = wrapRefs.current[i];
        if (wrap) {
          wrap.style.opacity   = absAngle > 95 ? '0' : String(Math.max(0.15, facing));
          wrap.style.zIndex    = String(Math.round(facing * 100));
        }

        /* Title overlay brightness */
        const titleEl = inner.querySelector('.cyl-title') as HTMLElement | null;
        if (titleEl) titleEl.style.opacity = String(0.45 + facing * 0.55);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [N, ANGLE_STEP, RADIUS]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Instruction hint */}
      <p
        className="font-display text-center text-[11px] font-semibold uppercase tracking-[0.2em] mb-8"
        style={{ color: 'var(--color-muted)', opacity: 0.6 }}
      >
        ← Maus an den linken oder rechten Rand halten zum Drehen →
      </p>

      {/* 3D viewport */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 520,
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
          position: 'relative',
        }}
      >
        {/* Edge fog — left / right */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
            background:
              'linear-gradient(90deg,' +
              'var(--color-bg) 0%,transparent 18%,transparent 82%,var(--color-bg) 100%)',
          }}
        />
        {/* Edge fog — top / bottom */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
            background:
              'linear-gradient(180deg,' +
              'var(--color-bg) 0%,transparent 18%,transparent 82%,var(--color-bg) 100%)',
          }}
        />

        {/* Scene — origin at center */}
        <div
          ref={sceneRef}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 0, height: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {pages.map((page, i) => {
            const angle = ANGLE_STEP * i;

            return (
              /* Cylinder slot — pure positioning, no visual */
              <div
                key={page.id}
                ref={el => { wrapRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  width: CARD_W, height: CARD_H,
                  marginLeft: -(CARD_W / 2),
                  marginTop:  -(CARD_H / 2),
                  transform:  `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  transformStyle: 'preserve-3d',
                  transition: 'opacity 0.15s',
                  willChange: 'opacity',
                }}
              >
                {/* Inner card — receives tilt + scale + glow from RAF */}
                <a
                  href={`/lp/${page.id}`}
                  ref={el => { innerRefs.current[i] = el; }}
                  style={{
                    display: 'block',
                    width: '100%', height: '100%',
                    borderRadius: 20,
                    overflow: 'hidden',
                    position: 'relative',
                    textDecoration: 'none',
                    border: '1px solid rgba(124,92,252,0.2)',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'transform, box-shadow',
                    cursor: 'pointer',
                  }}
                >
                  {/* Background image — error→picsum fallback */}
                  <CardImage page={page} />

                  {/* Dark gradient overlay */}
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background:
                        'linear-gradient(to top,' +
                        'rgba(6,6,15,0.95) 0%,' +
                        'rgba(6,6,15,0.45) 55%,' +
                        'rgba(6,6,15,0.1) 100%)',
                    }}
                  />

                  {/* Purple tint */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(124,92,252,0.07)' }} />

                  {/* Top badge */}
                  <div style={{ position: 'absolute', top: 14, left: 14 }}>
                    <span
                      className="font-display"
                      style={{
                        fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 9px', borderRadius: 99,
                        background: 'rgba(124,92,252,0.18)',
                        border: '1px solid rgba(124,92,252,0.35)',
                        color: '#a78bfa',
                      }}
                    >
                      {page.tone}
                    </span>
                  </div>

                  {/* Title */}
                  <div
                    className="cyl-title"
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px' }}
                  >
                    <p
                      className="font-display"
                      style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        lineHeight: 1.35,
                        letterSpacing: '-0.01em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {page.title}
                    </p>
                  </div>

                  {/* Hover arrow indicator */}
                  <div
                    style={{
                      position: 'absolute', bottom: 14, right: 16,
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(124,92,252,0.2)',
                      border: '1px solid rgba(124,92,252,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6.5 3l3.5 3-3.5 3" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
