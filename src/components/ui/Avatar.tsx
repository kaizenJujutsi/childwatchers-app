import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  imageUri?: string;
  size?: AvatarSize;
  online?: boolean;
  rating?: number;
}

const DIM: Record<AvatarSize, number> = { sm: 36, md: 48, lg: 80 };
const DOT: Record<AvatarSize, number> = { sm: 10, md: 12, lg: 14 };
const FONT: Record<AvatarSize, number> = { sm: 13, md: 18, lg: 28 };

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUri,
  size = 'md',
  online,
  rating,
}) => {
  const dim = DIM[size];
  const dotSize = DOT[size];
  const fontSize = FONT[size];
  const radius = dim / 2;

  return (
    <View style={{ width: dim, height: dim }}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: dim, height: dim, borderRadius: radius, resizeMode: 'cover' }}
        />
      ) : (
        <View style={[styles.fallback, { width: dim, height: dim, borderRadius: radius }]}>
          <Text style={[styles.initials, { fontSize }]}>{initials(name)}</Text>
        </View>
      )}
      {online !== undefined && (
        <View style={[
          styles.dot,
          { width: dotSize, height: dotSize, borderRadius: dotSize / 2,
            backgroundColor: online ? Colors.safe : Colors.grey400 },
        ]} />
      )}
      {rating !== undefined && (
        <View style={styles.ratingChip}>
          <Ionicons name="star" size={9} color={Colors.accent} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: { color: Colors.white, fontWeight: '700' },
  dot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  ratingChip: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: { fontSize: 10, fontWeight: '700', color: Colors.black },
});
