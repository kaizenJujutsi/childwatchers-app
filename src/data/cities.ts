export const CITIES = {
  Nairobi: [
    'Kilimani', 'Lavington', 'Westlands', 'Kileleshwa', 'Parklands',
    'Muthaiga', 'Runda', 'Karen', 'Gigiri', 'Ridgeways', 'Loresho',
    'Kitisuru', 'Mountain View', 'South B', 'South C', 'Langata',
    'Hurlingham', 'Ngong Road', 'Upper Hill', 'BuruBuru', 'Umoja',
    'Donholm', 'Embakasi', 'Imara Daima', 'Pipeline', 'Eastleigh',
    'Kasarani', 'Roysambu', 'Kahawa West', 'Zimmerman', 'Githurai',
    'Kawangware', 'Dagoretti', 'Kangemi', 'Lower Kabete', 'Kinoo',
    'Satellite City', 'Syokimau', 'Mlolongo', 'Utawala',
  ],
  Mombasa: [
    'Mombasa Island', 'Nyali', 'Bamburi', 'Likoni', 'Changamwe',
    'Tudor', 'Kisauni', 'Shanzu', 'Mtongwe', 'Kizingo',
    'Ganjoni', 'Port Reitz', 'Mishomoroni',
  ],
  Kisumu: [
    'Kisumu Central', 'Milimani', 'Kondele', 'Manyatta', 'Nyalenda',
    'Obunga', 'Mamboleo', 'Kolwa', 'Riat Hills', 'Migosi',
    'Bandani', 'Lolwe',
  ],
  Nakuru: [
    'Nakuru Town', 'Section 58', 'Milimani', 'Lanet', 'Njoro',
    'Bahati', 'Rongai', 'Pangani', 'London', 'Kivumbini',
    'Free Area', 'Mwariki',
  ],
  Eldoret: [
    'Eldoret Town', 'Kapseret', 'Langas', 'Huruma', 'Pioneer',
    'Elgon View', 'Red Hill', 'Kamukunji', 'Sirikwa', 'Kimumu',
    'Annex', 'Munyaka',
  ],
} as const;

export type City = keyof typeof CITIES;
export const CITY_NAMES = Object.keys(CITIES) as City[];
