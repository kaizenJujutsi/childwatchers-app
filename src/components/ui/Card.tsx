import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

type CardVariant = 'surface' | 'elevated' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const VARIANT_STYLE: Record<CardVariant, ViewStyle> = {
  surface:  { backgroundColor: Colors.white,        borderWidth: 1, borderColor: Colors.borderDefault, ...Shadows.sm },
  elevated: { backgroundColor: Colors.white,        borderWidth: 0,                                    ...Shadows.md },
  glass:    { backgroundColor: Colors.surfaceGlass, borderWidth: 1, borderColor: Colors.borderDefault, ...Shadows.sm },
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  style,
  onPress,
}) => {
  const variantStyle = VARIANT_STYLE[variant];

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, variantStyle, style]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, variantStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16 },
});
