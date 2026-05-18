import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'CMCx Pages', template: '%s · CMCx Pages' },
  description: 'KI-generierte Landing Pages — vollautomatisch publiziert vom CMCx Content Orchestration Lab.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="noise-overlay">

        {/* ── Top nav ──────────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-16"
          style={{
            background: 'rgba(6,6,15,0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(124,92,252,0.1)',
          }}
        >
          <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 no-underline group">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #7c5cfc, #a855f7)' }}
              >
                <span className="relative z-10">C</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #06c8d9)' }}
                />
              </div>
              <span
                className="font-display font-semibold text-[15px]"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}
              >
                CMCx{' '}
                <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>Pages</span>
              </span>
            </a>

            {/* Nav links */}
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="nav-link text-[13px] font-medium no-underline transition-colors duration-200"
              >
                Alle Pages
              </a>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '10px' }}
              >
                Tool öffnen
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>

        {/* ── Content ──────────────────────────────────────────── */}
        <div style={{ paddingTop: 64, width: '100%' }}>
          {children}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer
          className="relative mt-24 overflow-hidden"
          style={{ borderTop: '1px solid rgba(124,92,252,0.1)' }}
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
