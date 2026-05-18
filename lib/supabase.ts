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
  type:     'hero' | 'problem' | 'solution' | 'features' | 'cta' | 'body';
  heading?: string;
  content:  string;
  /* Extracted template fields, e.g. "**Headline:** Foo" → fields.Headline = "Foo" */
  fields:   Record<string, string>;
}

/**
 * Extract **Key:** Value template fields — only at the START of a line.
 * Lines like "1. **Foo:** bar" or "- **Foo:** bar" are NOT matched (list content).
 * The original raw content is preserved unchanged in section.content.
 */
function extractFields(raw: string): Record<string, string> {
  const fields: Record<string, string> = {};
  /* Match **Key:** only when it starts a line (optional leading whitespace, NOT after list markers) */
  const re = /^[ \t]*\*\*([A-Za-z\u00C0-\u024F][^*:\n]{1,40}):\*\*[ \t]+([^\n]+)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    fields[m[1].trim()] = m[2].trim();
  }
  /* Also handle inline template format on a single line: **K1:** V1 **K2:** V2 */
  if (Object.keys(fields).length === 0) {
    const inlineRe = /\*\*([A-Za-z\u00C0-\u024F][^*:\n]{1,40}):\*\*\s*([^*\n]+?)(?=\s*\*\*[^*]+?:\*\*|$)/g;
    while ((m = inlineRe.exec(raw)) !== null) {
      const key = m[1].trim();
      const val = m[2].trim();
      if (val) fields[key] = val;
    }
  }
  return fields;
}

export function parseLandingPage(raw: string): LPSection[] {
  const sections: LPSection[] = [];
  const lines = raw.split('\n');
  let currentSection: LPSection | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (currentSection) {
      const rawContent = buf.join('\n').trim();
      /* Keep full original content — extractFields does NOT strip it */
      currentSection.content = rawContent;
      currentSection.fields  = extractFields(rawContent);
      if (rawContent) sections.push(currentSection);
    }
    buf = [];
  };

  for (const line of lines) {
    if (line.startsWith('# ')) {
      flush();
      currentSection = { type: 'hero', heading: line.slice(2).trim(), content: '', fields: {} };
    } else if (line.startsWith('## ')) {
      flush();
      const h = line.slice(3).trim().toLowerCase();
      const type =
        h.includes('problem') || h.includes('herausforderung') || h.includes('challenge') ? 'problem' :
        h.includes('lösung') || h.includes('solution')                                     ? 'solution' :
        h.includes('feature') || h.includes('vorteile') || h.includes('leistung')         ? 'features' :
        h.includes('cta') || h.includes('closing') || h.includes('jetzt') ||
          h.includes('kontakt') || h.includes('start') || h.includes('call')              ? 'cta'      :
        h.includes('hero')                                                                  ? 'hero'     :
        'body';
      currentSection = { type, heading: line.slice(3).trim(), content: '', fields: {} };
    } else {
      buf.push(line);
    }
  }
  flush();
  return sections;
}
