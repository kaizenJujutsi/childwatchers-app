export const Colors = {
  // Brand
  primary:      '#134E4A',
  primaryLight: '#1a6b65',
  primaryDark:  '#0c3533',
  accent:       '#D97706',
  accentLight:  '#F59E0B',

  // Status
  sos:      '#DC2626',
  sosDark:  '#B91C1C',
  safe:     '#059669',
  safeLight:'#10B981',
  mpesa:    '#00A651',

  // Greyscale
  white:    '#FFFFFF',
  offWhite: '#F8FAFC',
  grey50:   '#F1F5F9',
  grey100:  '#E2E8F0',
  grey200:  '#CBD5E1',
  grey400:  '#94A3B8',
  grey600:  '#475569',
  grey800:  '#1E293B',
  black:    '#0F172A',
  overlay:  'rgba(0,0,0,0.5)',

  // Legacy aliases (keep for backwards compat with existing screens)
  cardBg:   '#FFFFFF',
  screenBg: '#F8FAFC',

  // Surface tokens
  surfaceGlass:   'rgba(255,255,255,0.88)',
  surfaceOverlay: 'rgba(15,23,42,0.6)',

  // Text tokens
  textBrand:   '#134E4A',

  // Status light backgrounds
  safeLight2:   '#D1FAE5',
  warningLight: '#FEF3C7',
  dangerLight:  '#FEE2E2',
  infoBlue:     '#0284C7',
  infoLight:    '#E0F2FE',

  // Border tokens
  borderDefault: '#E2E8F0',
  borderFocus:   '#134E4A',
  borderError:   '#DC2626',
} as const;
