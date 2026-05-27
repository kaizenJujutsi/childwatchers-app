import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Button } from '../components/ui/Button';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Splash'> };

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const PILLARS: { icon: IoniconName; text: string }[] = [
  { icon: 'search-outline',  text: 'DCI-Vetted Marketplace' },
  { icon: 'warning-outline', text: 'Zone Red-Alert SOS' },
  { icon: 'cash-outline',    text: 'M-Pesa Escrow Wages' },
];

export const SplashScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

    <View style={styles.hero}>
      <View style={styles.logoCircle}>
        <Ionicons name="shield-checkmark" size={52} color={Colors.white} />
      </View>
      <Text style={styles.appName}>ChildWatchers</Text>
      <Text style={styles.slogan}>This isn't babysitting, it is child safety.</Text>
      <Text style={styles.tagline}>Vetted care. Verified safety.{'\n'}Built for Kenya.</Text>

      <View style={styles.pillars}>
        {PILLARS.map(p => (
          <View key={p.text} style={styles.pillarRow}>
            <Ionicons name={p.icon} size={18} color={Colors.white} />
            <Text style={styles.pillarText}>{p.text}</Text>
          </View>
        ))}
      </View>
    </View>

    <View style={styles.actions}>
      <Button
        label="Login"
        onPress={() => navigation.navigate('Login')}
        variant="primary"
        fullWidth
        icon="log-in-outline"
        style={{ backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark }}
      />
      <Button
        label="Register as Parent"
        onPress={() => navigation.navigate('Register', { role: 'parent' })}
        variant="primary"
        fullWidth
        icon="people-outline"
      />
      <Button
        label="Register as Watcher"
        onPress={() => navigation.navigate('Register', { role: 'watcher' })}
        variant="secondary"
        fullWidth
        icon="person-add-outline"
      />
    </View>

    <Text style={styles.footer}>Kilimani Pilot · Nairobi 2026</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  hero: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  appName: { fontSize: 40, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  slogan: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
  },
  tagline: { fontSize: 17, color: Colors.white + 'CC', textAlign: 'center', lineHeight: 26 },
  pillars: { gap: Spacing.sm, marginTop: Spacing.sm, alignSelf: 'stretch' },
  pillarRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: Spacing.md,
  },
  pillarText: { color: Colors.white, fontSize: 15, fontWeight: '500' },
  actions: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: Spacing.lg, gap: Spacing.sm,
  },
  footer: {
    color: Colors.white + '80', textAlign: 'center',
    fontSize: 12, paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
});
