import { NAIROBI_ZONES } from './zones';

export interface VettingStep {
  id: string;
  title: string;
  subtitle: string;
  status: 'complete' | 'pending' | 'failed';
  badge: string;
}

export interface Review {
  parent: string;
  rating: number;
  text: string;
  date: string;
}

export interface Watcher {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  ratePerHour: number;
  zone: string;
  experience: string;
  specialties: string[];
  bio: string;
  availability: string;
  vettingComplete: boolean;
  vettingSteps: VettingStep[];
  reviews: Review[];
  languages: string[];
  age: number;
}

export const BASE_VETTING: VettingStep[] = [
  { id: '1', title: 'National ID Verification', subtitle: 'IPRS / eCitizen confirmed', status: 'complete', badge: 'VERIFIED' },
  { id: '2', title: 'Liveness & Face Match', subtitle: 'Biometric check passed', status: 'complete', badge: 'PASSED' },
  { id: '3', title: 'DCI Criminal Record', subtitle: 'No criminal history found', status: 'complete', badge: 'CLEAR' },
  { id: '4', title: 'CRB Financial Check', subtitle: 'Financial standing verified', status: 'complete', badge: 'CLEAR' },
  { id: '5', title: 'Health Screening', subtitle: 'KMA certified — valid 12 months', status: 'complete', badge: 'CERTIFIED' },
  { id: '6', title: 'Childcare Training', subtitle: 'NITA 4-module certification', status: 'complete', badge: '4/4 MODULES' },
  { id: '7', title: 'In-Person Interview', subtitle: 'Nyumba Kumi office — Kilimani', status: 'complete', badge: 'APPROVED' },
];

export const WATCHERS: Watcher[] = [
  {
    id: 'w1',
    name: 'Grace Njeri',
    photo: 'https://i.pravatar.cc/200?img=47',
    rating: 4.9,
    reviewCount: 87,
    ratePerHour: 450,
    zone: 'Kilimani',
    experience: '6 years',
    specialties: ['Infants', 'Special Needs', 'First Aid'],
    bio: 'Passionate childcare professional with over 6 years caring for children aged 0–12. Trained in infant CPR and special needs support.',
    availability: 'Mon–Sat, 7am–8pm',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Kikuyu'],
    age: 31,
    reviews: [
      { parent: 'Amina K.', rating: 5, text: 'Grace is absolutely wonderful with my twins. Punctual, caring, and incredibly patient.', date: '2 days ago' },
      { parent: 'David M.', rating: 5, text: 'Trusted her with our 3-month-old. She was calm, professional and kept us updated constantly.', date: '1 week ago' },
      { parent: 'Faith O.', rating: 4, text: 'Very good with our daughter. Would book again!', date: '2 weeks ago' },
    ],
  },
  {
    id: 'w2',
    name: 'Maureen Karanja',
    photo: 'https://i.pravatar.cc/200?img=32',
    rating: 4.8,
    reviewCount: 63,
    ratePerHour: 500,
    zone: 'Lavington',
    experience: '8 years',
    specialties: ['Toddlers', 'Homework Help', 'Cooking'],
    bio: 'Early childhood educator with 8 years experience. Specialises in structured learning activities for toddlers and school-age children.',
    availability: 'Mon–Fri, 6am–7pm',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English'],
    age: 35,
    reviews: [
      { parent: 'James N.', rating: 5, text: 'Maureen helped my son with reading while watching him. She goes above and beyond.', date: '3 days ago' },
      { parent: 'Caroline W.', rating: 5, text: 'Best watcher we have had. Our children adore her.', date: '1 week ago' },
      { parent: 'Peter A.', rating: 4, text: 'Very professional and reliable.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'w3',
    name: 'Sharon Otieno',
    photo: 'https://i.pravatar.cc/200?img=56',
    rating: 4.9,
    reviewCount: 104,
    ratePerHour: 400,
    zone: 'Kilimani',
    experience: '5 years',
    specialties: ['Newborns', 'Night Shifts', 'CPR Certified'],
    bio: 'Newborn specialist and certified CPR trainer. Available for night shifts and long-term engagements.',
    availability: 'Mon–Sun, 24hr availability',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Luo'],
    age: 28,
    reviews: [
      { parent: 'Lucy M.', rating: 5, text: 'Sharon watched our newborn during our first date night out. Texted updates every hour. Incredible.', date: '1 day ago' },
      { parent: 'Robert K.', rating: 5, text: 'Night shift watcher — absolutely reliable. Our baby slept through every night she was here.', date: '5 days ago' },
    ],
  },
  {
    id: 'w4',
    name: 'Joyce Muthoni',
    photo: 'https://i.pravatar.cc/200?img=41',
    rating: 4.7,
    reviewCount: 51,
    ratePerHour: 350,
    zone: 'Westlands',
    experience: '4 years',
    specialties: ['School-Age', 'Arts & Crafts', 'Outdoor Play'],
    bio: 'Fun and energetic childcare provider who loves outdoor activities and creative play for children aged 3–10.',
    availability: 'Mon–Sat, 8am–6pm',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English'],
    age: 26,
    reviews: [
      { parent: 'Wanjiru T.', rating: 5, text: 'My kids beg me to call Joyce every weekend. They love her so much!', date: '4 days ago' },
      { parent: 'Hassan A.', rating: 4, text: 'Good with our 5-year-old. Creative and patient.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'w5',
    name: 'Peter Abok',
    photo: 'https://i.pravatar.cc/200?img=12',
    rating: 4.6,
    reviewCount: 38,
    ratePerHour: 380,
    zone: 'Kileleshwa',
    experience: '3 years',
    specialties: ['Teenagers', 'Sports', 'Tutoring'],
    bio: 'Male childcare professional specialising in older children and teenagers. Sports coach background with tutoring experience.',
    availability: 'Mon–Fri, 2pm–9pm, Weekends flexible',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Luo'],
    age: 29,
    reviews: [
      { parent: 'Nancy O.', rating: 5, text: 'Peter is great with my teenage son. Firm but fun — exactly what we needed.', date: '1 week ago' },
      { parent: 'Brian M.', rating: 4, text: 'Reliable and professional. Would recommend.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'w6',
    name: 'Esther Wambui',
    photo: 'https://i.pravatar.cc/200?img=44',
    rating: 4.8,
    reviewCount: 72,
    ratePerHour: 420,
    zone: 'Kilimani',
    experience: '7 years',
    specialties: ['Twins', 'Cooking', 'Special Needs'],
    bio: 'Experienced watcher specialising in twins and children with additional needs. Home economics background — nutritious meals included.',
    availability: 'Mon–Sat, 7am–7pm',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Kikuyu'],
    age: 33,
    reviews: [
      { parent: 'Susan K.', rating: 5, text: 'Esther is a saint. Managing our twins with a smile every single day.', date: '2 days ago' },
      { parent: 'Michael N.', rating: 5, text: 'The meals she prepares for the kids are amazing. They actually eat vegetables now!', date: '1 week ago' },
    ],
  },
  {
    id: 'w7',
    name: 'Beatrice Achieng',
    photo: 'https://i.pravatar.cc/200?img=21',
    rating: 4.7,
    reviewCount: 44,
    ratePerHour: 320,
    zone: 'BuruBuru',
    experience: '5 years',
    specialties: ['Toddlers', 'Cooking', 'First Aid'],
    bio: 'Warm and dependable childcare provider based in BuruBuru. Loves cooking nutritious meals for children.',
    availability: 'Mon–Sat, 7am–7pm',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Luo'],
    age: 30,
    reviews: [
      { parent: 'Asha M.', rating: 5, text: 'Beatrice is patient and kind. My toddler loves her!', date: '3 days ago' },
      { parent: 'Kevin O.', rating: 4, text: 'Reliable and very communicative.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'w8',
    name: 'Christine Wanjiku',
    photo: 'https://i.pravatar.cc/200?img=35',
    rating: 4.8,
    reviewCount: 58,
    ratePerHour: 350,
    zone: 'Umoja',
    experience: '6 years',
    specialties: ['School-Age', 'Homework Help', 'Tutoring'],
    bio: 'Former primary school teacher turned childcare specialist. Excellent at structured after-school routines.',
    availability: 'Mon–Fri, 2pm–8pm, Weekends full day',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Kikuyu'],
    age: 34,
    reviews: [
      { parent: 'Alice N.', rating: 5, text: 'Christine helped my son improve his grades while looking after him. Gold!', date: '1 week ago' },
      { parent: 'Joseph K.', rating: 5, text: 'Punctual and professional every single time.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'w9',
    name: 'Dennis Kamau',
    photo: 'https://i.pravatar.cc/200?img=15',
    rating: 4.6,
    reviewCount: 29,
    ratePerHour: 300,
    zone: 'Kawangware',
    experience: '3 years',
    specialties: ['Infants', 'CPR Certified', 'Night Shifts'],
    bio: 'Young and energetic childcare professional. CPR and first aid certified. Available for night shift coverage.',
    availability: 'Mon–Sun, flexible hours',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English', 'Kikuyu'],
    age: 27,
    reviews: [
      { parent: 'Rita W.', rating: 5, text: 'Dennis was great with our newborn during night shifts. Highly recommend.', date: '4 days ago' },
      { parent: 'Tom A.', rating: 4, text: 'Good guy. Reliable and caring.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'w10',
    name: 'Mercy Nduta',
    photo: 'https://i.pravatar.cc/200?img=50',
    rating: 4.9,
    reviewCount: 76,
    ratePerHour: 380,
    zone: 'Kasarani',
    experience: '7 years',
    specialties: ['Twins', 'Special Needs', 'Arts & Crafts'],
    bio: 'Specialised in twins and children with additional learning needs. Background in occupational therapy support.',
    availability: 'Mon–Sat, 6am–8pm',
    vettingComplete: true,
    vettingSteps: BASE_VETTING,
    languages: ['Swahili', 'English'],
    age: 36,
    reviews: [
      { parent: 'Purity M.', rating: 5, text: 'Mercy is a miracle worker with our special needs child. We are so grateful.', date: '2 days ago' },
      { parent: 'Chris O.', rating: 5, text: 'Our twins adore Mercy. She is endlessly patient.', date: '1 week ago' },
    ],
  },
];

export const ZONES = ['All Zones', ...NAIROBI_ZONES] as string[];
export const SPECIALTIES = ['All', 'Infants', 'Toddlers', 'School-Age', 'Teenagers', 'Special Needs', 'Night Shifts', 'CPR Certified'];
