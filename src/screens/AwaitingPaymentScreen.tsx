import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { fetchBookingById } from '../services/bookings';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AwaitingPayment'>;
  route: RouteProp<RootStackParamList, 'AwaitingPayment'>;
};

type ScreenState = 'waiting' | 'confirmed' | 'failed' | 'timeout';

const SUCCESS_STATUSES = new Set(['confirmed', 'active', 'complete']);
const POLL_MS = 4000;
const TIMEOUT_MS = 180000;

function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, '0')} remaining`;
}

export const AwaitingPaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId, totalKes, escrowRef, watcherName } = route.params;

  const [screenState, setScreenState] = useState<ScreenState>('waiting');
  const [failMessage, setFailMessage] = useState('Your M-Pesa payment was not completed.');
  const [msLeft, setMsLeft] = useState(TIMEOUT_MS);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());
  const doneRef = useRef(false);

  const stopAll = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    pulseAnim.stopAnimation();
  }, [pulseAnim]);

  const resolve = useCallback((state: ScreenState, msg?: string) => {
    if (doneRef.current) return;
    doneRef.current = true;
    stopAll();
    if (msg) setFailMessage(msg);
    setScreenState(state);
  }, [stopAll]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    tickRef.current = setInterval(() => {
      const left = TIMEOUT_MS - (Date.now() - startRef.current);
      if (left <= 0) { resolve('timeout'); return; }
      setMsLeft(left);
    }, 1000);

    pollRef.current = setInterval(async () => {
      try {
        const booking = await fetchBookingById(bookingId);
        if (SUCCESS_STATUSES.has(booking.status)) {
          resolve('confirmed');
        } else if (booking.status === 'cancelled') {
          resolve('failed');
        }
      } catch {
        // network error — keep polling
      }
    }, POLL_MS);

    return () => stopAll();
  }, [bookingId, pulseAnim, resolve, stopAll]);

  if (screenState === 'confirmed') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.screenBg} />
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.safeLight2 }]}>
            <Ionicons name="checkmark-circle" size={72} color={Colors.safe} />
          </View>
          <Text style={styles.heading}>Payment confirmed!</Text>
          <Text style={styles.sub}>
            KES {totalKes.toLocaleString()} held in escrow.{'\n'}Your watcher has been notified.
          </Text>
          <Text style={styles.ref}>Ref: {escrowRef}</Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.safe }]}
            onPress={() => navigation.navigate('ParentTabs')}
          >
            <Text style={styles.actionBtnText}>View My Bookings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screenState === 'failed') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.screenBg} />
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.dangerLight }]}>
            <Ionicons name="close-circle" size={72} color={Colors.sos} />
          </View>
          <Text style={styles.heading}>Payment failed</Text>
          <Text style={styles.sub}>{failMessage}</Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.sos }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.actionBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screenState === 'timeout') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.screenBg} />
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.warningLight }]}>
            <Ionicons name="time" size={72} color={Colors.accent} />
          </View>
          <Text style={styles.heading}>Request timed out</Text>
          <Text style={styles.sub}>
            The M-Pesa prompt expired.{'\n'}Your booking was not confirmed.
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.accent }]}
            onPress={() => navigation.navigate('ParentTabs')}
          >
            <Text style={styles.actionBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.screenBg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{watcherName}</Text>
        <Text style={styles.headerSub}>KES {totalKes.toLocaleString()} · {escrowRef}</Text>
      </View>
      <View style={styles.center}>
        <Animated.View style={[
          styles.iconCircle,
          { backgroundColor: Colors.mpesa + '22', transform: [{ scale: pulseAnim }] },
        ]}>
          <Ionicons name="phone-portrait-outline" size={64} color={Colors.mpesa} />
        </Animated.View>
        <Text style={styles.heading}>Waiting for payment…</Text>
        <Text style={styles.sub}>Open your M-Pesa app and enter your PIN</Text>
        <Text style={styles.countdown}>{formatCountdown(msLeft)}</Text>
      </View>
      <TouchableOpacity style={styles.cancelLink} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.screenBg },
  header: {
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey100,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  headerSub:   { fontSize: 13, color: Colors.grey600, marginTop: 2 },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.screenH },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  heading:     { fontSize: 22, fontWeight: '800', color: Colors.black, textAlign: 'center', marginBottom: 10 },
  sub:         { fontSize: 15, color: Colors.grey600, textAlign: 'center', lineHeight: 22, marginBottom: 12 },
  ref:         { fontSize: 12, color: Colors.grey400, marginBottom: 28 },
  countdown:   { fontSize: 16, fontWeight: '600', color: Colors.primary, marginTop: 8 },
  actionBtn:   { marginTop: 28, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40 },
  actionBtnText:{ fontSize: 16, fontWeight: '700', color: Colors.white },
  cancelLink:  { paddingBottom: Spacing.lg, alignItems: 'center' },
  cancelText:  { fontSize: 14, color: Colors.grey400 },
});
