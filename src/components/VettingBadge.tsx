import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { VettingStep } from '../data/mockWatchers';

interface Props {
  step: VettingStep;
  index: number;
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const STATUS_CFG: Record<string, { bg: string; icon: IoniconName; badgeBg: string; badgeText: string }> = {
  complete: { bg: Colors.safe,    icon: 'checkmark-circle', badgeBg: Colors.safe,    badgeText: Colors.white },
  failed:   { bg: Colors.sos,     icon: 'close-circle',     badgeBg: Colors.sos,     badgeText: Colors.white },
  pending:  { bg: Colors.grey200, icon: 'time-outline',      badgeBg: Colors.grey200, badgeText: Colors.grey600 },
};

export const VettingBadge: React.FC<Props> = ({ step }) => {
  const cfg = STATUS_CFG[step.status] ?? STATUS_CFG.pending;

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={16} color={Colors.white} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.subtitle}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: cfg.badgeBg }]}>
        <Text style={[styles.badgeText, { color: cfg.badgeText }]}>{step.badge}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  iconCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  info:       { flex: 1 },
  title:      { fontSize: 14, fontWeight: '600', color: Colors.black },
  subtitle:   { fontSize: 12, color: Colors.grey600, marginTop: 1 },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
});
