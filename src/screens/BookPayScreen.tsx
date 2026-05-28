import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { apiPost } from '../services/api';
import { BookingResponse } from '../types/api';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'BookPay'>;
  route: RouteProp<RootStackParamList, 'BookPay'>;
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getUpcomingDates(): Date[] {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

function formatDateLabel(d: Date): string {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()}`;
}

function toIsoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function toApiTime(t: string): string {
  const [time, ampm] = t.split(' ');
  const [h, m] = time.split(':');
  let hour = parseInt(h, 10);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${m}:00`;
}

const START_TIMES = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM', '2:00 PM'];
const DURATIONS = [2, 3, 4, 5, 6, 8];
const MIN_RATE = 250;

export const BookPayScreen: React.FC<Props> = ({ navigation, route }) => {
  const { watcher } = route.params;
  const dates = useMemo(getUpcomingDates, []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [startTime, setStartTime] = useState('9:00 AM');
  const [hours, setHours] = useState(4);
  const [booking, setBooking] = useState(false);
  const [offeredRate, setOfferedRate] = useState(String(watcher.ratePerHour));
  const [rateError, setRateError] = useState('');

  const parsedRate = parseInt(offeredRate, 10) || 0;
  const effectiveRate = parsedRate > 0 ? parsedRate : watcher.ratePerHour;
  const subtotal = effectiveRate * hours;
  const platformFee = Math.round(subtotal * 0.15);
  const total = subtotal + platformFee;

  const handleRateChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setOfferedRate(cleaned);
    const num = parseInt(cleaned, 10) || 0;
    setRateError(num > 0 && num < MIN_RATE ? `Minimum rate is KES ${MIN_RATE}/hr` : '');
  };

  const handlePay = () => {
    if (parsedRate > 0 && parsedRate < MIN_RATE) {
      Alert.alert('Rate Too Low', `Minimum is KES ${MIN_RATE}/hr.`);
      return;
    }
    Alert.alert(
      'Confirm Booking',
      `Pay KES ${total.toLocaleString()} via M-Pesa?\n\nFunds held in escrow until shift completes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Pay KES ${total.toLocaleString()}`,
          onPress: async () => {
            setBooking(true);
            try {
              const result = await apiPost<BookingResponse>('/bookings', {
                watcher_id: watcher.id,
                date: toIsoDate(selectedDate),
                start_time: toApiTime(startTime),
                hours,
                offered_rate: effectiveRate,
              });
              navigation.navigate('AwaitingPayment', {
                bookingId: result.id,
                totalKes: result.total_kes,
                escrowRef: result.escrow_ref,
                watcherName: watcher.name,
              });
            } catch (e: any) {
              Alert.alert('Booking Failed', e?.message ?? 'Please try again.');
            } finally {
              setBooking(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book & Pay</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Card variant="elevated" style={styles.watcherRow}>
          <Avatar name={watcher.name} imageUri={watcher.photo} size="md" rating={watcher.rating} />
          <View>
            <Text style={styles.watcherName}>{watcher.name}</Text>
            <Text style={styles.watcherMeta}>{watcher.zone} · KES {watcher.ratePerHour}/hr</Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Your Offered Rate / hr</Text>
        <Card variant="surface" style={styles.rateCard}>
          <Text style={styles.ratePrefix}>KES</Text>
          <TextInput
            style={[styles.rateInput, rateError ? { color: Colors.sos } : null]}
            value={offeredRate}
            onChangeText={handleRateChange}
            keyboardType="numeric"
            maxLength={5}
            selectTextOnFocus
          />
          <Text style={styles.rateSuffix}>/hr</Text>
        </Card>
        {rateError ? (
          <Text style={styles.rateError}>{rateError}</Text>
        ) : (
          <Text style={styles.rateHint}>Listed: KES {watcher.ratePerHour}/hr · Min: KES {MIN_RATE}/hr</Text>
        )}

        <Text style={styles.sectionLabel}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {dates.map((d, i) => (
            <TouchableOpacity key={i} style={[styles.chip, selectedDate === d && styles.chipActive]} onPress={() => setSelectedDate(d)}>
              <Text style={[styles.chipText, selectedDate === d && styles.chipTextActive]}>{formatDateLabel(d)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Start Time</Text>
        <View style={styles.chipGrid}>
          {START_TIMES.map(t => (
            <TouchableOpacity key={t} style={[styles.chip, startTime === t && styles.chipActive]} onPress={() => setStartTime(t)}>
              <Text style={[styles.chipText, startTime === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Duration</Text>
        <View style={styles.chipGrid}>
          {DURATIONS.map(d => (
            <TouchableOpacity key={d} style={[styles.chip, hours === d && styles.chipActive]} onPress={() => setHours(d)}>
              <Text style={[styles.chipText, hours === d && styles.chipTextActive]}>{d}h</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card variant="elevated" style={styles.summary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{formatDateLabel(selectedDate)} from {startTime}</Text>
            <Text style={styles.summaryVal}>{hours} hours</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>KES {effectiveRate} × {hours} hrs</Text>
            <Text style={styles.summaryVal}>KES {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform fee (15%)</Text>
            <Text style={styles.summaryVal}>KES {platformFee.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>KES {total.toLocaleString()}</Text>
          </View>
          <View style={styles.escrowNote}>
            <Ionicons name="lock-closed-outline" size={16} color={Colors.primary} />
            <Text style={styles.escrowText}>Funds held in M-Pesa escrow — released to watcher when shift completes</Text>
          </View>
        </Card>

      </ScrollView>

      <View style={styles.ctaBar}>
        <TouchableOpacity
          style={[styles.mpesaBtn, booking && { opacity: 0.7 }]}
          onPress={handlePay}
          activeOpacity={0.85}
          disabled={booking}
        >
          {booking ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Ionicons name="phone-portrait-outline" size={28} color={Colors.white} />
          )}
          <View>
            <Text style={styles.mpesaBtnTitle}>{booking ? 'Processing…' : 'Pay via M-Pesa'}</Text>
            <Text style={styles.mpesaBtnSub}>KES {total.toLocaleString()} · STK Push</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.primary },
  header: {
    backgroundColor: Colors.primary, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: Spacing.screenH, paddingVertical: Spacing.md, gap: 8,
  },
  backBtn:      { padding: 4 },
  headerTitle:  { fontSize: 20, fontWeight: '700', color: Colors.white },
  scroll:       { flex: 1, backgroundColor: Colors.screenBg },
  content:      { padding: Spacing.screenH, paddingBottom: 120 },
  watcherRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.cardPad, marginBottom: Spacing.md },
  watcherName:  { fontSize: 16, fontWeight: '700', color: Colors.black },
  watcherMeta:  { fontSize: 13, color: Colors.grey600, marginTop: 2 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: Colors.black, marginBottom: 10, marginTop: Spacing.sm },
  rateCard:     { flexDirection: 'row', alignItems: 'center', padding: Spacing.cardPad, gap: 10 },
  ratePrefix:   { fontSize: 15, fontWeight: '700', color: Colors.grey600 },
  rateInput:    { flex: 1, fontSize: 22, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  rateSuffix:   { fontSize: 13, color: Colors.grey400 },
  rateError:    { fontSize: 12, color: Colors.sos, marginTop: 4 },
  rateHint:     { fontSize: 12, color: Colors.grey400, marginTop: 4 },
  chipRow:      { gap: 8, marginBottom: Spacing.md },
  chipGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderDefault,
  },
  chipActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:       { fontSize: 13, fontWeight: '600', color: Colors.grey600 },
  chipTextActive: { color: Colors.white },
  summary:        { padding: Spacing.cardPad, marginTop: Spacing.sm },
  summaryTitle:   { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  summaryRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel:   { fontSize: 14, color: Colors.grey600 },
  summaryVal:     { fontSize: 14, fontWeight: '600', color: Colors.black },
  totalLabel:     { fontSize: 16, fontWeight: '800', color: Colors.black },
  totalVal:       { fontSize: 18, fontWeight: '800', color: Colors.primary },
  divider:        { height: 1, backgroundColor: Colors.grey100, marginVertical: 8 },
  escrowNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12,
    backgroundColor: Colors.primary + '10', borderRadius: 10, padding: 10,
  },
  escrowText: { flex: 1, fontSize: 12, color: Colors.primary, lineHeight: 17 },
  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, padding: Spacing.screenH, paddingBottom: Spacing.lg,
    borderTopWidth: 1, borderTopColor: Colors.grey100, ...Shadows.lg,
  },
  mpesaBtn: {
    backgroundColor: Colors.mpesa, borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  mpesaBtnTitle: { fontSize: 17, fontWeight: '800', color: Colors.white },
  mpesaBtnSub:   { fontSize: 13, color: Colors.white + 'CC' },
});
