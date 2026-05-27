import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface Props {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_SIZE: Record<string, number> = { sm: 12, md: 15, lg: 20 };
const TEXT_SIZE: Record<string, number> = { sm: 11, md: 13, lg: 16 };

export const StarRating: React.FC<Props> = ({ rating, reviewCount, size = 'md' }) => {
  const iconSize = ICON_SIZE[size];
  const textSize = TEXT_SIZE[size];

  return (
    <View style={styles.row}>
      <Ionicons name="star" size={iconSize} color={Colors.accent} />
      <Text style={[styles.rating, { fontSize: textSize }]}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: textSize - 2 }]}>({reviewCount})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { fontWeight: '700', color: Colors.black },
  count:  { color: Colors.grey400 },
});
