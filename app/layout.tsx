import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'CMCx Pages', template: '%s · CMCx Pages' },
  description: 'KI-generierte Landing Pages — vollautomatisch publiziert vom CMCx Content Orchestration Lab.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>

        {/* ── Top nav ──────────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(6,6,15,0.82) 0%, rgba(6,6,15,0.55) 60%, transparent 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="max-w-6xl mx-auto h-full flex items-center justify-between" style={{ paddingLeft: 72, paddingRight: 48 }}>
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 no-underline group" style={{ whiteSpace: 'nowrap' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ryze-weiss.png"
                alt="RYZE"
                height={22}
                style={{ height: 22, width: 'auto', minWidth: 80, display: 'block', opacity: 0.95, flexShrink: 0 }}
              />
              <div
                className="h-4 w-px flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              />
              <span
                className="text-[13px] font-medium"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.05em',
                  fontFamily: 'system-ui, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                CMCX · Landingpage
              </span>
            </a>
          </div>
        </nav>

        {/* ── Content ──────────────────────────────────────────── */}
        <div style={{ width: '100%' }}>
          {children}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer
          className="relative mt-24 overflow-hidden"
          style={{
            borderTop: '1px solid rgba(124,92,252,0.12)',
            background: 'rgba(6,6,15,0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Footer glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(124,92,252,0.08), transparent)',
            }}
          />
          <div className="relative max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: 'linear-gradient(135deg, #7c5cfc, #a855f7)' }}
                >
                  AI
                </div>
                <div>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
                    CMCx
                  </span>
                  <span className="text-[13px] ml-1.5" style={{ color: 'var(--color-muted)' }}>
                    · Content Orchestration Lab
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {new Date().getFullYear()} · KI-generiert · Powered by Stitch
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
