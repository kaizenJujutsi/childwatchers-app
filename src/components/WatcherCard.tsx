import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Shadows } from '../theme/shadows';
import { Spacing } from '../theme/spacing';
import { Watcher } from '../data/mockWatchers';
import { StarRating } from './StarRating';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';

interface Props {
  watcher: Watcher;
  onPress: () => void;
}

export const WatcherCard: React.FC<Props> = ({ watcher, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <Avatar name={watcher.name} imageUri={watcher.photo} size="md" rating={watcher.rating} />
    <View style={styles.info}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{watcher.name}</Text>
        <Badge label="DCI Vetted" variant="success" size="sm" />
      </View>
      <StarRating rating={watcher.rating} reviewCount={watcher.reviewCount} size="sm" />
      <Text style={styles.meta}>
        {watcher.zone}{watcher.experience ? ` · ${watcher.experience}` : ''}
      </Text>
      {(!watcher.experience || watcher.experience === '0 years') && (
        <Badge label="VERIFIED NEW" variant="warning" size="sm" />
      )}
      <View style={styles.tagRow}>
        {watcher.specialties.slice(0, 2).map(s => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={styles.rateBox}>
      <Text style={styles.rate}>KES {watcher.ratePerHour}</Text>
      <Text style={styles.rateLabel}>/hr</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: 16, padding: Spacing.cardPad, marginBottom: 12,
    alignItems: 'center', gap: 12,
    ...Shadows.md,
  },
  info:    { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name:    { fontSize: 15, fontWeight: '700', color: Colors.black },
  meta:    { fontSize: 12, color: Colors.grey600 },
  tagRow:  { flexDirection: 'row', gap: 6, marginTop: 2 },
  tag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  tagText:   { fontSize: 11, color: Colors.primary, fontWeight: '500' },
  rateBox:   { alignItems: 'flex-end' },
  rate:      { fontSize: 16, fontWeight: '800', color: Colors.primary },
  rateLabel: { fontSize: 11, color: Colors.grey400 },
});
