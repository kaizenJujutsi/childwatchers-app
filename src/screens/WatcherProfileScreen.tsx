import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { StarRating } from '../components/StarRating';
import { VettingBadge } from '../components/VettingBadge';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'WatcherProfile'>;
  route: RouteProp<RootStackParamList, 'WatcherProfile'>;
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const INFO_ICONS: Record<string, IoniconName> = {
  Availability: 'time-outline',
  Rate:         'cash-outline',
  Age:          'calendar-outline',
};

export const WatcherProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { watcher } = route.params;
  const [tab, setTab] = useState<'about' | 'vetting' | 'reviews'>('about');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.headerStrip}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Avatar name={watcher.name} imageUri={watcher.photo} size="lg" rating={watcher.rating} />
        <Text style={styles.name}>{watcher.name}</Text>
        <StarRating rating={watcher.rating} reviewCount={watcher.reviewCount} size="lg" />
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={Colors.white + 'CC'} />
          <Text style={styles.metaItem}>{watcher.zone}</Text>
          <Text style={styles.metaSep}>·</Text>
          <Ionicons name="time-outline" size={13} color={Colors.white + 'CC'} />
          <Text style={styles.metaItem}>{watcher.experience}</Text>
        </View>
        {watcher.vettingComplete && (
          <Badge label="7/7 DCI Vetting Steps Complete" variant="success" />
        )}
      </View>

      <View style={styles.tabs}>
        {(['about', 'vetting', 'reviews'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'about' ? 'About' : t === 'vetting' ? 'Vetting' : `Reviews (${watcher.reviewCount})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'about' && (
          <View style={styles.section}>
            <Text style={styles.bio}>{watcher.bio}</Text>
            <View style={styles.infoGrid}>
              {[
                ['Availability', watcher.availability],
                ['Rate', `KES ${watcher.ratePerHour}/hr`],
                ['Age', `${watcher.age} years`],
              ].map(([lbl, val]) => (
                <Card key={lbl} variant="surface" style={styles.infoCard}>
                  <Ionicons name={INFO_ICONS[lbl]} size={22} color={Colors.primary} />
                  <Text style={styles.infoLabel}>{lbl}</Text>
                  <Text style={styles.infoValue}>{val}</Text>
                </Card>
              ))}
            </View>
            <Text style={styles.subTitle}>Specialties</Text>
            <View style={styles.tagRow}>
              {watcher.specialties.map(s => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === 'vetting' && (
          <View style={styles.section}>
            <Text style={styles.subTitle}>Government Vetting Pipeline</Text>
            <Text style={styles.vettingNote}>All steps verified by DCI and Ministry of Interior</Text>
            {watcher.vettingSteps.map((step, i) => (
              <VettingBadge key={step.id} step={step} index={i} />
            ))}
            {watcher.vettingComplete && (
              <Card variant="surface" style={styles.certBox}>
                <Ionicons name="trophy-outline" size={36} color={Colors.safe} />
                <Text style={styles.certTitle}>Fully Certified Childcare Professional</Text>
                <Text style={styles.certSub}>Certified by ChildWatchers Kenya · Valid 2026</Text>
              </Card>
            )}
          </View>
        )}

        {tab === 'reviews' && (
          <View style={styles.section}>
            {watcher.reviews.map((r, i) => (
              <Card key={i} variant="surface" style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewParent}>{r.parent}</Text>
                  <StarRating rating={r.rating} size="sm" />
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.ctaBar}>
        <View>
          <Text style={styles.ctaPrice}>KES {watcher.ratePerHour}</Text>
          <Text style={styles.ctaPerHr}>/hr · M-Pesa escrow</Text>
        </View>
        <Button
          label="Book Now"
          onPress={() => navigation.navigate('BookPay', { watcher })}
          variant="primary"
          icon="calendar-outline"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.primary },
  headerStrip: {
    backgroundColor: Colors.primary, alignItems: 'center',
    paddingBottom: Spacing.lg, paddingTop: 8,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: Spacing.screenH, paddingVertical: 4, marginBottom: 10, gap: 4,
  },
  backText:  { color: Colors.white, fontSize: 16, fontWeight: '500' },
  name:      { fontSize: 22, fontWeight: '800', color: Colors.white, marginTop: 10 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 8, flexWrap: 'wrap', justifyContent: 'center',
  },
  metaItem: { color: Colors.white + 'CC', fontSize: 13 },
  metaSep:  { color: Colors.white + 'CC', fontSize: 13 },
  tabs: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.grey100,
  },
  tab:          { flex: 1, paddingVertical: 13, alignItems: 'center' },
  tabActive:    { borderBottomWidth: 2.5, borderBottomColor: Colors.primary },
  tabText:      { fontSize: 13, color: Colors.grey400, fontWeight: '500' },
  tabTextActive:{ color: Colors.primary, fontWeight: '700' },
  scroll:       { flex: 1 },
  scrollContent:{ paddingBottom: 100 },
  section:      { padding: Spacing.screenH },
  bio:          { fontSize: 15, color: Colors.grey800, lineHeight: 23, marginBottom: Spacing.md },
  subTitle:     { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 10, marginTop: 4 },
  vettingNote:  { fontSize: 12, color: Colors.grey400, marginBottom: 12 },
  infoGrid:     { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  infoCard:     { flex: 1, padding: 12, alignItems: 'center', gap: 4 },
  infoLabel:    { fontSize: 11, color: Colors.grey400, fontWeight: '600' },
  infoValue:    { fontSize: 13, color: Colors.black, fontWeight: '700', textAlign: 'center' },
  tagRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:          { backgroundColor: Colors.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText:      { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  certBox:      { padding: Spacing.md, alignItems: 'center', marginTop: 12, gap: 6 },
  certTitle:    { fontSize: 15, fontWeight: '700', color: Colors.safe, textAlign: 'center' },
  certSub:      { fontSize: 12, color: Colors.grey600, textAlign: 'center' },
  reviewCard:   { padding: Spacing.cardPad, marginBottom: 10 },
  reviewTop:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  reviewParent: { fontWeight: '700', color: Colors.black, fontSize: 14, flex: 1 },
  reviewDate:   { fontSize: 11, color: Colors.grey400 },
  reviewText:   { fontSize: 14, color: Colors.grey600, lineHeight: 20 },
  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.grey100,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.screenH, paddingBottom: Spacing.lg, ...Shadows.lg,
  },
  ctaPrice: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  ctaPerHr: { fontSize: 12, color: Colors.grey400 },
});
