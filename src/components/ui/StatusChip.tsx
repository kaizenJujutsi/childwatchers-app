import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

type ZoneStatus = 'safe' | 'amber' | 'red' | 'resolved';

interface StatusChipProps {
  status: ZoneStatus;
  label?: string;
}

const CFG: Record<ZoneStatus, { dot: string; bg: string; text: string; label: string }> = {
  safe:     { dot: Colors.safe,    bg: Colors.safeLight2,   text: Colors.safe,    label: 'Zone Safe' },
  amber:    { dot: Colors.accent,  bg: Colors.warningLight, text: Colors.accent,  label: 'Zone Amber' },
  red:      { dot: Colors.sos,     bg: Colors.dangerLight,  text: Colors.sos,     label: 'Zone Red' },
  resolved: { dot: Colors.grey400, bg: Colors.grey100,      text: Colors.grey600, label: 'Resolved' },
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, label }) => {
  const cfg = CFG[status];
  return (
    <View style={[styles.chip, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.text, { color: cfg.text }]}>{label ?? cfg.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot:  { width: 7, height: 7, borderRadius: 3.5 },
  text: { fontSize: 12, fontWeight: '700' },
});
