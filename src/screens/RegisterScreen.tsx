import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { CITIES, CITY_NAMES, City } from '../data/cities';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
  route: RouteProp<RootStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const { registerUser, isLoading } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', zone: '', city: 'Nairobi' as City });
  const zonesForCity: readonly string[] = form.city ? CITIES[form.city as City] : [];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName) e.fullName = 'Required';
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (!form.phone || !/^07\d{8}$/.test(form.phone)) e.phone = 'Format: 07XXXXXXXX';
    if (!form.city) e.city = 'Select a city';
    if (!form.zone) e.zone = 'Select a zone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      const result = await registerUser(form.email, form.password, form.fullName, form.phone, role, form.zone, form.city);
      navigation.replace(result.role === 'parent' ? 'ParentTabs' : 'WatcherTabs');
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Badge label={role.toUpperCase()} variant={role === 'parent' ? 'info' : 'success'} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Input label="Full Name" value={form.fullName} onChangeText={v => update('fullName', v)}
            placeholder="John Doe" icon="person-outline" error={errors.fullName} />

          <Input label="Email Address" value={form.email} onChangeText={v => update('email', v)}
            placeholder="john@example.com" icon="mail-outline" keyboardType="email-address"
            autoCapitalize="none" error={errors.email} style={styles.field} />

          <Input label="Password" value={form.password} onChangeText={v => update('password', v)}
            placeholder="Min. 6 characters" icon="lock-closed-outline" secureTextEntry
            error={errors.password} style={styles.field} />

          <Input label="Phone Number (M-PESA)" value={form.phone} onChangeText={v => update('phone', v)}
            placeholder="07XXXXXXXX" icon="phone-portrait-outline" keyboardType="phone-pad"
            maxLength={10} error={errors.phone} style={styles.field} />

          <View style={styles.field}>
            <Text style={styles.zoneLabel}>Your City</Text>
            <View style={styles.chipsWrap}>
              {CITY_NAMES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, form.city === c && styles.chipActive]}
                  onPress={() => { update('city', c); update('zone', ''); }}
                >
                  <Text style={[styles.chipText, form.city === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.city ? <Text style={styles.errText}>{errors.city}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.zoneLabel}>Your Zone</Text>
            <View style={styles.chipsWrap}>
              {zonesForCity.length === 0
                ? <Text style={styles.zoneHint}>Select a city first</Text>
                : zonesForCity.map(z => (
                  <TouchableOpacity
                    key={z}
                    style={[styles.chip, form.zone === z && styles.chipActive]}
                    onPress={() => update('zone', z)}
                  >
                    <Text style={[styles.chipText, form.zone === z && styles.chipTextActive]}>{z}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
            {errors.zone ? <Text style={styles.errText}>{errors.zone}</Text> : null}
          </View>

          {errors.general ? <Text style={styles.generalErr}>{errors.general}</Text> : null}

          <Button
            label="Register Now"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={styles.cta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.grey100, gap: Spacing.sm,
  },
  backBtn: { padding: 4, marginRight: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: Colors.black },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.screenH, paddingVertical: Spacing.lg, gap: 0 },
  field: { marginTop: Spacing.md },
  zoneLabel: { fontSize: 14, fontWeight: '600', color: Colors.grey800, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    backgroundColor: Colors.grey100, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.borderDefault,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: Colors.grey600 },
  chipTextActive: { color: Colors.white },
  errText: { fontSize: 12, color: Colors.borderError, marginTop: 4 },
  zoneHint: { fontSize: 13, color: Colors.grey400, fontStyle: 'italic', paddingVertical: 4 },
  generalErr: { color: Colors.sos, textAlign: 'center', fontWeight: '600', marginTop: Spacing.sm },
  cta: { marginTop: Spacing.xl },
});
