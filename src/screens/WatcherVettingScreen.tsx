import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VettingBadge } from '../components/VettingBadge';
import { VettingStep } from '../data/mockWatchers';
import { WatcherTabParamList, RootStackParamList } from '../navigation/types';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<WatcherTabParamList, 'WatcherVetting'>,
    StackNavigationProp<RootStackParamList>
  >;
};

const STEPS: VettingStep[] = [
  { id: '1', title: 'National ID Verification',  subtitle: 'Upload your Kenya National ID — verified via IPRS/eCitizen',        status: 'complete', badge: 'VERIFIED' },
  { id: '2', title: 'Liveness & Face Match',      subtitle: 'Short selfie video — compared against ID photo via AI',             status: 'complete', badge: 'PASSED' },
  { id: '3', title: 'DCI Criminal Record Check',  subtitle: '7–10 working days · Online via eCitizen',                           status: 'complete', badge: 'CLEAR' },
  { id: '4', title: 'CRB Financial Check',         subtitle: 'Credit Reference Bureau clearance letter',                         status: 'complete', badge: 'CLEAR' },
  { id: '5', title: 'Health Screening',            subtitle: 'Kenya Medical Association certified facility — valid 12 months',    status: 'complete', badge: 'CERTIFIED' },
  { id: '6', title: 'Childcare Training (NITA)',   subtitle: '4 modules: Child Dev, First Aid, Child Protection, Nutrition',     status: 'pending',  badge: '2/4 MODULES' },
  { id: '7', title: 'In-Person Interview',         subtitle: 'Nyumba Kumi office · Kilimani — by appointment',                   status: 'pending',  badge: 'SCHEDULED' },
];

const MODULES = [
  { name: 'Child Development', done: true,  duration: '3 hours online' },
  { name: 'First Aid & CPR',   done: true,  duration: '4 hours + practical' },
  { name: 'Child Protection',  done: false, duration: '2 hours online' },
  { name: 'Nutrition & Meals', done: false, duration: '2 hours online' },
];

export const WatcherVettingScreen: React.FC<Props> = ({ navigation }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const completed = STEPS.filter(s => s.status === 'complete').length;
  const progress = (completed / STEPS.length) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vetting Progress</Text>
        <Text style={styles.headerSub}>{completed} of {STEPS.length} steps complete</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Card variant="elevated" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          </View>
          <Text style={styles.progressNote}>
            {completed < STEPS.length
              ? 'Complete all 7 steps to become a verified ChildWatchers professional'
              : 'All steps complete — you are fully certified!'}
          </Text>
        </Card>

        <View style={styles.earningsPreview}>
          <Text style={styles.earningsTitle}>Once certified, you can earn:</Text>
          <View style={styles.earningsRow}>
            {[['KES 300–1,000', 'per hour'], ['Bi-weekly', 'M-Pesa payout'], ['Escrow', 'protected']].map(([val, lbl]) => (
              <View key={lbl} style={styles.earningsItem}>
                <Text style={styles.earningsValue}>{val}</Text>
                <Text style={styles.earningsLabel}>{lbl}</Text>
              </View>
            ))}
          </View>
        </View>

        <Card variant="elevated" style={styles.stepsCard}>
          <Text style={styles.sectionTitle}>Vetting Steps</Text>
          {STEPS.map((step, i) => (
            <View key={step.id}>
              <TouchableOpacity onPress={() => setExpanded(expanded === step.id ? null : step.id)} activeOpacity={0.85}>
                <VettingBadge step={step} index={i} />
              </TouchableOpacity>
              {step.id === '6' && expanded === '6' && (
                <View style={styles.moduleList}>
                  <Text style={styles.moduleTitle}>NITA Training Modules</Text>
                  {MODULES.map(m => (
                    <View key={m.name} style={styles.moduleItem}>
                      <View style={[styles.moduleDot, { backgroundColor: m.done ? Colors.safe : Colors.grey200 }]}>
                        <Ionicons name={m.done ? 'checkmark' : 'ellipse-outline'} size={12} color={Colors.white} />
                      </View>
                      <View style={styles.moduleInfo}>
                        <Text style={styles.moduleName}>{m.name}</Text>
                        <Text style={styles.moduleDuration}>{m.duration}</Text>
                      </View>
                      <Text style={[styles.moduleBadge, { color: m.done ? Colors.safe : Colors.grey400 }]}>
                        {m.done ? 'DONE' : 'TODO'}
                      </Text>
                    </View>
                  ))}
                  <Button
                    label="Watch Training Videos"
                    onPress={() => navigation.navigate('TrainingVideo', {
                      title: 'Childcare Training — Module 1: Safety Basics',
                      description: 'Covers child safety fundamentals, first aid basics, emergency response, and safe sleeping guidelines for infants. Required for NITA certification.',
                      videoUrl: 'https://api.marsheike.tech/training/module-1',
                      moduleId: '1',
                    })}
                    variant="secondary"
                    icon="play-circle-outline"
                    size="sm"
                    style={{ marginTop: Spacing.sm }}
                  />
                  <Button
                    label="Continue Training"
                    onPress={() => {}}
                    variant="primary"
                    fullWidth
                    style={{ marginTop: Spacing.sm }}
                    icon="arrow-forward-outline"
                    iconPosition="right"
                  />
                </View>
              )}
              {i < STEPS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <Card variant="surface" style={styles.disclaimer}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.grey600} />
          <Text style={styles.disclaimerText}>
            Your personal data is processed under the Kenya Data Protection Act 2019. DCI checks are run by government agencies — ChildWatchers only receives a pass/fail result.
          </Text>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.primary },
  header:         { backgroundColor: Colors.primary, padding: Spacing.screenH, paddingBottom: Spacing.md },
  headerTitle:    { fontSize: 22, fontWeight: '800', color: Colors.white },
  headerSub:      { fontSize: 13, color: Colors.white + 'AA', marginTop: 2 },
  scroll:         { flex: 1, backgroundColor: Colors.screenBg },
  content:        { padding: Spacing.screenH, paddingBottom: 30, gap: Spacing.md },
  progressCard:   { padding: Spacing.cardPad },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel:  { fontSize: 14, fontWeight: '600', color: Colors.black },
  progressPct:    { fontSize: 16, fontWeight: '800', color: Colors.primary },
  progressBar:    { height: 10, backgroundColor: Colors.grey100, borderRadius: 5, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: Colors.primary, borderRadius: 5 },
  progressNote:   { fontSize: 12, color: Colors.grey600, marginTop: 8, lineHeight: 17 },
  earningsPreview:{ backgroundColor: Colors.primary, borderRadius: 16, padding: Spacing.cardPad },
  earningsTitle:  { color: Colors.white + 'AA', fontSize: 13, marginBottom: 10 },
  earningsRow:    { flexDirection: 'row', alignItems: 'center' },
  earningsItem:   { flex: 1, alignItems: 'center', gap: 3 },
  earningsValue:  { fontSize: 16, fontWeight: '800', color: Colors.white },
  earningsLabel:  { fontSize: 11, color: Colors.white + 'AA' },
  stepsCard:      { padding: Spacing.cardPad },
  sectionTitle:   { fontSize: 16, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  divider:        { height: 1, backgroundColor: Colors.grey50, marginVertical: 2 },
  moduleList:     { backgroundColor: Colors.grey50, borderRadius: 12, padding: 12, marginTop: 4, marginBottom: 4 },
  moduleTitle:    { fontSize: 13, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  moduleItem:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  moduleDot:      { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  moduleInfo:     { flex: 1 },
  moduleName:     { fontSize: 13, fontWeight: '600', color: Colors.black },
  moduleDuration: { fontSize: 11, color: Colors.grey400, marginTop: 1 },
  moduleBadge:    { fontSize: 11, fontWeight: '700' },
  disclaimer:     { flexDirection: 'row', gap: 10, padding: 12 },
  disclaimerText: { flex: 1, fontSize: 12, color: Colors.grey600, lineHeight: 18 },
});
