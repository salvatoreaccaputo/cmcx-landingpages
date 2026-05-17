import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLandingPage, getLandingPages, parseLandingPage } from '../../../lib/supabase';
import type { LPSection } from '../../../lib/supabase';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const pages = await getLandingPages();
    return pages.map((p) => ({ id: p.id }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lp = await getLandingPage(id);
  if (!lp) return { title: 'Nicht gefunden' };
  return {
    title: lp.title,
    description: lp.idea?.slice(0, 160),
    openGraph: {
      title: lp.title,
      description: lp.idea?.slice(0, 160),
      images: lp.image_url ? [lp.image_url] : [],
    },
  };
}

/* ── Section renderers ─────────────────────────────────────── */
function renderLine(line: string, key: number) {
  if (!line.trim()) return <div key={key} style={{ height: 8 }} />;

  if (line.startsWith('- ') || line.startsWith('* ')) {
    return (
      <div key={key} className="flex items-start gap-3 mb-3">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: 'var(--color-accent)' }} />
        <span className="lp-content" style={{ color: 'var(--color-muted)', fontSize: 15, lineHeight: 1.75 }}>
          {line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
        </span>
      </div>
    );
  }
  if (line.startsWith('> ')) {
    return (
      <blockquote key={key} className="lp-content" style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: 16, margin: '20px 0', fontStyle: 'italic', color: '#c4b5fd' }}>
        {line.slice(2)}
      </blockquote>
    );
  }
  if (line.startsWith('**') && line.endsWith('**')) {
    return <p key={key} className="font-semibold mb-2" style={{ color: 'var(--color-text)', fontSize: 16 }}>{line.slice(2, -2)}</p>;
  }
  return (
    <p key={key} style={{ color: 'var(--color-muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
      {line.replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
    </p>
  );
}

function HeroSection({ section }: { section: LPSection }) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Gradient bg */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.1), transparent 60%)' }} />
      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-8"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a78bfa' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          KI-generierte Landing Page
        </div>
        <h1 className="text-[52px] sm:text-[64px] font-bold leading-[1.1] mb-6 gradient-text">
          {section.heading}
        </h1>
        {section.content && (
          <p className="text-[18px] leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            {section.content.split('\n').find(l => l.trim()) ?? ''}
          </p>
        )}
      </div>
    </section>
  );
}

function ProblemSection({ section }: { section: LPSection }) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: '#f87171' }}>Problem</div>
        <h2 className="text-[32px] font-bold leading-tight mb-8" style={{ color: 'var(--color-text)' }}>
          {section.heading}
        </h2>
        <div className="lp-content">
          {section.content.split('\n').map((l, i) => renderLine(l, i))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection({ section }: { section: LPSection }) {
  return (
    <section className="py-20 px-6" style={{ background: 'rgba(99,102,241,0.04)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: '#34d399' }}>Lösung</div>
        <h2 className="text-[32px] font-bold leading-tight mb-8" style={{ color: 'var(--color-text)' }}>
          {section.heading}
        </h2>
        <div className="lp-content">
          {section.content.split('\n').map((l, i) => renderLine(l, i))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ section }: { section: LPSection }) {
  const lines = section.content.split('\n').filter(l => l.trim());
  const bullets = lines.filter(l => l.startsWith('- ') || l.startsWith('* '));
  const prose   = lines.filter(l => !l.startsWith('- ') && !l.startsWith('* '));

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>Vorteile</div>
        <h2 className="text-[32px] font-bold leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
          {section.heading}
        </h2>
        {prose.map((l, i) => <p key={i} className="text-[16px] mb-8" style={{ color: 'var(--color-muted)' }}>{l}</p>)}

        {bullets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bullets.map((line, i) => (
              <div key={i} className="rounded-xl p-5 flex items-start gap-4"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[13px]"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>
                  {i + 1}
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection({ section }: { section: LPSection }) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12), transparent 70%)' }} />
      <div className="relative max-w-2xl mx-auto text-center">
        <h2 className="text-[36px] font-bold leading-tight mb-4 gradient-text">
          {section.heading}
        </h2>
        {section.content && (
          <p className="text-[16px] mb-8 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {section.content.split('\n').find(l => l.trim()) ?? ''}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white glow-accent"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Jetzt starten
          </button>
          <button className="px-7 py-3.5 rounded-xl text-[15px] font-semibold"
            style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
            Mehr erfahren
          </button>
        </div>
      </div>
    </section>
  );
}

function BodySection({ section }: { section: LPSection }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {section.heading && (
          <h2 className="text-[26px] font-bold mb-6" style={{ color: 'var(--color-text)' }}>{section.heading}</h2>
        )}
        <div className="lp-content">
          {section.content.split('\n').map((l, i) => renderLine(l, i))}
        </div>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function LPPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lp = await getLandingPage(id);
  if (!lp) notFound();

  const sections = parseLandingPage(lp.landingpage ?? '');
  /* If parsing yields nothing, fall back to raw render */
  const hasStructure = sections.length > 1;

  return (
    <div>
      {/* ── Hero image overlay (if available) ────────────── */}
      {lp.image_url && sections[0]?.type !== 'hero' && (
        <div className="relative w-full" style={{ height: 400 }}>
          <Image src={lp.image_url} alt={lp.title} fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-bg) 100%)' }} />
        </div>
      )}

      {/* ── Structured sections ───────────────────────────── */}
      {hasStructure ? sections.map((section, i) => {
        switch (section.type) {
          case 'hero':     return <HeroSection     key={i} section={section} />;
          case 'problem':  return <ProblemSection  key={i} section={section} />;
          case 'solution': return <SolutionSection key={i} section={section} />;
          case 'features': return <FeaturesSection key={i} section={section} />;
          case 'cta':      return <CTASection      key={i} section={section} />;
          default:         return <BodySection     key={i} section={section} />;
        }
      }) : (
        /* Fallback: plain title + content */
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-[40px] font-bold leading-tight mb-8 gradient-text">{lp.title}</h1>
          <div className="lp-content">
            {(lp.landingpage ?? '').split('\n').map((l, i) => renderLine(l, i))}
          </div>
        </div>
      )}

      {/* ── Footer meta ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div
          className="rounded-xl p-5 flex flex-wrap items-center gap-4 border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>AI</div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
              KI-generierte Landing Page
            </p>
            <p className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
              Erstellt mit CMCx · {lp.tone} · {lp.language === 'de' ? 'Deutsch' : 'English'}
            </p>
          </div>
          <a href="/" className="text-[12px] font-medium no-underline" style={{ color: 'var(--color-accent)' }}>
            ← Alle Pages
          </a>
        </div>
      </div>
    </div>
  );
}
