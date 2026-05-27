import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: Colors.safeLight2,   text: Colors.safe },
  warning: { bg: Colors.warningLight, text: Colors.accent },
  danger:  { bg: Colors.dangerLight,  text: Colors.sos },
  info:    { bg: Colors.infoLight,    text: Colors.infoBlue },
  neutral: { bg: Colors.grey100,      text: Colors.grey600 },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
}) => {
  const { bg, text } = COLORS[variant];
  return (
    <View style={[styles.badge, size === 'sm' ? styles.sm : styles.md, { backgroundColor: bg }]}>
      <Text style={[styles.label, size === 'sm' ? styles.labelSm : styles.labelMd, { color: text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge:   { borderRadius: 20, alignSelf: 'flex-start' },
  sm:      { paddingHorizontal: 8,  paddingVertical: 2 },
  md:      { paddingHorizontal: 10, paddingVertical: 4 },
  label:   { fontWeight: '700', letterSpacing: 0.3 },
  labelSm: { fontSize: 10 },
  labelMd: { fontSize: 12 },
});
