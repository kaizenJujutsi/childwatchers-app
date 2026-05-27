import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { WatcherTabParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { WALLET_BALANCE, NEXT_PAYOUT_DATE } from '../data/mockTransactions';
import { WATCHERS } from '../data/mockWatchers';

type Props = { navigation: BottomTabNavigationProp<WatcherTabParamList, 'WatcherHome'> };

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ME = WATCHERS[0];

const UPCOMING = [
  { id: '1', parent: 'Amina K.', date: 'Mon 19 May', time: '9:00 AM', hours: 4, kes: 1800 },
  { id: '2', parent: 'David M.', date: 'Wed 21 May', time: '10:00 AM', hours: 6, kes: 2700 },
];

const QUICK: { icon: IoniconName; label: string; screen?: keyof WatcherTabParamList }[] = [
  { icon: 'document-text-outline', label: 'My Vetting', screen: 'WatcherVetting' },
  { icon: 'wallet-outline',        label: 'Wallet',     screen: 'WagesWallet' },
  { icon: 'calendar-outline',      label: 'Schedule' },
  { icon: 'star-outline',          label: 'Reviews' },
];

export const WatcherHomeScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Avatar name={ME.name} imageUri={ME.photo} size="md" online />
          <View>
            <Text style={styles.greeting}>Hi, {ME.name.split(' ')[0]}</Text>
            <Text style={styles.sub}>{ME.zone} · {ME.reviewCount} reviews</Text>
          </View>
        </View>
        <Badge label="DCI Verified" variant="success" />
      </View>

      {/* Balance card */}
      <TouchableOpacity
        style={styles.balanceCard}
        onPress={() => navigation.navigate('WagesWallet')}
        activeOpacity={0.85}
      >
        <View>
          <Text style={styles.balanceLabel}>Available to Withdraw</Text>
          <Text style={styles.balanceAmount}>KES {WALLET_BALANCE.toLocaleString()}</Text>
          <Text style={styles.nextPayout}>Next payout: {NEXT_PAYOUT_DATE}</Text>
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
            {[['8', 'Hours worked'], ['2', 'Shifts this week'], ['5★', 'Last rating']].map(([val, lbl]) => (
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
        {UPCOMING.map(shift => (
          <Card key={shift.id} variant="surface" style={styles.shiftCard}>
            <View style={styles.shiftLeft}>
              <Text style={styles.shiftDate}>{shift.date}</Text>
              <Text style={styles.shiftTime}>{shift.time} · {shift.hours}h</Text>
              <Text style={styles.shiftParent}>Parent: {shift.parent}</Text>
            </View>
            <View style={styles.shiftRight}>
              <Text style={styles.shiftKes}>KES {shift.kes.toLocaleString()}</Text>
              <Badge label="Escrow" variant="info" size="sm" />
            </View>
          </Card>
        ))}
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
