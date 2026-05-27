import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  Linking, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TrainingVideo'>;
  route: RouteProp<RootStackParamList, 'TrainingVideo'>;
};

export const TrainingVideoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { title, description, videoUrl, moduleId } = route.params;
  const [watched, setWatched] = useState(false);

  const openVideo = async () => {
    const supported = await Linking.canOpenURL(videoUrl);
    if (supported) {
      await Linking.openURL(videoUrl);
      setWatched(true);
    } else {
      Alert.alert('Cannot open video', 'The video link is not yet available. Please check back later.');
    }
  };

  const markComplete = () => {
    Alert.alert(
      'Mark as Complete',
      'Confirm you have watched this training module in full.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Module Complete', `${title} has been marked as complete.`, [
              { text: 'Done', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Training Module</Text>
        <Badge label={`MOD ${moduleId}`} variant="info" size="sm" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="play-circle-outline" size={72} color={Colors.white} />
          <Text style={styles.videoPlaceholderText}>Tap below to watch</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {watched && (
            <Card variant="surface" style={styles.watchedCard}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.safe} />
              <Text style={styles.watchedText}>Video opened — confirm completion below when done.</Text>
            </Card>
          )}

          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={Colors.grey600} />
              <Text style={styles.infoText}>Approx. 15–20 minutes</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="language-outline" size={18} color={Colors.grey600} />
              <Text style={styles.infoText}>Available in English and Swahili</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="trophy-outline" size={18} color={Colors.grey600} />
              <Text style={styles.infoText}>Required for DCI vetting approval</Text>
            </View>
          </Card>

          <Button
            label="Watch Training Video"
            onPress={openVideo}
            variant="primary"
            fullWidth
            icon="play-circle-outline"
            style={styles.watchBtn}
          />

          {watched && (
            <Button
              label="Mark Module as Complete"
              onPress={markComplete}
              variant="secondary"
              fullWidth
              icon="checkmark-circle-outline"
              style={styles.completeBtn}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.grey100, gap: Spacing.sm,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: Colors.black },
  scroll: { paddingBottom: Spacing.xl },
  videoPlaceholder: {
    height: 220, backgroundColor: Colors.primaryDark,
    justifyContent: 'center', alignItems: 'center', gap: Spacing.sm,
  },
  videoPlaceholderText: { color: Colors.white + 'AA', fontSize: 14 },
  content: { padding: Spacing.screenH, gap: Spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: Colors.black },
  description: { fontSize: 15, color: Colors.grey600, lineHeight: 24 },
  watchedCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.md, backgroundColor: Colors.safeLight2,
  },
  watchedText: { flex: 1, fontSize: 13, color: Colors.safe, fontWeight: '600' },
  infoCard: { gap: Spacing.sm, padding: Spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  infoText: { fontSize: 14, color: Colors.grey600 },
  watchBtn: { marginTop: Spacing.sm },
  completeBtn: { marginTop: Spacing.sm },
});
