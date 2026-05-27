import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Alert, RefreshControl, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { triggerSOS, fetchZoneAlerts, postZoneAlert } from '../services/sos';
import type { ApiZoneAlert } from '../types/api';

type AlertTypeKey = 'red' | 'amber' | 'info' | 'resolved';
type BadgeVariant = 'danger' | 'warning' | 'info' | 'success';

const ALERT_COLORS: Record<AlertTypeKey, string> = {
  red: Colors.sos, amber: Colors.accent, info: Colors.primary, resolved: Colors.safe,
};
const ALERT_BADGE: Record<AlertTypeKey, BadgeVariant> = {
  red: 'danger', amber: 'warning', info: 'info', resolved: 'success',
};
const ALERT_LABELS: Record<AlertTypeKey, string> = {
  red: 'SOS', amber: 'ALERT', info: 'INFO', resolved: 'RESOLVED',
};

const POST_TYPES: Array<{ value: 'amber' | 'info' | 'resolved'; label: string }> = [
  { value: 'amber', label: 'Amber Alert' },
  { value: 'info',  label: 'Community Info' },
  { value: 'resolved', label: 'Resolved' },
];

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const SOSCenterScreen: React.FC = () => {
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [alerts, setAlerts] = useState<ApiZoneAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [postVisible, setPostVisible] = useState(false);
  const [postType, setPostType] = useState<'amber' | 'info' | 'resolved'>('amber');
  const [postMessage, setPostMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const sosScale = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const loadAlerts = useCallback(async () => {
    const data = await fetchZoneAlerts();
    setAlerts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAlerts();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        animRef.current?.stop();
        animRef.current = null;
        sosScale.setValue(1);
        setSosActive(false);
      };
    }, [loadAlerts, sosScale])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const fireSOS = async () => {
    try {
      await triggerSOS();
      void loadAlerts();
      Alert.alert(
        'Red-Alert Dispatched',
        'SOS logged and zone alert posted.\nDCI Kilimani Post notified.\n\nStay calm. Help is coming.',
        [{ text: 'OK' }]
      );
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? '';
      if (msg.includes('Wait 5 minutes') || msg.includes('wait 5 minutes')) {
        Alert.alert(
          'Already Active',
          'An SOS was sent from your account in the last 5 minutes. Help has already been dispatched.'
        );
      } else {
        Alert.alert('Error', 'Could not send SOS. Please try again or call 999.');
      }
    }
  };

  const startSOS = () => {
    if (sosActive) return;
    setSosActive(true);
    setCountdown(5);
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(sosScale, { toValue: 1.08, duration: 400, useNativeDriver: true }),
        Animated.timing(sosScale, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    );
    animRef.current.start();
    let c = 5;
    intervalRef.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSosActive(false);
        animRef.current?.stop();
        animRef.current = null;
        sosScale.setValue(1);
        void fireSOS();
      }
    }, 1000);
  };

  const cancelSOS = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSosActive(false);
    setCountdown(5);
    animRef.current?.stop();
    animRef.current = null;
    sosScale.setValue(1);
  };

  const submitAlert = async () => {
    if (postMessage.trim().length < 10) {
      Alert.alert('Too short', 'Message must be at least 10 characters.');
      return;
    }
    if (postMessage.trim().length > 500) {
      Alert.alert('Too long', 'Message must be 500 characters or fewer.');
      return;
    }
    setPosting(true);
    try {
      const newAlert = await postZoneAlert(postType, postMessage.trim());
      setAlerts(prev => [newAlert, ...prev]);
      setPostMessage('');
      setPostVisible(false);
    } catch (e: unknown) {
      Alert.alert('Error', (e as { message?: string })?.message ?? 'Could not post alert.');
    } finally {
      setPosting(false);
    }
  };

  const zoneName = user?.zone ?? 'Your Zone';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.sosDark} />

      <View style={styles.header}>
        <Ionicons name="warning" size={28} color={Colors.white} />
        <View>
          <Text style={styles.headerTitle}>SOS Center</Text>
          <Text style={styles.headerSub}>{zoneName} · Cell-Broadcast Ready</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <View style={styles.sosSection}>
          <Text style={styles.sosLabel}>Emergency Red-Alert</Text>
          <Text style={styles.sosDesc}>
            Broadcasts to ALL phones in your zone — no airtime required.{'\n'}
            Simultaneously alerts DCI + Nyumba Kumi. Response in &lt;8 seconds.
          </Text>

          <Animated.View style={{ transform: [{ scale: sosScale }] }}>
            <TouchableOpacity
              style={[styles.sosBtn, sosActive && styles.sosBtnActive]}
              onPress={startSOS}
              activeOpacity={0.85}
            >
              <Ionicons name="warning" size={48} color={Colors.white} />
              <Text style={styles.sosBtnText}>
                {sosActive ? `Sending in ${countdown}s…` : 'TAP TO SEND RED-ALERT'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {sosActive && (
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}

          <View style={styles.sosStats}>
            {([['<8s', 'Alert Latency'], ['100%', 'Coverage'], ['0', 'Airtime Needed']] as [string, string][]).map(([val, lbl]) => (
              <View key={lbl} style={styles.statItem}>
                <Text style={styles.statVal}>{val}</Text>
                <Text style={styles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Zone Feed</Text>
            <TouchableOpacity onPress={() => setPostVisible(v => !v)} style={styles.postBtn}>
              <Ionicons name={postVisible ? 'close' : 'add-circle-outline'} size={20} color={Colors.primary} />
              <Text style={styles.postBtnText}>{postVisible ? 'Cancel' : 'Post Alert'}</Text>
            </TouchableOpacity>
          </View>

          {postVisible && (
            <Card variant="surface" style={styles.postForm}>
              <Text style={styles.postFormLabel}>Type</Text>
              <View style={styles.typeRow}>
                {POST_TYPES.map(pt => (
                  <TouchableOpacity
                    key={pt.value}
                    style={[styles.typeChip, postType === pt.value && styles.typeChipActive]}
                    onPress={() => setPostType(pt.value)}
                  >
                    <Text style={[styles.typeChipText, postType === pt.value && styles.typeChipTextActive]}>
                      {pt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.postFormLabel}>Message</Text>
              <TextInput
                style={styles.messageInput}
                value={postMessage}
                onChangeText={setPostMessage}
                placeholder="Describe the situation (10–500 chars)…"
                placeholderTextColor={Colors.grey400}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.submitBtn, posting && styles.submitBtnDisabled]}
                onPress={submitAlert}
                disabled={posting}
              >
                <Text style={styles.submitBtnText}>{posting ? 'Posting…' : 'Post to Zone'}</Text>
              </TouchableOpacity>
            </Card>
          )}

          {alerts.length === 0 && (
            <Text style={styles.emptyText}>No active alerts in {zoneName}.</Text>
          )}

          {alerts.map(alert => (
            <Card key={alert.id} variant="surface" style={[styles.alertCard, { borderLeftColor: ALERT_COLORS[alert.type as AlertTypeKey] ?? Colors.grey400 }]}>
              <View style={styles.alertTop}>
                <Badge label={ALERT_LABELS[alert.type as AlertTypeKey] ?? alert.type.toUpperCase()} variant={ALERT_BADGE[alert.type as AlertTypeKey] ?? 'info'} size="sm" />
                <Text style={styles.alertTime}>{timeAgo(alert.created_at)}</Text>
              </View>
              <Text style={styles.alertZone}>{alert.zone}</Text>
              <Text style={styles.alertMsg}>{alert.message}</Text>
              <Text style={styles.alertReporter}>Reported by: {alert.reported_by}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.sosDark },
  header: {
    backgroundColor: Colors.sosDark, padding: Spacing.screenH, paddingBottom: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  headerTitle:  { fontSize: 22, fontWeight: '800', color: Colors.white },
  headerSub:    { fontSize: 13, color: Colors.white + 'AA', marginTop: 2 },
  scroll:       { flex: 1, backgroundColor: Colors.screenBg },
  content:      { paddingBottom: 30 },
  sosSection: {
    backgroundColor: Colors.sosDark, padding: Spacing.screenH,
    paddingBottom: 28, alignItems: 'center',
  },
  sosLabel:     { fontSize: 16, fontWeight: '700', color: Colors.white, marginBottom: 6, alignSelf: 'flex-start' },
  sosDesc:      { fontSize: 13, color: Colors.white + 'BB', lineHeight: 19, marginBottom: 20, alignSelf: 'flex-start' },
  sosBtn: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.sos, borderWidth: 6, borderColor: Colors.white + '40',
    justifyContent: 'center', alignItems: 'center', gap: 8,
    ...Shadows.sos,
  },
  sosBtnActive: { backgroundColor: '#FF4444', borderColor: Colors.white },
  sosBtnText:   { color: Colors.white, fontSize: 13, fontWeight: '800', textAlign: 'center', paddingHorizontal: 20 },
  cancelBtn:    { marginTop: 14, backgroundColor: Colors.white + '20', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8 },
  cancelText:   { color: Colors.white, fontSize: 14, fontWeight: '700' },
  sosStats:     { flexDirection: 'row', gap: 28, marginTop: 20 },
  statItem:     { alignItems: 'center' },
  statVal:      { fontSize: 22, fontWeight: '900', color: Colors.white },
  statLbl:      { fontSize: 11, color: Colors.white + 'AA', marginTop: 2 },
  section:      { padding: Spacing.screenH, paddingTop: 20 },
  sectionHeader:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.black },
  postBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postBtnText:  { fontSize: 13, fontWeight: '600', color: Colors.primary },
  postForm:     { padding: Spacing.cardPad, marginBottom: 12 },
  postFormLabel:{ fontSize: 12, fontWeight: '600', color: Colors.grey600, marginBottom: 6, marginTop: 10 },
  typeRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.grey200, backgroundColor: Colors.white,
  },
  typeChipActive:   { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipText:     { fontSize: 12, fontWeight: '600', color: Colors.grey600 },
  typeChipTextActive:{ color: Colors.white },
  messageInput: {
    borderWidth: 1, borderColor: Colors.grey200, borderRadius: 8,
    padding: Spacing.sm, fontSize: 13, color: Colors.black,
    minHeight: 72, textAlignVertical: 'top', marginTop: 4,
  },
  submitBtn:    { marginTop: 12, backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText:{ fontSize: 14, fontWeight: '700', color: Colors.white },
  emptyText:    { fontSize: 13, color: Colors.grey400, textAlign: 'center', paddingVertical: 20 },
  alertCard:    { borderLeftWidth: 4, padding: Spacing.cardPad, marginBottom: 10 },
  alertTop:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, justifyContent: 'space-between' },
  alertTime:    { fontSize: 12, color: Colors.grey400 },
  alertZone:    { fontSize: 14, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  alertMsg:     { fontSize: 13, color: Colors.grey600, lineHeight: 19, marginBottom: 6 },
  alertReporter:{ fontSize: 11, color: Colors.grey400 },
});
