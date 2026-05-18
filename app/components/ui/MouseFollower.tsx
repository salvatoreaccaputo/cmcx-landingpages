'use client';

import { useEffect, useRef } from 'react';

export default function MouseFollower() {
  const spotRef   = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const posRef    = useRef({ x: -200, y: -200 });
  const ringPos   = useRef({ x: -200, y: -200 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    /* ── smooth ring follow via lerp ─────────────────────── */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, posRef.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, posRef.current.y, 0.12);

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x - 28}px, ${ringPos.current.y - 28}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      posRef.current = { x, y };

      /* instant: spotlight + dot cursor */
      if (spotRef.current) {
        spotRef.current.style.background =
          `radial-gradient(400px circle at ${x}px ${y}px,
            rgba(124,92,252,0.18) 0%,
            rgba(6,200,217,0.10) 35%,
            transparent 70%)`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
      }
    };

    const onEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (ringRef.current)   ringRef.current.style.opacity   = '1';
    };
    const onLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (ringRef.current)   ringRef.current.style.opacity   = '0';
    };

    /* scale ring on link/button hover */
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (ringRef.current) {
        ringRef.current.style.transform =
          t
            ? `translate(${ringPos.current.x - 28}px, ${ringPos.current.y - 28}px) scale(2.8)`
            : `translate(${ringPos.current.x - 28}px, ${ringPos.current.y - 28}px) scale(1)`;
        ringRef.current.style.borderColor = t ? 'rgba(6,200,217,0.9)' : 'rgba(124,92,252,0.8)';
        ringRef.current.style.background  = t ? 'rgba(6,200,217,0.08)' : 'transparent';
        ringRef.current.style.boxShadow   = t
          ? '0 0 20px rgba(6,200,217,0.5), inset 0 0 20px rgba(6,200,217,0.1)'
          : '0 0 16px rgba(124,92,252,0.6), inset 0 0 16px rgba(124,92,252,0.08)';
      }
    };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Page-wide spotlight ─────────────────────────────── */}
      <div
        ref={spotRef}
        className="pointer-events-none fixed inset-0 z-[998] transition-[background] duration-75"
        aria-hidden
      />

      {/* ── Cursor dot ──────────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[1001] opacity-0 transition-opacity duration-300"
        style={{
          top: 0, left: 0,
          width: 16, height: 16,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a78bfa, #06c8d9)',
          boxShadow: '0 0 16px rgba(124,92,252,1), 0 0 36px rgba(124,92,252,0.7), 0 0 72px rgba(124,92,252,0.3)',
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
        aria-hidden
      />

      {/* ── Cursor ring (lerp-smoothed) ──────────────────────── */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[1000] opacity-0"
        style={{
          top: 0, left: 0,
          width: 56, height: 56,
          borderRadius: '50%',
          border: '2px solid rgba(124,92,252,0.85)',
          boxShadow: '0 0 20px rgba(124,92,252,0.65), inset 0 0 20px rgba(124,92,252,0.08)',
          transition: 'opacity 0.3s, border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.12s ease-out',
          willChange: 'transform',
        }}
        aria-hidden
      />
    </>
  );
}
