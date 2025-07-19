export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getLanguageName(code: string): string {
  const language = getLanguageByCode(code);
  return language ? language.name : code;
}

export function getNativeLanguageName(code: string): string {
  const language = getLanguageByCode(code);
  return language ? language.nativeName : code;
}

export function getLanguageFlag(code: string): string {
  const language = getLanguageByCode(code);
  return language ? language.flag : '🌐';
}

export function isValidLanguageCode(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}

export function getDefaultSupportedLanguages(): string[] {
  return ['en'];
}

// Common UI translations
export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'welcome': 'Welcome',
    'read_more': 'Read More',
    'published_on': 'Published on',
    'by': 'By',
    'views': 'views',
    'categories': 'Categories',
    'tags': 'Tags',
    'related_posts': 'Related Posts',
    'total_posts': 'Total Posts',
    'total_views': 'Total Views',
    'avg_views': 'Average Views',
    'more_from': 'More from',
    'view_all_posts': 'View All Posts',
    'created': 'Created',
    'share': 'Share',
    'min_read': 'min read',
  },
  es: {
    'welcome': 'Bienvenido',
    'read_more': 'Leer Más',
    'published_on': 'Publicado el',
    'by': 'Por',
    'views': 'vistas',
    'categories': 'Categorías',
    'tags': 'Etiquetas',
    'related_posts': 'Posts Relacionados',
    'total_posts': 'Posts Totales',
    'total_views': 'Vistas Totales',
    'avg_views': 'Promedio de Vistas',
    'more_from': 'Más de',
    'view_all_posts': 'Ver Todos los Posts',
    'created': 'Creado',
    'share': 'Compartir',
    'min_read': 'min de lectura',
  },
  fr: {
    'welcome': 'Bienvenue',
    'read_more': 'Lire Plus',
    'published_on': 'Publié le',
    'by': 'Par',
    'views': 'vues',
    'categories': 'Catégories',
    'tags': 'Tags',
    'related_posts': 'Articles Connexes',
    'total_posts': 'Articles Totaux',
    'total_views': 'Vues Totales',
    'avg_views': 'Moyenne des Vues',
    'more_from': 'Plus de',
    'view_all_posts': 'Voir Tous les Articles',
    'created': 'Créé',
    'share': 'Partager',
    'min_read': 'min de lecture',
  },
  de: {
    'welcome': 'Willkommen',
    'read_more': 'Weiterlesen',
    'published_on': 'Veröffentlicht am',
    'by': 'Von',
    'views': 'Aufrufe',
    'categories': 'Kategorien',
    'tags': 'Tags',
    'related_posts': 'Verwandte Beiträge',
    'total_posts': 'Gesamtbeiträge',
    'total_views': 'Gesamtaufrufe',
    'avg_views': 'Durchschnittliche Aufrufe',
    'more_from': 'Mehr von',
    'view_all_posts': 'Alle Beiträge anzeigen',
    'created': 'Erstellt',
    'share': 'Teilen',
    'min_read': 'Min Lesezeit',
  },
};

export function getUITranslation(key: string, language: string): string {
  const translations = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];
  return translations[key] || key;
}

export function getUITranslations(language: string): Record<string, string> {
  return UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];
} 