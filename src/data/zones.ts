export const NAIROBI_ZONES = [
  // Inner Nairobi — Premium
  'Kilimani',
  'Lavington',
  'Westlands',
  'Kileleshwa',
  'Parklands',
  'Muthaiga',
  'Runda',
  'Karen',
  'Gigiri',
  'Ridgeways',
  'Loresho',
  'Kitisuru',
  'Mountain View',
  // South Nairobi
  'South B',
  'South C',
  'Langata',
  'Hurlingham',
  'Ngong Road',
  'Upper Hill',
  // Eastlands
  'BuruBuru',
  'Umoja',
  'Donholm',
  'Embakasi',
  'Imara Daima',
  'Pipeline',
  'Eastleigh',
  // Northern Corridor
  'Kasarani',
  'Roysambu',
  'Kahawa West',
  'Zimmerman',
  'Githurai',
  // Western Nairobi
  'Kawangware',
  'Dagoretti',
  'Kangemi',
  'Lower Kabete',
  'Kinoo',
  // Satellite / Outskirts
  'Satellite City',
  'Syokimau',
  'Mlolongo',
  'Utawala',
] as const;

export type NairobiZone = typeof NAIROBI_ZONES[number];
