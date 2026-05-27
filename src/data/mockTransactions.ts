export interface Transaction {
  id: string;
  type: 'payment' | 'withdrawal' | 'bonus' | 'pending';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  mpesaRef?: string;
  client?: string;
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'payment',
    description: 'Amina K. — 4 hrs childcare',
    amount: 1800,
    date: '16 May 2026',
    status: 'completed',
    mpesaRef: 'QJ9X4MP2RK',
    client: 'Amina Kariuki',
  },
  {
    id: 't2',
    type: 'payment',
    description: 'David M. — 6 hrs childcare',
    amount: 2700,
    date: '14 May 2026',
    status: 'completed',
    mpesaRef: 'QL3T8NW5YB',
    client: 'David Mwangi',
  },
  {
    id: 't3',
    type: 'withdrawal',
    description: 'M-Pesa withdrawal — bi-weekly payout',
    amount: -8450,
    date: '9 May 2026',
    status: 'completed',
    mpesaRef: 'QM7R2LP9AX',
  },
  {
    id: 't4',
    type: 'bonus',
    description: 'Punctuality bonus — April',
    amount: 500,
    date: '1 May 2026',
    status: 'completed',
  },
  {
    id: 't5',
    type: 'payment',
    description: 'Faith O. — 8 hrs childcare',
    amount: 3600,
    date: '30 Apr 2026',
    status: 'completed',
    mpesaRef: 'QK2V6MN3BT',
    client: 'Faith Omondi',
  },
  {
    id: 't6',
    type: 'pending',
    description: 'Robert K. — 5 hrs childcare (escrow)',
    amount: 2250,
    date: 'Today',
    status: 'pending',
  },
];

export const WALLET_BALANCE = 4500;
export const ESCROW_BALANCE = 2250;
export const NEXT_PAYOUT_DATE = 'Friday, 23 May 2026';
export const TOTAL_EARNED_MTD = 11100;
export const PLATFORM_FEE_RATE = 0.15;
