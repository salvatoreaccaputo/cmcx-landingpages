import Image from 'next/image';
import { getLandingPages } from '../lib/supabase';
import type { LandingPage } from '../lib/supabase';

export const revalidate = 60;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function excerpt(text: string | null, max = 130) {
  if (!text) return '';
  const clean = text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

const TONE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Professional: { bg: 'rgba(16,185,129,0.08)', text: '#34d399', border: 'rgba(16,185,129,0.25)' },
  Casual:       { bg: 'rgba(251,191,36,0.08)',  text: '#fbbf24', border: 'rgba(251,191,36,0.25)'  },
  Technical:    { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', border: 'rgba(99,102,241,0.25)'  },
  Inspirational:{ bg: 'rgba(244,63,94,0.08)',   text: '#fb7185', border: 'rgba(244,63,94,0.25)'   },
  Bold:         { bg: 'rgba(251,146,60,0.08)',  text: '#fb923c', border: 'rgba(251,146,60,0.25)'  },
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

/* ── Featured card (first LP) ─────────────────────────────── */
function FeaturedCard({ lp }: { lp: LandingPage }) {
  return (
    <a href={`/lp/${lp.id}`} className="group block no-underline">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Background image with gradient overlay */}
        {lp.image_url && (
          <div className="absolute inset-0">
            <Image src={lp.image_url} alt="" fill className="object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--color-bg) 40%, transparent)' }} />
          </div>
        )}

        <div className="relative p-10">
          {/* Top tags */}
          <div className="flex items-center gap-2 mb-6">
            <span className="badge">Featured</span>
            <ToneBadge tone={lp.tone} />
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
              {lp.language === 'de' ? '🇩🇪' : '🇬🇧'} {formatDate(lp.created_at)}
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-[32px] font-bold leading-tight mb-4 gradient-text"
            style={{ maxWidth: 600 }}
          >
            {lp.title}
          </h2>

          {/* Idea */}
          <p className="text-[16px] leading-relaxed mb-8" style={{ color: 'var(--color-muted)', maxWidth: 560 }}>
            {excerpt(lp.landingpage, 200)}
          </p>

          {/* CTA */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold no-underline"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.35)',
              color: '#a78bfa',
            }}
          >
            Landing Page öffnen
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7.5 4l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ── Grid card ─────────────────────────────────────────────── */
function LPCard({ lp }: { lp: LandingPage }) {
  return (
    <a href={`/lp/${lp.id}`} className="group block no-underline card">
      {/* Image */}
      {lp.image_url ? (
        <div className="relative w-full rounded-t-2xl overflow-hidden" style={{ height: 160 }}>
          <Image src={lp.image_url} alt={lp.title} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-surface), transparent)' }} />
        </div>
      ) : (
        <div
          className="w-full rounded-t-2xl flex items-center justify-center"
          style={{ height: 100, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="16" rx="3" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
            <rect x="4" y="24" width="10" height="4" rx="1.5" fill="rgba(99,102,241,0.3)"/>
            <rect x="18" y="24" width="10" height="4" rx="1.5" fill="rgba(139,92,246,0.3)"/>
          </svg>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <ToneBadge tone={lp.tone} />
        </div>
        <h3 className="text-[16px] font-semibold leading-snug mb-2" style={{ color: 'var(--color-text)' }}>
          {lp.title}
        </h3>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
          {excerpt(lp.landingpage)}
        </p>
        <div className="flex items-center justify-between">
          <time className="text-[11px]" style={{ color: 'rgba(161,161,170,0.6)' }}>
            {formatDate(lp.created_at)}
          </time>
          <span className="text-[12px] font-medium" style={{ color: 'var(--color-accent)' }}>
            Öffnen →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function HomePage() {
  let pages: LandingPage[] = [];
  let fetchError: string | null = null;

  try {
    pages = await getLandingPages();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Ladefehler';
  }

  const [featured, ...rest] = pages;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 badge mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          KI-generierte Landing Pages
        </div>
        <h1 className="text-[52px] font-bold leading-tight mb-4 gradient-text">
          CMCx Pages
        </h1>
        <p className="text-[17px] max-w-lg mx-auto" style={{ color: 'var(--color-muted)' }}>
          Jede Seite wurde vollautomatisch aus einer Idee generiert —<br />kein Template, kein manuelles Schreiben.
        </p>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {fetchError && (
        <div className="rounded-xl p-6 mb-10 border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <p className="text-[14px]" style={{ color: '#f87171' }}>⚠ {fetchError}</p>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────── */}
      {!fetchError && pages.length === 0 && (
        <div
          className="rounded-2xl p-16 text-center border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-[20px] font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Noch keine Landing Pages vorhanden
          </h2>
          <p className="text-[14px] mb-8" style={{ color: 'var(--color-muted)' }}>
            Generiere im CMCx-Tool Inhalte mit dem Kanal „Landing Page" — sie erscheinen hier automatisch.
          </p>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold no-underline"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa' }}
          >
            CMCx Tool öffnen →
          </a>
        </div>
      )}

      {/* ── Featured ─────────────────────────────────────── */}
      {featured && (
        <div className="mb-10">
          <FeaturedCard lp={featured} />
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────── */}
      {rest.length > 0 && (
        <>
          <h2 className="text-[12px] font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-muted)' }}>
            Weitere Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((lp) => <LPCard key={lp.id} lp={lp} />)}
          </div>
        </>
      )}

      {pages.length > 0 && (
        <p className="text-center text-[11px] mt-16" style={{ color: 'rgba(255,255,255,0.1)' }}>
          {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} · automatisch aktualisiert
        </p>
      )}
    </div>
  );
}
