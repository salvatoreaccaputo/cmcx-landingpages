import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export interface LandingPage {
  id:          string;
  created_at:  string;
  title:       string;
  idea:        string;
  tone:        string;
  language:    string;
  channels:    string[];
  landingpage: string | null;
  image_url:   string | null;
  image_prompt:string | null;
}

export async function getLandingPages(): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, created_at, title, idea, tone, language, channels, landingpage, image_url, image_prompt')
    .not('landingpage', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as LandingPage[];
}

export async function getLandingPage(id: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, created_at, title, idea, tone, language, channels, landingpage, image_url, image_prompt')
    .eq('id', id)
    .not('landingpage', 'is', null)
    .single();

  if (error) return null;
  return data as LandingPage;
}

/* ── Parse structured landing page sections ─────────────────── */
export interface LPSection {
  type: 'hero' | 'problem' | 'solution' | 'features' | 'cta' | 'body';
  heading?: string;
  content: string;
}

export function parseLandingPage(raw: string): LPSection[] {
  const sections: LPSection[] = [];
  const lines = raw.split('\n');
  let currentSection: LPSection | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (currentSection) {
      currentSection.content = buf.join('\n').trim();
      if (currentSection.content) sections.push(currentSection);
    }
    buf = [];
  };

  for (const line of lines) {
    if (line.startsWith('# ')) {
      flush();
      currentSection = { type: 'hero', heading: line.slice(2).trim(), content: '' };
    } else if (line.startsWith('## ')) {
      flush();
      const heading = line.slice(3).trim().toLowerCase();
      const type =
        heading.includes('problem') || heading.includes('herausforderung') ? 'problem' :
        heading.includes('lösung') || heading.includes('solution') ? 'solution' :
        heading.includes('feature') || heading.includes('vorteile') || heading.includes('leistungen') ? 'features' :
        heading.includes('cta') || heading.includes('jetzt') || heading.includes('kontakt') || heading.includes('start') ? 'cta' :
        'body';
      currentSection = { type, heading: line.slice(3).trim(), content: '' };
    } else {
      buf.push(line);
    }
  }
  flush();
  return sections;
}
