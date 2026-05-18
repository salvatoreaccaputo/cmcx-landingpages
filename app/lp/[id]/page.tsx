import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { getLandingPage, getLandingPages, parseLandingPage } from '../../../lib/supabase';
import type { LPSection } from '../../../lib/supabase';
import type { Metadata } from 'next';

/* Deterministischer Seed → immer dasselbe Bild pro Page */
function picsum(seed: string, w = 1200, h = 600) {
  const clean = seed.replace(/[^a-z0-9]/gi, '') || 'cmcx';
  /* Für Variation: letzten 12 Chars nehmen (enthält suffix wie 'hero', 'scene') */
  const s = clean.slice(-12);
  return `https://picsum.photos/seed/${s}/${w}/${h}`;
}

/** Nur externe URLs (https://...) verwenden — lokale Pfade (/images/...) existieren nicht */
function resolveImg(url: string | null | undefined, fallbackSeed: string, w = 900, h = 600): string {
  if (url && url.startsWith('http')) return url;
  return picsum(fallbackSeed, w, h);
}

export const revalidate = 10;

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

/* ── Markdown → Rich Nodes ──────────────────────────────────── */
function parseInline(text: string): string {
  /* Handle **Text:** (bold label with trailing colon) and **Text** */
  return text
    .replace(/\*\*([^*]+?):\*\*/g, '<strong>$1:</strong>')
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
}

function parseBullets(content: string) {
  const lines = content.split('\n');
  const bullets: string[] = [];
  for (const l of lines) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    /* Markdown bullet: "- foo" or "* foo" */
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bullets.push(trimmed.slice(2).trim());
      continue;
    }
    /* Numbered list: "1. foo" or "1. **foo**" */
    const numMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numMatch) { bullets.push(numMatch[1].trim()); continue; }
    /* Symbol/emoji bullet: "✦ text", "• text", "◆ text", "→ text" */
    const symbolMatch = trimmed.match(/^[^\w\s\-*]{1,3}\s+(.+)/u);
    if (symbolMatch) { bullets.push(symbolMatch[1].trim()); continue; }
  }
  return bullets;
}

/* Template instruction prefixes that must never appear as visible prose */
const TEMPLATE_LINE_RE = /^(CTA|Button|Primary CTA|Subheadline|Subline|Headline|Überschrift|Unterüberschrift)\s*:/i;

function parseProse(content: string) {
  return content
    .split('\n')
    .map(l => l.trim())
    .filter(l =>
      l &&
      !l.startsWith('- ') &&
      !l.startsWith('* ') &&
      !l.startsWith('>') &&
      !/^\d+\.\s/.test(l) &&
      /* Filter symbol/emoji bullet lines */
      !/^[^\w\s\-*]{1,3}\s+/u.test(l) &&
      /* Filter standalone **Key:** value template lines */
      !/^\*\*[^*]+:\*\*/.test(l) &&
      /* Filter template instruction lines like "CTA: ...", "Button: ..." */
      !TEMPLATE_LINE_RE.test(l)
    )
    .join(' ')
    .trim();
}

/* Strip "HERO", "PROBLEM" etc. from section headings — these are template labels */
function cleanHeading(h: string | undefined): string | undefined {
  if (!h) return h;
  const upper = h.toUpperCase().trim();
  const LABELS = ['HERO', 'PROBLEM', 'SOLUTION', 'FEATURES', 'CTA', 'PRICING',
    'SOCIAL PROOF', 'CLOSING CTA', 'OPENING CTA', 'BODY', 'BENEFITS'];
  if (LABELS.includes(upper)) return undefined;
  return h;
}

/* ── Icons ──────────────────────────────────────────────────── */
const FEATURE_ICONS = [
  <svg key={0} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l2.5 5.5H19l-4.5 3.5 1.7 5.5L11 13.5 5.8 16.5l1.7-5.5L3 7.5h5.5L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg key={1} width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M11 1v3M11 18v3M1 11h3M18 11h3M4.22 4.22l2.12 2.12M15.66 15.66l2.12 2.12M4.22 17.78l2.12-2.12M15.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={2} width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="12" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 12v8M12 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={3} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3l8 4.5v7L11 19l-8-4.5v-7L11 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 3v16M3 7.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={4} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/></svg>,
  <svg key={5} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

/* ══════════════════════════════════════════════════════════════
   SECTION COMPONENTS
══════════════════════════════════════════════════════════════ */

/* ── HERO ───────────────────────────────────────────────────── */
function HeroSection({ section, imageUrl, pageId, pageTitle }: { section: LPSection; imageUrl?: string | null; pageId: string; pageTitle: string }) {
  const heroImg = resolveImg(imageUrl, pageId + 'hero', 1200, 600);

  /* Priority: generated section.heading (new format) → template field → pageTitle */
  const headline = cleanHeading(section.heading) || section.fields['Headline'] || section.fields['Überschrift'] || section.fields['Title'] || pageTitle;
  const subline  = section.fields['Subheadline'] || section.fields['Subline']   || section.fields['Subtext']    || section.fields['Unterüberschrift'] || parseProse(section.content);
  /* Extract "CTA: ..." or "Button: ..." from raw content for the button label */
  const ctaFromContent = section.content.match(/^(?:Primary\s+)?CTA\s*:\s*(.+)/im)?.[1]?.trim()
                      || section.content.match(/^Button\s*:\s*(.+)/im)?.[1]?.trim();
  const ctaLabel = section.fields['Primary CTA'] || section.fields['CTA'] || section.fields['Button'] || ctaFromContent || 'Jetzt starten';

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>

      {/* ── Cinematic Image Banner (top) ── */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(320px, 52vh, 580px)', overflow: 'hidden' }}>
        <Image
          src={heroImg}
          alt={headline}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center 30%' }}
          priority
        />
        {/* Top fade: navbar blends into image */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,5,15,0.55) 0%, transparent 40%, transparent 55%, var(--color-bg) 100%)' }} />
        {/* Subtle purple tint */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,92,252,0.12), transparent 60%)', pointerEvents: 'none' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg" style={{ opacity: 0.18 }} />
      </div>

      {/* ── Text content (below image, no gap) ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1152, margin: '0 auto', padding: '52px 24px 80px', width: '100%' }}>

        {/* Glowing accent line connecting image to text */}
        <div style={{ width: 80, height: 3, marginBottom: 28, borderRadius: 99, background: 'linear-gradient(90deg, #7c5cfc, #06c8d9)', boxShadow: '0 0 24px rgba(124,92,252,0.8)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'flex-end' }}>
          <div>
            <div className="badge mb-6 inline-flex">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
              KI-generiert · CMCx Platform
            </div>
            <h1
              className="font-display font-bold leading-none gradient-text"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', letterSpacing: '-0.03em', marginBottom: 24 }}
            >
              {headline}
            </h1>
            {subline && (
              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', lineHeight: 1.75, color: 'var(--color-muted)', maxWidth: 640, marginBottom: 40 }}>
                {subline}
              </p>
            )}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: '15px 32px' }}>
                {ctaLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="btn-outline" style={{ fontSize: 15 }}>Mehr erfahren ↓</button>
            </div>
          </div>

          {/* Corner decoration */}
          <div style={{ opacity: 0.3, flexShrink: 0, alignSelf: 'flex-start', marginTop: 8 }}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                <circle key={`${r}-${c}`} cx={c*18+9} cy={r*18+9} r="2.5" fill="#7c5cfc" />
              )))}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div className="orb orb-cyan absolute pointer-events-none" style={{ width: 400, height: 400, bottom: '-20%', right: '-5%', opacity: 0.18 }} />
    </section>
  );
}

/* ── PROBLEM ────────────────────────────────────────────────── */
function ProblemSection({ section }: { section: LPSection }) {
  const bullets  = parseBullets(section.content);
  const prose    = section.fields['Description'] || section.fields['Beschreibung'] || parseProse(section.content);
  const heading  = cleanHeading(section.heading) || section.fields['Headline'] || 'Die Herausforderung';

  return (
    <section style={{ padding: '100px 0', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(247,37,133,0.06), transparent)' }} />
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'linear-gradient(90deg, #f72585, transparent)', marginBottom: 24 }} />
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.02em', color: 'var(--color-text)', marginBottom: 20, lineHeight: 1.15 }}>
              {heading}
            </h2>
            {prose && <p style={{ color: 'var(--color-muted)', fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>{prose}</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(bullets.length > 0 ? bullets : section.content.split('\n').filter(l => l.trim()).slice(0, 4)).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '18px 20px', borderRadius: 16, background: 'rgba(247,37,133,0.05)', border: '1px solid rgba(247,37,133,0.12)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'rgba(247,37,133,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v5M7 10v1" stroke="#f72585" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <p style={{ color: '#e4e4e7', fontSize: 15, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: parseInline(b) }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SOLUTION ───────────────────────────────────────────────── */
function SolutionSection({ section }: { section: LPSection }) {
  const bullets = parseBullets(section.content);
  const prose   = section.fields['Description'] || section.fields['Beschreibung'] || parseProse(section.content);

  return (
    <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient bg */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(124,92,252,0.07) 0%, rgba(6,200,217,0.04) 100%)',
        borderTop: '1px solid rgba(124,92,252,0.1)', borderBottom: '1px solid rgba(124,92,252,0.1)',
      }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(6,200,217,0.08), transparent)' }} />

      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Top label */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'linear-gradient(90deg, #06c8d9, transparent)', margin: '0 auto 24px' }} />
          <h2
            className="font-display font-bold gradient-text-cyan"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            {cleanHeading(section.heading) || section.fields['Headline'] || ''}
          </h2>
          {prose && (
            <p style={{ color: 'var(--color-muted)', fontSize: 18, maxWidth: 620, margin: '20px auto 0', lineHeight: 1.75 }}>
              {prose}
            </p>
          )}
        </div>

        {/* Solution items */}
        {bullets.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {bullets.map((b, i) => (
              <div
                key={i}
                className="card-glass"
                style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(124,92,252,0.2), rgba(6,200,217,0.15))',
                  border: '1px solid rgba(124,92,252,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#a78bfa',
                }}>
                  {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                </div>
                <p style={{ color: '#e4e4e7', fontSize: 15, lineHeight: 1.7 }}
                   dangerouslySetInnerHTML={{ __html: parseInline(b) }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── FEATURES ───────────────────────────────────────────────── */
function FeaturesSection({ section }: { section: LPSection }) {
  const bullets = parseBullets(section.content);
  const prose   = section.fields['Description'] || section.fields['Beschreibung'] || parseProse(section.content);
  const ACCENT_COLORS = ['#7c5cfc', '#06c8d9', '#a78bfa', '#f72585', '#10b981', '#f59e0b'];

  return (
    <section style={{ padding: '100px 0', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,252,0.07), transparent)' }} />

      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'linear-gradient(90deg, #7c5cfc, #a78bfa)', margin: '0 auto 24px' }} />
          <h2
            className="font-display font-bold gradient-text"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            {cleanHeading(section.heading) || section.fields['Headline'] || ''}
          </h2>
          {prose && (
            <p style={{ color: 'var(--color-muted)', fontSize: 18, maxWidth: 560, margin: '20px auto 0', lineHeight: 1.75 }}>
              {prose}
            </p>
          )}
        </div>

        {/* Feature cards */}
        {bullets.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {bullets.map((b, i) => {
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              /* Prefer **Bold:** desc format, then fall back to "Title: desc" split */
              const boldMatch = b.match(/^\*\*(.+?):\*\*\s*([\s\S]*)/);
              const title = boldMatch ? boldMatch[1].trim() : (b.includes(':') ? b.slice(0, b.indexOf(':')).replace(/\*\*/g, '').trim() : null);
              const desc  = boldMatch ? boldMatch[2].trim() : (b.includes(':') ? b.slice(b.indexOf(':') + 1).trim() : b);
              return (
                <div
                  key={i}
                  className="card"
                  style={{ padding: '32px 28px', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: '20px 20px 0 0' }} />
                  {/* Corner glow */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at 100% 0%, ${color}18, transparent 70%)`, pointerEvents: 'none' }} />

                  <div style={{
                    width: 48, height: 48, borderRadius: 14, marginBottom: 20,
                    background: `${color}18`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: color,
                  }}>
                    {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                  </div>
                  {title && (
                    <h3 className="font-display font-semibold" style={{ fontSize: 17, color: 'var(--color-text)', marginBottom: 10, letterSpacing: '-0.01em' }}>
                      {title}
                    </h3>
                  )}
                  <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.75 }}
                     dangerouslySetInnerHTML={{ __html: parseInline(title ? desc : b) }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── VISUAL BREAK — IMAGE 2 ─────────────────────────────────── */
function VisualBreakSection({ imageUrl: _imageUrl, pageId, title }: { imageUrl?: string | null; pageId: string; title: string }) {
  /* Atmosphärisches Hintergrundbild — kleinere Quelle für schnellere Ladezeit */
  const img2 = picsum(pageId + 'scene', 800, 300);

  return (
    <section style={{ padding: '0', position: 'relative', overflow: 'hidden' }}>
      {/* Full-width image with overlay */}
      <div style={{ position: 'relative', width: '100%', height: 480 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img2}
          alt={`${title} — Visual`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
        />
        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 25%, transparent 75%, var(--color-bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--color-bg) 0%, transparent 30%, transparent 70%, var(--color-bg) 100%)' }} />
        {/* Center overlay text */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: '0 24px' }}>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #7c5cfc, #06c8d9, transparent)', borderRadius: 99, boxShadow: '0 0 16px rgba(124,92,252,0.8)' }} />
          <p
            className="font-display font-semibold gradient-text"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: 700 }}
          >
            {title}
          </p>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #06c8d9, #7c5cfc, transparent)', borderRadius: 99, boxShadow: '0 0 16px rgba(6,200,217,0.8)' }} />
        </div>
      </div>
    </section>
  );
}

/* ── CTA ────────────────────────────────────────────────────── */
function CTASection({ section }: { section: LPSection }) {
  const heading  = cleanHeading(section.heading) || section.fields['Headline'] || section.fields['Überschrift'] || 'Jetzt loslegen';
  const subtext  = section.fields['Subheadline'] || section.fields['Description'] || section.fields['Subtext'] || parseProse(section.content);
  const cta1     = section.fields['Primary CTA']   || section.fields['CTA 1'] || section.fields['CTA'] || 'Jetzt starten — kostenlos';
  const cta2     = section.fields['Secondary CTA'] || section.fields['CTA 2'] || 'Demo ansehen';

  return (
    <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <div className="absolute inset-0">
        <div className="orb orb-purple absolute" style={{ width: 800, height: 800, top: '-30%', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, var(--color-bg) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 300, height: 2, background: 'linear-gradient(90deg, transparent, #7c5cfc, #06c8d9, transparent)', boxShadow: '0 0 20px rgba(124,92,252,0.8)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 99, background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.3)', color: '#a78bfa', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
          Bereit loszulegen?
        </div>
        <h2 className="font-display font-bold gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
          {heading}
        </h2>
        {subtext && <p style={{ color: 'var(--color-muted)', fontSize: 18, lineHeight: 1.75, marginBottom: 48 }}>{subtext}</p>}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ fontSize: 17, padding: '18px 44px', borderRadius: 16 }}>
            {cta1}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3l6 6-6 6M3 9h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="btn-outline" style={{ fontSize: 17 }}>{cta2}</button>
        </div>
      </div>
    </section>
  );
}

/* ── BODY (generic) ─────────────────────────────────────────── */
const SECTION_LABEL_MAP: Record<string, string> = {
  'SOCIAL PROOF': 'Das sagen unsere Kunden',
  'TESTIMONIALS': 'Kundenstimmen',
  'BENEFITS':     'Ihre Vorteile',
};

function BodySection({ section }: { section: LPSection }) {
  const bullets = parseBullets(section.content);
  const prose   = section.fields['Description'] || section.fields['Beschreibung'] || parseProse(section.content);
  const raw     = section.heading ?? '';
  const heading = cleanHeading(raw) || SECTION_LABEL_MAP[raw.toUpperCase().trim()] || section.fields['Headline'] || null;

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: bullets.length > 0 ? '1fr 1fr' : '1fr', gap: 60, alignItems: 'start' }}>
          <div>
            {heading && (
              <h2
                className="font-display font-bold"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', color: 'var(--color-text)', marginBottom: 20, lineHeight: 1.2 }}
              >
                {heading}
              </h2>
            )}
            {prose && <p style={{ color: 'var(--color-muted)', fontSize: 16, lineHeight: 1.85 }}>{prose}</p>}
          </div>
          {bullets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#7c5cfc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{ color: '#d4d4d8', fontSize: 15, lineHeight: 1.7 }}
                     dangerouslySetInnerHTML={{ __html: parseInline(b) }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default async function LPPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lp = await getLandingPage(id);
  if (!lp) notFound();

  const sections = parseLandingPage(lp.landingpage ?? '');
  const hasStructure = sections.length > 1;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>

      {/* ── Sections ─────────────────────────────────────────── */}
      {hasStructure ? (() => {
        /* VisualBreak wird direkt nach der Hero-Section eingefügt */
        const heroIdx = sections.findIndex(s => s.type === 'hero');
        const insertAt = heroIdx >= 0 ? heroIdx + 1 : 1;
        const withBreak: React.ReactNode[] = [];

        /* Sektionen die vom KI-Template immer generisch befüllt werden → überspringen */
        const SKIP_HEADINGS = ['PRICING', 'PREISE', 'PREISE & PAKETE'];

        sections.forEach((section, i) => {
          /* PRICING immer ausblenden — KI generiert das immer als Platzhalter */
          if (SKIP_HEADINGS.includes((section.heading ?? '').toUpperCase().trim())) return;

          switch (section.type) {
            case 'hero':     withBreak.push(<HeroSection     key={i} section={section} imageUrl={lp.image_url} pageId={lp.id} pageTitle={lp.title} />); break;
            case 'problem':  withBreak.push(<ProblemSection  key={i} section={section} />); break;
            case 'solution': withBreak.push(<SolutionSection key={i} section={section} />); break;
            case 'features': withBreak.push(<FeaturesSection key={i} section={section} />); break;
            case 'cta':      withBreak.push(<CTASection      key={i} section={section} />); break;
            default:         withBreak.push(<BodySection     key={i} section={section} />); break;
          }
          /* VisualBreak nach Hero einfügen */
          if (i === insertAt - 1) {
            withBreak.push(
              <VisualBreakSection key="visual-break" imageUrl={lp.image_url} pageId={lp.id} title={lp.title} />
            );
          }
        });
        /* Fallback: kein Hero → am Anfang */
        if (heroIdx < 0) {
          withBreak.unshift(<VisualBreakSection key="visual-break" imageUrl={lp.image_url} pageId={lp.id} title={lp.title} />);
        }
        return withBreak;
      })() : (
        <>
          <HeroSection
            section={{ type: 'hero', heading: lp.title, content: lp.idea ?? '', fields: {} }}
            imageUrl={lp.image_url}
            pageId={lp.id}
            pageTitle={lp.title}
          />
          <VisualBreakSection imageUrl={lp.image_url} pageId={lp.id} title={lp.title} />
          <BodySection section={{ type: 'body', heading: '', content: lp.landingpage ?? '', fields: {} }} />
        </>
      )}

      {/* ── Back bar ─────────────────────────────────────────── */}
      <div style={{ padding: '48px 24px 80px', maxWidth: 1152, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px', borderRadius: 16,
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,92,252,0.12)',
            flexWrap: 'wrap', gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #7c5cfc, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 10, fontWeight: 900,
              }}
            >AI</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>KI-generierte Landing Page</p>
              <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                CMCx · {lp.tone} · {lp.language === 'de' ? 'Deutsch' : 'English'}
              </p>
            </div>
          </div>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Alle Pages
          </a>
        </div>
      </div>
    </div>
  );
}
