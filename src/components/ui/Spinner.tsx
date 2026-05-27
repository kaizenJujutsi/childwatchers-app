import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export interface SpinnerProps {
  /**
   * Color of the spinner. Defaults to primary color.
   */
  color?: string;
}

/**
 * A simple animated loading indicator component.
 * Uses native ActivityIndicator for performance and accessibility.
 */
export const Spinner: React.FC<SpinnerProps> = ({ color = Colors.primary }) => {
  return (
    <ActivityIndicator
      size="large"
      color={color}
      style={styles.center}
      testID="loading-spinner"
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});