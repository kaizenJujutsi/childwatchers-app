import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Login'> };

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loginUser, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter both email and password'); return; }
    try {
      setError(null);
      const { role } = await loginUser(email, password);
      navigation.replace(role === 'parent' ? 'ParentTabs' : 'WatcherTabs');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Ionicons name="shield-checkmark" size={36} color={Colors.white} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Securely access your ChildWatchers account</Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              icon="lock-closed-outline"
              secureTextEntry
              style={{ marginTop: Spacing.md }}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              label="Login"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={{ marginTop: Spacing.md }}
            />

            <TouchableOpacity style={styles.forgot} onPress={() => {}}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Register', { role: 'parent' })}>
              <Text style={styles.registerLink}>Register as Parent</Text>
            </TouchableOpacity>
            <Text style={styles.divider}> · </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register', { role: 'watcher' })}>
              <Text style={styles.registerLink}>Register as Watcher</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    height: 120, backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.screenH, paddingTop: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1, backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screenH, paddingTop: Spacing.xl, paddingBottom: Spacing.xl,
  },
  titleBlock: { marginBottom: Spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: Colors.black, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: Colors.grey600, marginTop: 6, lineHeight: 22 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: Spacing.lg,
    ...Shadows.md,
  },
  error: { color: Colors.sos, fontSize: 13, marginTop: Spacing.sm, textAlign: 'center' },
  forgot: { marginTop: Spacing.lg, alignItems: 'center' },
  forgotText: { color: Colors.grey400, fontSize: 14, fontWeight: '500' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  registerLink: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  divider: { color: Colors.grey400, fontSize: 13 },
});
