import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParentTabParamList, RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { StatusChip } from '../components/ui/StatusChip';
import { Button } from '../components/ui/Button';
import { ZONE_ALERTS } from '../data/mockAlerts';
import { WATCHERS } from '../data/mockWatchers';
import { useAuth } from '../contexts/AuthContext';
import { useLocationZone } from '../services/location';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<ParentTabParamList, 'Home'>,
    StackNavigationProp<RootStackParamList>
  >;
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ACTIVE = WATCHERS[0];

const ALERT_BORDER: Record<string, string> = {
  amber: Colors.accent, info: Colors.primary, resolved: Colors.safe,
};

const QUICK: { icon: IoniconName; label: string; danger?: boolean; screen?: keyof ParentTabParamList }[] = [
  { icon: 'search-outline',       label: 'Find Watcher', screen: 'FindWatchers' },
  { icon: 'alert-circle-outline', label: 'Red Alert',    screen: 'SOSCenter', danger: true },
  { icon: 'calendar-outline',     label: 'My Bookings' },
  { icon: 'chatbubble-outline',   label: 'Messages' },
];

export const ParentHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { deviceLocation, locationLoading } = useLocationZone();

  const firstName = user?.full_name?.split(' ')[0] ?? 'there';
  const homeZone = user?.zone ?? '';
  const homeCity = user?.city ?? 'Nairobi';

  // Display zone: GPS zone if available, else registered home zone
  const displayZone = deviceLocation?.zone ?? homeZone;
  const displayCity = deviceLocation?.city ?? homeCity;
  const usingGPS = !!deviceLocation;

  const activeAlert = ZONE_ALERTS.find(a => {
    if (a.type !== 'amber') return false;
    const az = a.zone.toLowerCase();
    const gpsMatch = deviceLocation ? az.includes(deviceLocation.zone.toLowerCase()) || deviceLocation.zone.toLowerCase().includes(az.split(' ')[0]) : false;
    const homeMatch = homeZone ? az.includes(homeZone.toLowerCase()) || homeZone.toLowerCase().includes(az.split(' ')[0]) : false;
    return gpsMatch || homeMatch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name={user?.full_name ?? 'User'} size="md" />
            <View>
              <Text style={styles.greeting}>Hello, {firstName}</Text>
              <View style={styles.subRow}>
                <Ionicons
                  name={usingGPS ? 'location-outline' : 'home-outline'}
                  size={12}
                  color={Colors.white + 'AA'}
                />
                <Text style={styles.sub}>{displayZone} · {displayCity}</Text>
              </View>
            </View>
          </View>
          <StatusChip status="safe" />
        </View>

        {/* Verification banner — shown until parent completes KYC */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ParentVerification')}
          style={styles.verifyBanner}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color={Colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.verifyTitle}>Complete Your Verification</Text>
            <Text style={styles.verifyBody}>Submit your ID and child's photo to unlock all features.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
        </TouchableOpacity>

        {/* Alert banner */}
        {activeAlert && (
          <Card
            variant="elevated"
            style={[styles.alertCard, { borderLeftColor: ALERT_BORDER[activeAlert.type] }]}
            onPress={() => navigation.navigate('SOSCenter')}
          >
            <Ionicons name="warning-outline" size={22} color={Colors.accent} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{activeAlert.zone} — Active Alert</Text>
              <Text style={styles.alertMsg} numberOfLines={2}>{activeAlert.message}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.grey400} />
          </Card>
        )}

        {/* Active booking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Booking</Text>
          <Card variant="elevated" style={styles.activeCard}>
            <View style={styles.activeTop}>
              <View style={styles.activeDot} />
              <Text style={styles.activeStatus}>Shift in progress</Text>
              <Text style={styles.activeTime}>3h 20m remaining</Text>
            </View>
            <View style={styles.activeBody}>
              <View style={styles.activeInfo}>
                <Text style={styles.activeName}>{ACTIVE.name}</Text>
                <Text style={styles.activeMeta}>KES {ACTIVE.ratePerHour}/hr · Escrow protected</Text>
              </View>
              <View style={styles.activeActions}>
                <Button label="Locate" onPress={() => {}} variant="ghost" size="sm" icon="location-outline" />
                <Button
                  label="SOS"
                  onPress={() => navigation.navigate('SOSCenter')}
                  variant="danger"
                  size="sm"
                  icon="warning-outline"
                />
              </View>
            </View>
          </Card>
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {QUICK.map(item => (
              <Card
                key={item.label}
                variant="surface"
                style={[styles.quickCard, item.danger && styles.quickDanger]}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <Ionicons name={item.icon} size={28} color={item.danger ? Colors.sos : Colors.primary} />
                <Text style={[styles.quickLabel, item.danger && { color: Colors.sos }]}>{item.label}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Zone feed */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Zone Feed</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SOSCenter')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {ZONE_ALERTS.filter(alert => {
            const az = alert.zone.toLowerCase();
            const gpsMatch = deviceLocation ? az.includes(deviceLocation.zone.toLowerCase()) || deviceLocation.zone.toLowerCase().includes(az.split(' ')[0]) : false;
            const homeMatch = homeZone ? az.includes(homeZone.toLowerCase()) || homeZone.toLowerCase().includes(az.split(' ')[0]) : false;
            return gpsMatch || homeMatch;
          }).slice(0, 3).map(alert => (
            <Card
              key={alert.id}
              variant="surface"
              style={[styles.feedItem, { borderLeftColor: ALERT_BORDER[alert.type] }]}
            >
              <View style={styles.feedMeta}>
                <Text style={styles.feedZone}>{alert.zone}</Text>
                <Text style={styles.feedTime}>{alert.time}</Text>
              </View>
              <Text style={styles.feedMsg} numberOfLines={2}>{alert.message}</Text>
            </Card>
          ))}
          {ZONE_ALERTS.filter(alert => {
            const az = alert.zone.toLowerCase();
            const gpsMatch = deviceLocation ? az.includes(deviceLocation.zone.toLowerCase()) || deviceLocation.zone.toLowerCase().includes(az.split(' ')[0]) : false;
            const homeMatch = homeZone ? az.includes(homeZone.toLowerCase()) || homeZone.toLowerCase().includes(az.split(' ')[0]) : false;
            return gpsMatch || homeMatch;
          }).length === 0 && (
            <Text style={styles.emptyFeed}>No alerts in your current area. All clear.</Text>
          )}
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
    backgroundColor: Colors.primary, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.screenH, paddingTop: Spacing.screenV,
  },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting:     { fontSize: 18, fontWeight: '700', color: Colors.white },
  sub:          { fontSize: 12, color: Colors.white + 'AA', marginTop: 2 },
  subRow:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  alertCard: {
    margin: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: Spacing.cardPad, borderLeftWidth: 4,
  },
  alertBody:  { flex: 1 },
  alertTitle: { fontSize: 13, fontWeight: '700', color: Colors.black },
  alertMsg:   { fontSize: 12, color: Colors.grey600, marginTop: 2 },
  section:      { paddingHorizontal: Spacing.screenH, marginTop: Spacing.sm },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.black, marginBottom: 10 },
  seeAll:       { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  activeCard:   { overflow: 'hidden' },
  activeTop: {
    backgroundColor: Colors.safe, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: Spacing.cardPad, paddingVertical: 8, gap: 8,
  },
  activeDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  activeStatus: { flex: 1, color: Colors.white, fontSize: 13, fontWeight: '600' },
  activeTime:   { color: Colors.white + 'CC', fontSize: 12 },
  activeBody: {
    padding: Spacing.cardPad, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  activeInfo:    { gap: 2 },
  activeName:    { fontSize: 16, fontWeight: '700', color: Colors.black },
  activeMeta:    { fontSize: 12, color: Colors.grey600 },
  activeActions: { flexDirection: 'row', gap: 6 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: '47%', padding: Spacing.cardPad, alignItems: 'center', gap: 8 },
  quickDanger: { borderColor: Colors.sos, borderWidth: 1.5 },
  quickLabel:  { fontSize: 13, fontWeight: '600', color: Colors.black },
  feedItem:  { borderLeftWidth: 3, padding: 12, marginBottom: 8 },
  feedMeta:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  feedZone:  { fontSize: 12, fontWeight: '600', color: Colors.black },
  feedTime:  { fontSize: 12, color: Colors.grey400 },
  feedMsg:   { fontSize: 13, color: Colors.grey600, lineHeight: 18 },
  verifyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warningLight, borderRadius: 12, padding: Spacing.md,
    marginHorizontal: Spacing.screenH, marginTop: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.accent + '40',
  },
  verifyTitle: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  verifyBody:  { fontSize: 12, color: Colors.accent + 'CC', marginTop: 2 },
  emptyFeed:   { fontSize: 13, color: Colors.grey400, textAlign: 'center', paddingVertical: Spacing.md, fontStyle: 'italic' },
});
