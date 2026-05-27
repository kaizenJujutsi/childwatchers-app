import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fetchMyBookings } from '../services/bookings';
import type { ApiBooking } from '../types/api';

const PLATFORM_FEE_RATE = 0.15;
const STANDARD_FEE = 35;
const EMERGENCY_QUOTA = 2;
const EMERGENCY_RATE = 0.05;
const EMERGENCY_MAX = 150;
const EMERGENCY_MIN = 50;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TX_ICONS: Record<string, IoniconName> = {
  payment:    'arrow-down-circle',
  withdrawal: 'arrow-up-circle',
  bonus:      'star',
  pending:    'time-outline',
};
const TX_COLORS: Record<string, string> = {
  payment: Colors.safe, withdrawal: Colors.sos, bonus: Colors.accent, pending: Colors.grey400,
};

interface TxItem {
  id: string;
  type: 'payment' | 'withdrawal' | 'pending';
  description: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending';
  mpesaRef: string | null;
}

function bookingToTx(b: ApiBooking): TxItem {
  if (b.status === 'complete') {
    return {
      id: b.id,
      type: 'payment',
      description: `Booking completed · ${b.hours}h`,
      date: b.date,
      amount: b.subtotal,
      status: 'completed',
      mpesaRef: b.mpesa_receipt,
    };
  }
  return {
    id: b.id,
    type: 'pending',
    description: `${b.status === 'active' ? 'Active' : 'Upcoming'} booking · ${b.hours}h`,
    date: b.date,
    amount: b.subtotal,
    status: 'pending',
    mpesaRef: null,
  };
}

function currentMonthPrefix(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function nextFriday(): string {
  const d = new Date();
  const day = d.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilFriday);
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
}

function calcEmergencyFee(amount: number): number {
  return Math.min(Math.max(Math.round(amount * EMERGENCY_RATE), EMERGENCY_MIN), EMERGENCY_MAX);
}

export const WagesWalletScreen: React.FC = () => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [emergencyUsed, setEmergencyUsed] = useState(0);

  const loadBookings = useCallback(async () => {
    const data = await fetchMyBookings();
    setBookings(data);
  }, []);

  useFocusEffect(useCallback(() => { void loadBookings(); }, [loadBookings]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const walletBalance = bookings
    .filter(b => b.status === 'complete')
    .reduce((sum, b) => sum + b.subtotal, 0);

  const escrowBalance = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'active')
    .reduce((sum, b) => sum + b.total_kes, 0);

  const totalEarnedMtd = bookings
    .filter(b => b.status === 'complete' && b.created_at.startsWith(currentMonthPrefix()))
    .reduce((sum, b) => sum + b.subtotal, 0);

  const myRate = bookings.find(b => b.status === 'complete')?.rate_per_hour ?? 0;
  const feeAmount = Math.round(myRate * PLATFORM_FEE_RATE * 100) / 100;
  const takeHome = Math.round((myRate - feeAmount) * 100) / 100;

  const remaining = EMERGENCY_QUOTA - emergencyUsed;
  const emergencyFee = calcEmergencyFee(walletBalance);
  const standardNet = walletBalance - STANDARD_FEE;
  const emergencyNet = walletBalance - emergencyFee;

  const transactions: TxItem[] = bookings
    .filter(b => b.status !== 'cancelled')
    .map(bookingToTx);

  const handleStandardWithdraw = () => {
    Alert.alert(
      'Standard Withdrawal',
      `KES ${standardNet.toLocaleString()} arrives tomorrow.\n\nFee: KES ${STANDARD_FEE}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Confirm — KES ${standardNet.toLocaleString()}`,
          onPress: () => Alert.alert('Withdrawal Requested', 'Your M-Pesa payment will arrive tomorrow morning.'),
        },
      ]
    );
  };

  const handleEmergencyWithdraw = () => {
    if (remaining <= 0) {
      Alert.alert('Quota Reached', 'Both emergency withdrawals used this week. Resets Monday.');
      return;
    }
    Alert.alert(
      'Emergency Withdrawal',
      `KES ${emergencyNet.toLocaleString()} sent immediately.\n\nFee: KES ${emergencyFee} · ${remaining - 1}/${EMERGENCY_QUOTA} remaining`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Send Now — KES ${emergencyNet.toLocaleString()}`,
          onPress: () => {
            setEmergencyUsed(u => u + 1);
            Alert.alert('Processing', 'Emergency withdrawal submitted. Check your M-Pesa within 5 minutes.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wages Wallet</Text>
        <Text style={styles.headerSub}>Powered by M-Pesa · Safaricom Daraja</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>KES {walletBalance.toLocaleString()}</Text>
          <View style={styles.withdrawRow}>
            <TouchableOpacity style={styles.withdrawStd} onPress={handleStandardWithdraw} activeOpacity={0.85}>
              <Ionicons name="calendar-outline" size={18} color={Colors.white} />
              <Text style={styles.withdrawTitle}>Tomorrow</Text>
              <Text style={styles.withdrawSub}>KES {standardNet.toLocaleString()} · Fee: KES {STANDARD_FEE}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.withdrawEmg, remaining <= 0 && { opacity: 0.5 }]}
              onPress={handleEmergencyWithdraw}
              activeOpacity={0.85}
            >
              <Ionicons name="flash-outline" size={18} color={Colors.white} />
              <Text style={styles.withdrawTitle}>Now</Text>
              <Text style={styles.withdrawSub}>KES {emergencyNet.toLocaleString()} · {remaining}/{EMERGENCY_QUOTA} left</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {([
              ['lock-closed-outline', escrowBalance.toLocaleString(), 'In Escrow'],
              ['calendar-outline', nextFriday(), 'Next Payout'],
              ['trending-up-outline', `KES ${totalEarnedMtd.toLocaleString()}`, 'Earned MTD'],
            ] as [IoniconName, string, string][]).map(([icon, val, lbl]) => (
              <View key={lbl} style={styles.stat}>
                <Ionicons name={icon} size={16} color={Colors.white} />
                <Text style={styles.statVal}>{val}</Text>
                <Text style={styles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>
        </View>

        <Card variant="surface" style={styles.rateCard}>
          {([
            ['Your Rate', myRate ? `KES ${myRate}/hr` : '—', false],
            ['Platform Fee', myRate ? `${PLATFORM_FEE_RATE * 100}% (KES ${feeAmount}/hr)` : '—', false],
            ['Your Take-Home', myRate ? `KES ${takeHome}/hr` : '—', true],
          ] as [string, string, boolean][]).map(([lbl, val, highlight]) => (
            <View key={lbl} style={styles.rateRow}>
              <Text style={styles.rateLabel}>{lbl}</Text>
              <Text style={[styles.rateVal, highlight && { color: Colors.safe, fontWeight: '800' }]}>{val}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <Text style={styles.rateNote}>All earnings held in M-Pesa escrow until shift completion. Payouts every Friday bi-weekly.</Text>
        </Card>

        <Card variant="surface" style={styles.txCard}>
          <Text style={styles.txTitle}>Transaction History</Text>
          {transactions.length === 0 ? (
            <Text style={styles.txEmpty}>No booking history yet.</Text>
          ) : (
            transactions.map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <View style={[styles.txIcon, { backgroundColor: TX_COLORS[tx.type] + '20' }]}>
                  <Ionicons name={TX_ICONS[tx.type] ?? 'cash-outline'} size={18} color={TX_COLORS[tx.type]} />
                </View>
                <View style={styles.txBody}>
                  <Text style={styles.txDesc}>{tx.description}</Text>
                  <View style={styles.txMeta}>
                    <Text style={styles.txDate}>{tx.date}</Text>
                    {tx.mpesaRef ? <Text style={styles.txRef}>Ref: {tx.mpesaRef}</Text> : null}
                    <Badge
                      label={tx.status === 'completed' ? 'Completed' : 'In Escrow'}
                      variant={tx.status === 'completed' ? 'success' : 'neutral'}
                      size="sm"
                    />
                  </View>
                </View>
                <Text style={[styles.txAmount, { color: tx.amount < 0 ? Colors.sos : tx.type === 'pending' ? Colors.grey400 : Colors.safe }]}>
                  {tx.amount < 0 ? '-' : '+'}KES {Math.abs(tx.amount).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.primary },
  header:        { backgroundColor: Colors.primary, padding: Spacing.screenH, paddingBottom: Spacing.md },
  headerTitle:   { fontSize: 22, fontWeight: '800', color: Colors.white },
  headerSub:     { fontSize: 13, color: Colors.white + 'AA', marginTop: 2 },
  scroll:        { flex: 1, backgroundColor: Colors.screenBg },
  content:       { padding: Spacing.screenH, paddingBottom: 30, gap: Spacing.md },
  balanceCard: {
    backgroundColor: Colors.primary, borderRadius: 18, padding: Spacing.lg,
    ...Shadows.glow,
  },
  balanceLabel:  { color: Colors.white + 'AA', fontSize: 13, fontWeight: '500' },
  balanceAmount: { fontSize: 42, fontWeight: '900', color: Colors.white, marginVertical: 6 },
  withdrawRow:   { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  withdrawStd:   { flex: 1, backgroundColor: Colors.mpesa, borderRadius: 12, paddingVertical: 12, alignItems: 'center', gap: 3 },
  withdrawEmg:   { flex: 1, backgroundColor: Colors.accent, borderRadius: 12, paddingVertical: 12, alignItems: 'center', gap: 3 },
  withdrawTitle: { color: Colors.white, fontSize: 14, fontWeight: '800' },
  withdrawSub:   { color: Colors.white + 'BB', fontSize: 10, textAlign: 'center' },
  statsRow:      { flexDirection: 'row', backgroundColor: Colors.white + '15', borderRadius: 12, padding: 12 },
  stat:          { flex: 1, alignItems: 'center', gap: 3 },
  statVal:       { fontSize: 12, fontWeight: '800', color: Colors.white },
  statLbl:       { fontSize: 10, color: Colors.white + 'AA' },
  rateCard:      { padding: Spacing.cardPad },
  rateRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rateLabel:     { fontSize: 14, color: Colors.grey600 },
  rateVal:       { fontSize: 14, fontWeight: '600', color: Colors.black },
  divider:       { height: 1, backgroundColor: Colors.grey100, marginVertical: 8 },
  rateNote:      { fontSize: 12, color: Colors.grey400, lineHeight: 17 },
  txCard:        { padding: Spacing.cardPad },
  txTitle:       { fontSize: 16, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  txEmpty:       { fontSize: 13, color: Colors.grey400, textAlign: 'center', paddingVertical: 20 },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.grey50,
  },
  txIcon:   { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txBody:   { flex: 1 },
  txDesc:   { fontSize: 13, fontWeight: '600', color: Colors.black },
  txMeta:   { flexDirection: 'row', gap: 6, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' },
  txDate:   { fontSize: 11, color: Colors.grey400 },
  txRef:    { fontSize: 11, color: Colors.grey400 },
  txAmount: { fontSize: 14, fontWeight: '800' },
});
