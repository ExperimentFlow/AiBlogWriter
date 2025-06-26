export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    container: string;
    section: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and professional design',
    preview: '🎨',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
    },
    gradients: {
      hero: 'from-slate-50 via-white to-blue-50',
      card: 'from-white to-gray-50',
      button: 'from-blue-600 to-blue-700',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    spacing: {
      container: 'container mx-auto px-4',
      section: 'py-12',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Modern dark theme',
    preview: '🌙',
    colors: {
      primary: '#6366F1',
      secondary: '#A855F7',
      accent: '#10B981',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
    },
    gradients: {
      hero: 'from-slate-900 via-slate-800 to-indigo-900',
      card: 'from-slate-800 to-slate-700',
      button: 'from-indigo-600 to-indigo-700',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    spacing: {
      container: 'container mx-auto px-4',
      section: 'py-12',
    },
  },
  {
    id: 'warm',
    name: 'Warm & Cozy',
    description: 'Warm and inviting design',
    preview: '🔥',
    colors: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#10B981',
      background: '#FEF3C7',
      surface: '#FFFFFF',
      text: '#92400E',
      textSecondary: '#B45309',
    },
    gradients: {
      hero: 'from-amber-50 via-orange-50 to-red-50',
      card: 'from-white to-amber-50',
      button: 'from-amber-600 to-orange-600',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    spacing: {
      container: 'container mx-auto px-4',
      section: 'py-12',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Fresh and natural theme',
    preview: '🌿',
    colors: {
      primary: '#059669',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: '#ECFDF5',
      surface: '#FFFFFF',
      text: '#064E3B',
      textSecondary: '#047857',
    },
    gradients: {
      hero: 'from-green-50 via-emerald-50 to-teal-50',
      card: 'from-white to-green-50',
      button: 'from-green-600 to-emerald-600',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    spacing: {
      container: 'container mx-auto px-4',
      section: 'py-12',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimal design',
    preview: '⚪',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#3B82F6',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
    },
    gradients: {
      hero: 'from-white to-gray-50',
      card: 'from-white to-gray-50',
      button: 'from-gray-900 to-black',
    },
    fonts: {
      heading: 'font-light',
      body: 'font-normal',
    },
    spacing: {
      container: 'container mx-auto px-4',
      section: 'py-16',
    },
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic vintage aesthetic',
    preview: '📜',
    colors: {
      primary: '#92400E',
      secondary: '#7C2D12',
      accent: '#D97706',
      background: '#FEF3C7',
      surface: '#FDE68A',
      text: '#451A03',
      textSecondary: '#92400E',
    },
    gradients: {
      hero: 'from-amber-100 via-yellow-50 to-orange-100',
      card: 'from-amber-50 to-yellow-50',
      button: 'from-amber-700 to-orange-700',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    spacing: {
      container: 'container mx-auto px-4',
      section: 'py-12',
    },
  },
];

export function getTheme(themeId: string): ThemeConfig {
  return themes.find(theme => theme.id === themeId) || themes[0];
}

export function getThemeStyles(theme: ThemeConfig) {
  return {
    background: `bg-gradient-to-br ${theme.gradients.hero}`,
    card: `bg-gradient-to-br ${theme.gradients.card}`,
    button: `bg-gradient-to-r ${theme.gradients.button}`,
    textPrimary: `text-[${theme.colors.text}]`,
    textSecondary: `text-[${theme.colors.textSecondary}]`,
    primary: `text-[${theme.colors.primary}]`,
    secondary: `text-[${theme.colors.secondary}]`,
  };
} 