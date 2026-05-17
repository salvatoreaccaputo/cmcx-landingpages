import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'CMCx Pages', template: '%s · CMCx Pages' },
  description: 'KI-generierte Landing Pages — automatisch publiziert.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        {/* ── Top nav ─────────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6"
          style={{
            background: 'rgba(9,9,11,0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 no-underline">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                P
              </div>
              <span className="font-semibold text-[15px]" style={{ color: 'var(--color-text)' }}>
                CMCx <span style={{ color: 'var(--color-muted)' }}>Pages</span>
              </span>
            </a>

            {/* Nav links */}
            <div className="flex items-center gap-6">
              <a href="/" className="text-[13px] no-underline" style={{ color: 'var(--color-muted)' }}>
                Alle Pages
              </a>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg no-underline"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#a78bfa',
                }}
              >
                ← Tool
              </a>
            </div>
          </div>
        </nav>

        {/* ── Content ─────────────────────────────────────────── */}
        <div style={{ paddingTop: 56 }}>
          {children}
        </div>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer
          className="mt-24 border-t py-10 px-6"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-black"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                AI
              </div>
              <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
                Generiert mit CMCx · Content Orchestration Lab
              </span>
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
              {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
