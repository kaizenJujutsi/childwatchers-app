import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IoniconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const SIZE = {
  sm: { height: 36, fontSize: 13, iconSize: 16, paddingH: 14, radius: 10 },
  md: { height: 48, fontSize: 15, iconSize: 18, paddingH: 18, radius: 12 },
  lg: { height: 56, fontSize: 17, iconSize: 20, paddingH: 24, radius: 14 },
};

const VARIANT = {
  primary:   { bg: Colors.primary,  text: Colors.white,   icon: Colors.white,   border: Colors.primary,  shadow: Shadows.glow },
  secondary: { bg: 'transparent',   text: Colors.primary, icon: Colors.primary, border: Colors.primary,  shadow: undefined },
  ghost:     { bg: 'transparent',   text: Colors.primary, icon: Colors.primary, border: 'transparent',   shadow: undefined },
  danger:    { bg: Colors.sos,      text: Colors.white,   icon: Colors.white,   border: Colors.sos,      shadow: Shadows.sos },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const sz = SIZE[size];
  const vr = VARIANT[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        styles.base,
        {
          height: sz.height,
          borderRadius: sz.radius,
          paddingHorizontal: sz.paddingH,
          backgroundColor: vr.bg as string,
          borderColor: vr.border as string,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : 1,
        },
        vr.shadow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vr.icon} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={sz.iconSize} color={vr.icon} />
          )}
          <Text style={[styles.label, { fontSize: sz.fontSize, color: vr.text as string }]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={sz.iconSize} color={vr.icon} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    gap: 8,
  },
  label: { fontWeight: '700' },
});
