import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { WatcherTabParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyBookings } from '../services/bookings';
import { fetchWatcherById } from '../services/watchers';
import type { ApiBooking } from '../types/api';
import type { Watcher } from '../data/mockWatchers';

type Props = { navigation: BottomTabNavigationProp<WatcherTabParamList, 'WatcherHome'> };

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const QUICK: { icon: IoniconName; label: string; screen?: keyof WatcherTabParamList }[] = [
  { icon: 'document-text-outline', label: 'My Vetting', screen: 'WatcherVetting' },
  { icon: 'wallet-outline',        label: 'Wallet',     screen: 'WagesWallet' },
  { icon: 'calendar-outline',      label: 'Schedule' },
  { icon: 'star-outline',          label: 'Reviews' },
];

function nextFriday(): string {
  const d = new Date();
  const day = d.getDay();
  const daysUntil = (5 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntil);
  return d.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' });
}

function currentWeekBounds(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

function formatShiftDate(date: string): string {
  const d = new Date(date + 'T00:00:00');
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatStartTime(startTime: string): string {
  const [h, m] = startTime.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return startTime;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export const WatcherHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [watcherProfile, setWatcherProfile] = useState<Watcher | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const data = await fetchMyBookings();
      setBookings(data);
      if (user?.id) {
        const profile = await fetchWatcherById(user.id);
        setWatcherProfile(profile);
      }
    } catch {
      // keep existing state
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { void loadData(); }, [loadData]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await loadData(); } finally { setRefreshing(false); }
  }, [loadData]);

  // Balance: sum of complete bookings
  const walletBalance = bookings
    .filter(b => b.status === 'complete')
    .reduce((sum, b) => sum + b.subtotal, 0);

  // Stats for "Today's Status" card
  const { start: weekStart, end: weekEnd } = currentWeekBounds();
  const weekBounds = {
    start: weekStart.toISOString().split('T')[0],
    end: weekEnd.toISOString().split('T')[0],
  };

  const completeThisWeek = bookings.filter(
    b => b.status === 'complete' && b.date >= weekBounds.start && b.date <= weekBounds.end,
  );
  const hoursWorkedThisWeek = completeThisWeek.reduce((sum, b) => sum + b.hours, 0);
  const shiftsThisWeek = completeThisWeek.length;

  // Upcoming shifts: confirmed or active, first 3
  const upcomingShifts = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'active')
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Avatar name={user?.full_name ?? ''} size="md" online />
            <View>
              <Text style={styles.greeting}>Hi, {user?.full_name?.split(' ')[0] ?? 'there'}</Text>
              <Text style={styles.sub}>{user?.zone ?? ''} · {watcherProfile?.reviewCount ?? 0} reviews</Text>
            </View>
          </View>
          {watcherProfile?.vettingComplete && <Badge label="DCI Verified" variant="success" />}
        </View>

        {/* Balance card */}
        <TouchableOpacity
          style={styles.balanceCard}
          onPress={() => navigation.navigate('WagesWallet')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.balanceLabel}>Available to Withdraw</Text>
            <Text style={styles.balanceAmount}>KES {walletBalance.toLocaleString()}</Text>
            <Text style={styles.nextPayout}>Next payout: {nextFriday()}</Text>
          </View>
          <View style={styles.chevronCircle}>
            <Ionicons name="chevron-forward" size={18} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Status</Text>
          <Card variant="elevated" style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: Colors.safe }]} />
              <Text style={styles.statusText}>Available for bookings</Text>
            </View>
            <View style={styles.statsRow}>
              {([
                [String(hoursWorkedThisWeek), 'Hours worked'],
                [String(shiftsThisWeek), 'Shifts this week'],
                ['—', 'Last rating'],
              ] as [string, string][]).map(([val, lbl]) => (
                <View key={lbl} style={styles.stat}>
                  <Text style={styles.statVal}>{val}</Text>
                  <Text style={styles.statLbl}>{lbl}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Upcoming shifts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
          {upcomingShifts.length === 0 ? (
            <Card variant="surface" style={styles.shiftCard}>
              <Text style={{ fontSize: 13, color: Colors.grey400 }}>No upcoming shifts.</Text>
            </Card>
          ) : (
            upcomingShifts.map(shift => (
              <Card key={shift.id} variant="surface" style={styles.shiftCard}>
                <View style={styles.shiftLeft}>
                  <Text style={styles.shiftDate}>{formatShiftDate(shift.date)}</Text>
                  <Text style={styles.shiftTime}>{formatStartTime(shift.start_time)} · {shift.hours}h</Text>
                </View>
                <View style={styles.shiftRight}>
                  <Text style={styles.shiftKes}>KES {shift.subtotal.toLocaleString()}</Text>
                  <Badge
                    label={shift.status === 'active' ? 'Active' : 'Escrow'}
                    variant={shift.status === 'active' ? 'success' : 'info'}
                    size="sm"
                  />
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {QUICK.map(item => (
              <Card
                key={item.label}
                variant="surface"
                style={styles.quickCard}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <Ionicons name={item.icon} size={28} color={Colors.primary} />
                <Text style={styles.quickLabel}>{item.label}</Text>
              </Card>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.primary },
  scroll:  { flex: 1, backgroundColor: Colors.screenBg },
  content: { paddingBottom: Spacing.lg },
  header: {
    backgroundColor: Colors.primary, padding: Spacing.screenH,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  profileRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting:      { fontSize: 18, fontWeight: '700', color: Colors.white },
  sub:           { fontSize: 12, color: Colors.white + 'AA', marginTop: 2 },
  balanceCard: {
    margin: Spacing.md, backgroundColor: Colors.primaryDark, borderRadius: 16,
    padding: Spacing.cardPad, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', ...Shadows.glow,
  },
  balanceLabel:  { color: Colors.white + 'AA', fontSize: 13 },
  balanceAmount: { fontSize: 30, fontWeight: '900', color: Colors.white, marginVertical: 4 },
  nextPayout:    { fontSize: 12, color: Colors.white + 'AA' },
  chevronCircle: {
    backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
  },
  section:      { paddingHorizontal: Spacing.screenH, marginTop: Spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.black, marginBottom: 10 },
  statusCard:   { padding: Spacing.cardPad },
  statusRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  statusDot:    { width: 10, height: 10, borderRadius: 5 },
  statusText:   { fontSize: 14, fontWeight: '600', color: Colors.black },
  statsRow:     { flexDirection: 'row' },
  stat:         { flex: 1, alignItems: 'center', gap: 3 },
  statVal:      { fontSize: 20, fontWeight: '800', color: Colors.primary },
  statLbl:      { fontSize: 11, color: Colors.grey400, textAlign: 'center' },
  shiftCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.cardPad, marginBottom: 8,
  },
  shiftLeft:   { gap: 3 },
  shiftDate:   { fontSize: 14, fontWeight: '700', color: Colors.black },
  shiftTime:   { fontSize: 13, color: Colors.grey600 },
  shiftParent: { fontSize: 12, color: Colors.grey400 },
  shiftRight:  { alignItems: 'flex-end', gap: 6 },
  shiftKes:    { fontSize: 16, fontWeight: '800', color: Colors.primary },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard:   { width: '47%', padding: Spacing.cardPad, alignItems: 'center', gap: 8 },
  quickLabel:  { fontSize: 13, fontWeight: '600', color: Colors.black },
});
