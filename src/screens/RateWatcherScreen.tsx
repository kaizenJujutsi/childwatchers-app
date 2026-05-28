import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { submitReview } from '../services/reviews';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RateWatcher'>;
  route: RouteProp<RootStackParamList, 'RateWatcher'>;
};

export const RateWatcherScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId, watcherName } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(bookingId, rating, comment);
      Alert.alert('Review submitted!', `Thank you for rating ${watcherName}.`, [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg.includes('already reviewed')) {
        Alert.alert('Already reviewed', 'You have already submitted a review for this booking.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Could not submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate {watcherName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Your rating</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setRating(n)} accessibilityRole="button" accessibilityLabel={`${n} star${n !== 1 ? 's' : ''}`}>
              <Ionicons
                name={n <= rating ? 'star' : 'star-outline'}
                size={44}
                color={n <= rating ? Colors.accentLight : Colors.grey200}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Comment (optional)</Text>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="How was the experience?"
          placeholderTextColor={Colors.grey400}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{comment.length}/500</Text>

        <TouchableOpacity
          style={[styles.submitBtn, (submitting || rating === 0) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting || rating === 0}
          accessibilityRole="button"
          accessibilityLabel="Submit review"
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.primary },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.screenH, paddingVertical: Spacing.md, gap: 8,
  },
  backBtn:    { padding: 4 },
  headerTitle:{ fontSize: 18, fontWeight: '700', color: Colors.white },
  content:    { padding: Spacing.screenH, paddingTop: 28, backgroundColor: Colors.screenBg, flexGrow: 1 },
  label:      { fontSize: 14, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  stars:      { flexDirection: 'row', gap: 8, marginBottom: 28 },
  input: {
    borderWidth: 1, borderColor: Colors.grey200, borderRadius: 10,
    padding: Spacing.sm, minHeight: 100, fontSize: 14, color: Colors.black,
    backgroundColor: Colors.white, marginBottom: 4,
  },
  charCount:  { fontSize: 11, color: Colors.grey400, textAlign: 'right', marginBottom: 28 },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText:     { fontSize: 16, fontWeight: '700', color: Colors.white },
});
