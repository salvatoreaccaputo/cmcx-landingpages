'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const STATS: Stat[] = [
  { label: 'Generierte Pages', value: 0, suffix: '+', color: '#7c5cfc' },
  { label: 'Ø Generierungszeit', value: 12, suffix: 's', color: '#06c8d9' },
  { label: 'Unterstützte Sprachen', value: 12, suffix: '', color: '#a78bfa' },
  { label: 'Automatisch aktualisiert', value: 100, suffix: '%', color: '#f72585' },
];

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setCount(target); return; }
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div
      className="card-glass p-8 text-center relative overflow-hidden"
      style={{ borderColor: `${stat.color}20` }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: `radial-gradient(circle at 100% 0%, ${stat.color}20, transparent 70%)` }}
      />
      <div
        className="font-display font-bold mb-2 relative z-10"
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          color: stat.color,
          letterSpacing: '-0.03em',
          textShadow: `0 0 40px ${stat.color}80, 0 0 80px ${stat.color}30`,
        }}
      >
        {count}{stat.suffix}
      </div>
      <p className="text-[13px] font-semibold uppercase tracking-widest relative z-10" style={{ color: 'var(--color-muted)' }}>
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsSection({ pageCount }: { pageCount: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const stats = STATS.map((s) =>
    s.label === 'Generierte Pages' ? { ...s, value: pageCount } : s
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} active={active} />
      ))}
    </div>
  );
}
