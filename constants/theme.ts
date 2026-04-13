// Neshnabé Connect | Wolf Flow Solutions LLC 2026

export const Colors = {
  bg: '#1A1614',
  bgCard: '#2A2420',
  amber: '#D4A574',
  amberGlow: 'rgba(212, 165, 116, 0.3)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassActive: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  dept: {
    housing: '#8B6F47',
    health: '#7CB342',
    finance: '#D4AF37',
    culture: '#CD7F32',
    legal: '#4A7BA7',
    education: '#5B9BD5',
    police: '#2C3E50',
    social: '#9B59B6',
    communications: '#E74C3C',
    environmental: '#27AE60',
    it: '#3498DB',
    enrollment: '#F39C12',
    planning: '#8E8E93',
    membership: '#C4725A',
    publicworks: '#6D7B8D',
    court: '#34495E',
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  h1: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  potawatomi: {
    fontSize: 13,
    fontWeight: '500' as const,
    fontStyle: 'italic' as const,
    color: Colors.amber,
    opacity: 0.8,
  },
};

export const GlassCard = {
  backgroundColor: Colors.glass,
  borderWidth: 1,
  borderColor: Colors.glassBorder,
  borderRadius: BorderRadius.lg,
};

export const PrimaryButton = {
  backgroundColor: Colors.amber,
  borderRadius: BorderRadius.xl,
  height: 48,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

export const SecondaryButton = {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: Colors.amber,
  borderRadius: BorderRadius.xl,
  height: 48,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

export const FilterChipActive = {
  backgroundColor: Colors.amber,
  height: 32,
  borderRadius: BorderRadius.xl,
  paddingHorizontal: Spacing.md,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

export const FilterChipInactive = {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  height: 32,
  borderRadius: BorderRadius.xl,
  paddingHorizontal: Spacing.md,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

export function getGreeting(): { potawatomi: string; english: string } {
  const hour = new Date().getHours();
  
  if (hour >= 4 && hour < 12) {
    return { potawatomi: 'Waben', english: 'Good Morning' };
  } else if (hour >= 12 && hour < 18) {
    return { potawatomi: 'Nawkwek', english: 'Good Afternoon' };
  } else if (hour >= 18 && hour < 22) {
    return { potawatomi: 'Nakwshe', english: 'Good Evening' };
  } else {
    return { potawatomi: 'Pkonya', english: 'Good Night' };
  }
}

export const DepartmentEmojis: Record<string, string> = {
  'Housing': '\u{1F3E0}',
  'Health & Human Services': '\u{1F3E5}',
  'Health': '\u{1F3E5}',
  'Finance': '\u{1F4B0}',
  'Culture': '\u{1FAB6}',
  'Language & Culture': '\u{1FAB6}',
  'Legal': '\u{2696}',
  'Education': '\u{1F393}',
  'Tribal Police': '\u{1F6E1}',
  'Police': '\u{1F6E1}',
  'Social Services': '\u{1F932}',
  'Communications': '\u{1F4E1}',
  'Environmental': '\u{1F33F}',
  'IT': '\u{1F4BB}',
  'Information Technology': '\u{1F4BB}',
  'Enrollment': '\u{1FAAA}',
  'Planning': '\u{1F4CB}',
  'Membership Services': '\u{1F465}',
  'Membership': '\u{1F465}',
  'Public Works': '\u{1F527}',
  'Tribal Court': '\u{2696}',
  'Court': '\u{2696}',
  'Human Resources': '\u{1F464}',
  'HR': '\u{1F464}',
  'Government Records': '\u{1F4C1}',
  'Elders Services': '\u{1F9D3}',
  'Elders': '\u{1F9D3}',
  'Youth Services': '\u{2B50}',
  'Youth': '\u{2B50}',
  'MILS': '\u{1F4BC}',
  'Store': '\u{1F6CD}',
  'Administration': '\u{1F3DB}',
  'FireKeepers Casino Hotel': '\u{1F525}',
  'Waseyabek': '\u{2600}',
  'Gaming Commission': '\u{1F3B2}',
  'Tribal Council': '\u{1F465}',
};

export function getDepartmentEmoji(name: string): string {
  return DepartmentEmojis[name] || '\u{1F4CB}';
}
