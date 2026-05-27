// Reference color stops only — expo-linear-gradient is NOT installed.
// Use solid top color + white curved bottom-sheet pattern for gradient simulation.
export const GradientStops = {
  brand: ['#1a6b65', '#134E4A', '#0c3533'],
  sos:   ['#EF4444', '#B91C1C'],
  amber: ['#F59E0B', '#D97706'],
} as const;

export const GradientColors = {
  brandTop:    '#134E4A',
  brandBottom: '#0c3533',
  sosTop:      '#EF4444',
  sosBottom:   '#B91C1C',
} as const;
