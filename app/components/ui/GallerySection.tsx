'use client';

import { useRef } from 'react';
import CylinderGallery, { type CylinderGalleryHandle } from './CylinderGallery';
import type { LandingPage } from '../../../lib/supabase';

export default function GallerySection({ pages }: { pages: LandingPage[] }) {
  const galleryRef = useRef<CylinderGalleryHandle>(null);

  return (
    <>
      {/* Headline + Button — zentriert */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: 20,
          }}
        >
          Pages entdecken
        </h2>

        <button
          onClick={() => galleryRef.current?.snapToNewest()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 22px', borderRadius: 12,
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.35)',
            color: '#fbbf24',
            fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.16)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.35)';
          }}
        >
          <span style={{ fontSize: 12 }}>✦</span>
          Aktuelle Seite
        </button>
      </div>

      <CylinderGallery ref={galleryRef} pages={pages} />
    </>
  );
}
