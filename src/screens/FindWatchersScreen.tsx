import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParentTabParamList, RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Watcher, ZONES, SPECIALTIES } from '../data/mockWatchers';
import { WatcherCard } from '../components/WatcherCard';
import { fetchWatchers } from '../services/watchers';
import { useAuth } from '../contexts/AuthContext';
import { useLocationZone } from '../services/location';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<ParentTabParamList, 'FindWatchers'>,
    StackNavigationProp<RootStackParamList>
  >;
};

export const FindWatchersScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { deviceLocation } = useLocationZone();
  const [watchers, setWatchers] = useState<Watcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('All Zones');
  const [locationMode, setLocationMode] = useState<'nearby' | 'home' | 'all'>('nearby');
  const [specialty, setSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');

  useEffect(() => {
    fetchWatchers().then(setWatchers).finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (locationMode === 'nearby') {
      setZone(deviceLocation?.zone ?? user?.zone ?? 'All Zones');
    } else if (locationMode === 'home') {
      setZone(user?.zone ?? 'All Zones');
    } else {
      setZone('All Zones');
    }
  }, [locationMode, deviceLocation, user?.zone]);

  const filtered = useMemo(() => {
    let list = watchers.filter(w => {
      const matchQ = query === '' || w.name.toLowerCase().includes(query.toLowerCase());
      const matchZ = zone === 'All Zones' || w.zone === zone;
      const matchS = specialty === 'All' || w.specialties.includes(specialty);
      return matchQ && matchZ && matchS;
    });
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price_asc') return [...list].sort((a, b) => a.ratePerHour - b.ratePerHour);
    return [...list].sort((a, b) => b.ratePerHour - a.ratePerHour);
  }, [query, zone, specialty, sortBy, watchers]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Find a Watcher</Text>
        <Text style={styles.headerSub}>
          {loading ? 'Loading…' : `${filtered.length} vetted${locationMode === 'nearby' ? ' near you' : locationMode === 'home' ? ' in your home zone' : ''}`}
        </Text>
      </View>

      <View style={styles.modeRow}>
        {([
          ['nearby', 'location-outline', 'Near Me'],
          ['home',   'home-outline',     'Home Zone'],
          ['all',    'globe-outline',    'All'],
        ] as const).map(([mode, icon, label]) => (
          <TouchableOpacity
            key={mode}
            style={[styles.modeBtn, locationMode === mode && styles.modeBtnActive]}
            onPress={() => setLocationMode(mode)}
          >
            <Ionicons
              name={icon}
              size={14}
              color={locationMode === mode ? Colors.white : Colors.grey600}
            />
            <Text style={[styles.modeTxt, locationMode === mode && styles.modeTxtActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.grey400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name…"
          placeholderTextColor={Colors.grey400}
          value={query}
          onChangeText={setQuery}
        />
        {query !== '' && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.grey400} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {ZONES.map(z => (
          <TouchableOpacity
            key={z}
            style={[styles.chip, zone === z && styles.chipActive]}
            onPress={() => setZone(z)}
          >
            <Text style={[styles.chipText, zone === z && styles.chipTextActive]}>{z}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {SPECIALTIES.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, styles.chipSm, specialty === s && styles.chipActive]}
            onPress={() => setSpecialty(s)}
          >
            <Text style={[styles.chipText, specialty === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {([['rating', 'Top Rated'], ['price_asc', 'Price ↑'], ['price_desc', 'Price ↓']] as const).map(([k, lbl]) => (
          <TouchableOpacity
            key={k}
            style={[styles.sortBtn, sortBy === k && styles.sortBtnActive]}
            onPress={() => setSortBy(k)}
          >
            <Text style={[styles.sortText, sortBy === k && styles.sortTextActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding watchers near you…</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.grey200} />
              <Text style={styles.emptyText}>No watchers match your filters</Text>
            </View>
          ) : filtered.map(w => (
            <WatcherCard
              key={w.id}
              watcher={w}
              onPress={() => navigation.navigate('WatcherProfile', { watcher: w })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.primary },
  headerBar:   { backgroundColor: Colors.primary, paddingHorizontal: Spacing.screenH, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  headerSub:   { fontSize: 13, color: Colors.white + 'AA', marginTop: 2 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    margin: Spacing.md, borderRadius: 14, paddingHorizontal: Spacing.md,
    paddingVertical: 12, gap: 8, ...Shadows.md,
  },
  searchInput:   { flex: 1, fontSize: 15, color: Colors.black },
  filterScroll:  { backgroundColor: Colors.screenBg, maxHeight: 44 },
  filterRow:     { paddingHorizontal: Spacing.screenH, gap: 8, paddingVertical: 6 },
  chip: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderDefault,
  },
  chipSm:        { paddingHorizontal: 10, paddingVertical: 4 },
  chipActive:    { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:      { fontSize: 13, color: Colors.grey600, fontWeight: '500' },
  chipTextActive:{ color: Colors.white, fontWeight: '700' },
  sortRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenH,
    paddingVertical: 8, gap: 8, backgroundColor: Colors.screenBg,
  },
  sortLabel:     { fontSize: 13, color: Colors.grey400 },
  sortBtn: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderDefault,
  },
  sortBtnActive: { backgroundColor: Colors.primary + '15', borderColor: Colors.primary },
  sortText:      { fontSize: 12, color: Colors.grey600, fontWeight: '500' },
  sortTextActive:{ color: Colors.primary, fontWeight: '700' },
  list:          { flex: 1, backgroundColor: Colors.screenBg },
  listContent:   { padding: Spacing.md },
  loadingWrap:   { flex: 1, backgroundColor: Colors.screenBg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:   { fontSize: 14, color: Colors.grey600 },
  empty:         { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText:     { fontSize: 15, color: Colors.grey600 },
  modeRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: Spacing.screenH, paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  modeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)',
  },
  modeBtnActive: { backgroundColor: Colors.white },
  modeTxt: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  modeTxtActive: { color: Colors.primary },
});
