export type ContentLanguage = 'de' | 'en' | 'it' | 'fr';

const LOCALES: Record<ContentLanguage, string> = {
  de: 'de-DE',
  en: 'en-GB',
  it: 'it-IT',
  fr: 'fr-FR',
};

export const LANGUAGE_FLAGS: Record<ContentLanguage, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  it: '🇮🇹',
  fr: '🇫🇷',
};

export function contentLanguage(value: string): ContentLanguage {
  return value === 'de' || value === 'it' || value === 'fr' ? value : 'en';
}

export const LANDING_COPY: Record<ContentLanguage, {
  new: string;
  read: string;
  open: string;
  openPage: string;
  generatedPage: string;
  allPages: string;
  languageLabel: string;
}> = {
  de: {
    new: 'Neu',
    read: 'Lesen',
    open: 'Öffnen',
    openPage: 'Landing Page öffnen',
    generatedPage: 'KI-generierte Landing Page',
    allPages: 'Alle Pages',
    languageLabel: 'Deutsch',
  },
  en: {
    new: 'New',
    read: 'Read',
    open: 'Open',
    openPage: 'Open landing page',
    generatedPage: 'AI-generated landing page',
    allPages: 'All pages',
    languageLabel: 'English',
  },
  it: {
    new: 'Nuovo',
    read: 'Leggi',
    open: 'Apri',
    openPage: 'Apri la landing page',
    generatedPage: 'Landing page generata con IA',
    allPages: 'Tutte le pagine',
    languageLabel: 'Italiano',
  },
  fr: {
    new: 'Nouveau',
    read: 'Lire',
    open: 'Ouvrir',
    openPage: 'Ouvrir la landing page',
    generatedPage: 'Landing page générée par IA',
    allPages: 'Toutes les pages',
    languageLabel: 'Français',
  },
};

export function formatLocalizedDate(iso: string, language: string): string {
  return new Date(iso).toLocaleDateString(LOCALES[contentLanguage(language)], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
