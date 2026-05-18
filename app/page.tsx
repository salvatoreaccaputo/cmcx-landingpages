import Image from 'next/image';
import { getLandingPages } from '../lib/supabase';
import type { LandingPage } from '../lib/supabase';
import ParallaxHero from './components/ui/ParallaxHero';
import Marquee from './components/ui/Marquee';
import ScrollReveal from './components/ui/ScrollReveal';
import StatsSection from './components/ui/StatsSection';
import CylinderGallery from './components/ui/CylinderGallery';

export const revalidate = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function excerpt(text: string | null, max = 130) {
  if (!text) return '';
  const clean = text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

const TONE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Professional:  { bg: 'rgba(16,185,129,0.08)',  text: '#34d399', border: 'rgba(16,185,129,0.25)' },
  Casual:        { bg: 'rgba(251,191,36,0.08)',   text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  Technical:     { bg: 'rgba(99,102,241,0.08)',   text: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  Inspirational: { bg: 'rgba(244,63,94,0.08)',    text: '#fb7185', border: 'rgba(244,63,94,0.25)'  },
  Bold:          { bg: 'rgba(251,146,60,0.08)',   text: '#fb923c', border: 'rgba(251,146,60,0.25)' },
};

function ToneBadge({ tone }: { tone: string }) {
  const c = TONE_COLORS[tone] ?? { bg: 'rgba(161,161,170,0.08)', text: '#a1a1aa', border: 'rgba(161,161,170,0.2)' };
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {tone}
    </span>
  );
}

/* ── Featured Card ──────────────────────────────────────────── */
function FeaturedCard({ lp }: { lp: LandingPage }) {
  return (
    <a href={`/lp/${lp.id}`} className="group block no-underline glow-border" style={{ borderRadius: 24 }}>
      <div className="featured-card relative overflow-hidden" style={{ borderRadius: 24 }}>
        {/* Background image */}
        {lp.image_url && (
          <div className="absolute inset-0">
            <Image
              src={lp.image_url}
              alt=""
              fill
              className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(6,6,15,0.95) 40%, rgba(6,6,15,0.6) 100%)',
              }}
            />
          </div>
        )}

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(124,92,252,0.15), transparent 70%)',
          }}
        />

        <div className="relative p-10 lg:p-14">
          {/* Tags row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="badge">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
              Featured
            </span>
            <ToneBadge tone={lp.tone} />
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
              {lp.language === 'de' ? '🇩🇪' : '🇬🇧'} {formatDate(lp.created_at)}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-display font-bold leading-tight mb-5 gradient-text"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', maxWidth: 680, letterSpacing: '-0.02em' }}
          >
            {lp.title}
          </h2>

          {/* Excerpt */}
          <p
            className="text-[16px] leading-relaxed mb-8"
            style={{ color: 'var(--color-muted)', maxWidth: 580 }}
          >
            {excerpt(lp.landingpage, 220)}
          </p>

          {/* CTA */}
          <div className="inline-flex">
            <span className="btn-primary">
              Landing Page öffnen
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ── Grid Card ──────────────────────────────────────────────── */
function LPCard({ lp, index }: { lp: LandingPage; index: number }) {
  return (
    <ScrollReveal delay={index * 60}>
      <a href={`/lp/${lp.id}`} className="group block no-underline card">
        {/* Image area */}
        {lp.image_url ? (
          <div className="relative w-full rounded-t-[19px] overflow-hidden" style={{ height: 180 }}>
            <Image
              src={lp.image_url}
              alt={lp.title}
              fill
              className="object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-400"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, var(--color-surface) 10%, transparent)' }}
            />
          </div>
        ) : (
          <div
            className="w-full rounded-t-[19px] flex items-center justify-center"
            style={{
              height: 140,
              background: 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(6,200,217,0.05))',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity={0.4}>
              <rect x="4" y="4" width="28" height="18" rx="4" stroke="#7c5cfc" strokeWidth="1.5"/>
              <rect x="4" y="26" width="12" height="5" rx="2" fill="#7c5cfc"/>
              <rect x="20" y="26" width="12" height="5" rx="2" fill="#06c8d9"/>
            </svg>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ToneBadge tone={lp.tone} />
          </div>
          <h3
            className="font-display font-semibold leading-snug mb-2"
            style={{ fontSize: '15px', color: 'var(--color-text)', letterSpacing: '-0.01em' }}
          >
            {lp.title}
          </h3>
          <p
            className="text-[13px] leading-relaxed mb-4"
            style={{ color: 'var(--color-muted)' }}
          >
            {excerpt(lp.landingpage)}
          </p>
          <div className="flex items-center justify-between">
            <time className="text-[11px]" style={{ color: 'rgba(161,161,170,0.5)' }}>
              {formatDate(lp.created_at)}
            </time>
            <span
              className="text-[12px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              style={{ color: 'var(--color-accent2)' }}
            >
              Öffnen
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6.5 3l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </a>
    </ScrollReveal>
  );
}

/* ── Empty State ────────────────────────────────────────────── */
function EmptyState() {
  return (
    <ScrollReveal>
      <div
        className="rounded-2xl p-16 text-center relative overflow-hidden"
        style={{
          border: '1px solid rgba(124,92,252,0.15)',
          background: 'linear-gradient(135deg, rgba(124,92,252,0.05), rgba(6,200,217,0.02))',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,92,252,0.07), transparent)',
          }}
        />
        <div
          className="relative z-10 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.2)' }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4v8M14 16v2" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="14" cy="14" r="10" stroke="#7c5cfc" strokeWidth="1.5" strokeDasharray="4 3"/>
          </svg>
        </div>
        <h2
          className="font-display font-semibold text-[20px] mb-3 relative z-10"
          style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}
        >
          Noch keine Landing Pages vorhanden
        </h2>
        <p
          className="text-[14px] mb-8 max-w-sm mx-auto relative z-10"
          style={{ color: 'var(--color-muted)', lineHeight: 1.7 }}
        >
          Generiere im CMCx-Tool Inhalte mit dem Kanal „Landing Page" — sie erscheinen hier automatisch.
        </p>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="btn-primary relative z-10"
        >
          CMCx Tool öffnen →
        </a>
      </div>
    </ScrollReveal>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default async function HomePage() {
  let pages: LandingPage[] = [];
  let fetchError: string | null = null;

  try {
    pages = await getLandingPages();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Ladefehler';
  }

  return (
    <>
      {/* ── Hero with Parallax ──────────────────────────────── */}
      <ParallaxHero />

      {/* ── Marquee ─────────────────────────────────────────── */}
      <Marquee />

      {/* ── Main Content ────────────────────────────────────── */}
      <main
        id="pages"
        style={{ maxWidth: 1152, margin: '0 auto', padding: '80px 24px', width: '100%' }}
      >

        {/* Stats */}
        <ScrollReveal>
          <div className="mb-6 text-center">
            <span className="badge">Echtzeit-Statistiken</span>
          </div>
          <StatsSection pageCount={pages.length} />
        </ScrollReveal>
        <div style={{ height: 80 }} />

        {/* Error */}
        {fetchError && (
          <div
            className="rounded-2xl p-6 mb-12 border"
            style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <p className="text-[14px]" style={{ color: '#f87171' }}>⚠ {fetchError}</p>
          </div>
        )}

        {/* Empty */}
        {!fetchError && pages.length === 0 && <EmptyState />}

        {/* 3D Cylinder Navigation */}
        {pages.length > 0 && (
          <ScrollReveal className="mb-4">
            <div className="text-center mb-10">
              <div className="badge inline-flex mb-4">
                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} verfügbar
              </div>
              <h2
                className="font-display font-bold gradient-text"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
              >
                Pages entdecken
              </h2>
            </div>
            <CylinderGallery pages={pages} />
          </ScrollReveal>
        )}
      </main>

      {/* ── Features Section ────────────────────────────────── */}
      <FeaturesSection />
    </>
  );
}

/* ── Features ───────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#7c5cfc" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'KI-generiert',
    desc: 'Vollautomatisch aus einer Idee — kein manuelles Schreiben, kein Template.',
    color: '#7c5cfc',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#06c8d9" strokeWidth="1.5"/>
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#06c8d9" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Echtzeit-Sync',
    desc: 'Neue Pages erscheinen automatisch — alle 10 Sekunden aktualisiert.',
    color: '#06c8d9',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#a78bfa" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#a78bfa" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#a78bfa" strokeWidth="1.5"/>
        <path d="M14 17.5h7M17.5 14v7" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Multi-Sprache',
    desc: '12 Sprachen unterstützt — Deutsch, Englisch und viele mehr.',
    color: '#a78bfa',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#f72585" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Blitzschnell',
    desc: 'Ø 12 Sekunden von der Idee zur fertigen Landing Page.',
    color: '#f72585',
  },
];

function FeaturesSection() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ background: 'var(--color-surface)' }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,92,252,0.07), transparent)',
        }}
      />

      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <ScrollReveal className="text-center mb-14">
          <div className="badge mb-4 mx-auto inline-flex">Platform Features</div>
          <h2
            className="font-display font-bold leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', color: 'var(--color-text)' }}
          >
            Automatisierung auf{' '}
            <span className="gradient-text-cyan">nächstem Level</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div
                className="card-glass p-7 h-full flex flex-col gap-4"
                style={{ borderColor: `${f.color}20` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}25`,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="font-display font-semibold text-[15px] mb-2"
                    style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
