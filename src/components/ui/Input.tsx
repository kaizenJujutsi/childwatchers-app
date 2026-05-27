import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ViewStyle, KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: IoniconName;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  selectTextOnFocus?: boolean;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
  selectTextOnFocus = false,
  style,
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.borderError
    : focused
    ? Colors.borderFocus
    : Colors.borderDefault;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.row, { borderColor }]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? Colors.primary : Colors.grey400}
          />
        ) : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey400}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          selectTextOnFocus={selectTextOnFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.grey800 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.grey50,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: { flex: 1, fontSize: 16, color: Colors.black },
  error: { fontSize: 12, color: Colors.borderError, marginLeft: 2 },
});
