import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { uploadFileDev, uploadFile } from '../services/upload';
import { useAuth } from '../contexts/AuthContext';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'ParentVerification'> };

const USE_DEV_MOCK = __DEV__;

interface ChildForm {
  name: string;
  dob: string;
  certNumber: string;
  photoUri: string | null;
}

export const ParentVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [nationalId, setNationalId] = useState('');
  const [children, setChildren] = useState<ChildForm[]>([
    { name: '', dob: '', certNumber: '', photoUri: null },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addChild = () => {
    if (children.length >= 8) return;
    setChildren(prev => [...prev, { name: '', dob: '', certNumber: '', photoUri: null }]);
  };

  const removeChild = (i: number) => {
    if (children.length <= 1) return;
    setChildren(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateChild = (i: number, field: keyof Omit<ChildForm, 'photoUri'>, value: string) => {
    setChildren(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
    setErrors(prev => { const n = { ...prev }; delete n[`child_${i}_${field}`]; return n; });
  };

  const setChildPhoto = (i: number, uri: string | null) => {
    setChildren(prev => prev.map((c, idx) => idx === i ? { ...c, photoUri: uri } : c));
  };

  const pickPhoto = async (i: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setChildPhoto(i, result.assets[0].uri);
  };

  const takePhoto = async (i: number) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setChildPhoto(i, result.assets[0].uri);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nationalId || !/^\d{8}$/.test(nationalId)) e.nationalId = '8-digit National ID required';
    children.forEach((c, i) => {
      if (!c.name) e[`child_${i}_name`] = 'Required';
      if (!c.dob || !/^\d{4}-\d{2}-\d{2}$/.test(c.dob)) e[`child_${i}_dob`] = 'Format: YYYY-MM-DD';
      if (!c.certNumber) e[`child_${i}_certNumber`] = 'Required';
      if (!c.photoUri) e[`child_${i}_photo`] = 'Photo required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setUploading(true);
    try {
      for (let i = 0; i < children.length; i++) {
        const c = children[i];
        if (USE_DEV_MOCK) {
          await uploadFileDev(c.photoUri!, `child-${user?.id ?? 'dev'}-${i}.jpg`);
        } else {
          await uploadFile(c.photoUri!, `child-${user?.id ?? 'dev'}-${i}.jpg`, 'image/jpeg', 'child-photos');
        }
      }
      setSubmitted(true);
    } catch {
      Alert.alert('Upload failed', 'Could not upload a photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.successWrap}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.safe} />
          <Text style={styles.successTitle}>Verification Submitted</Text>
          <Text style={styles.successBody}>
            Your details are under review. This typically takes 1–2 business days.
            You will be notified once your account is verified.
          </Text>
          <Badge label="PENDING REVIEW" variant="warning" />
          <Button
            label="Back to Home"
            onPress={() => navigation.goBack()}
            variant="primary"
            fullWidth
            style={styles.successBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Verification</Text>
        <Badge label="KYC" variant="info" size="sm" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card variant="surface" style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Verification protects your child. Your National ID and child details are reviewed
            by our team and never shared publicly. The child photo is only shown to your
            assigned watcher once a booking is active.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Your Details</Text>
        <Input
          label="National ID Number"
          value={nationalId}
          onChangeText={v => { setNationalId(v); setErrors(p => { const n = { ...p }; delete n.nationalId; return n; }); }}
          placeholder="e.g. 12345678"
          icon="card-outline"
          keyboardType="number-pad"
          maxLength={8}
          error={errors.nationalId}
        />

        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Children's Details</Text>

        {children.map((child, i) => (
          <View key={i} style={styles.childCard}>
            <View style={styles.childHeader}>
              <Text style={styles.childTitle}>
                {children.length > 1 ? `Child ${i + 1}` : 'Child Details'}
              </Text>
              {children.length > 1 && (
                <TouchableOpacity onPress={() => removeChild(i)} style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={22} color={Colors.sos} />
                </TouchableOpacity>
              )}
            </View>

            <Input
              label="Child's Full Name"
              value={child.name}
              onChangeText={v => updateChild(i, 'name', v)}
              placeholder="e.g. Amina Waweru"
              icon="person-outline"
              error={errors[`child_${i}_name`]}
              style={styles.field}
            />
            <Input
              label="Date of Birth"
              value={child.dob}
              onChangeText={v => updateChild(i, 'dob', v)}
              placeholder="YYYY-MM-DD"
              icon="calendar-outline"
              keyboardType="numbers-and-punctuation"
              error={errors[`child_${i}_dob`]}
              style={styles.field}
            />
            <Input
              label="Birth Certificate / Huduma Number"
              value={child.certNumber}
              onChangeText={v => updateChild(i, 'certNumber', v)}
              placeholder="Birth cert or Huduma No."
              icon="document-text-outline"
              error={errors[`child_${i}_certNumber`]}
              style={styles.field}
            />

            <Text style={[styles.photoNote, { marginTop: Spacing.sm }]}>Child Photo (visible only to assigned watcher)</Text>
            {child.photoUri ? (
              <View style={styles.photoPreview}>
                <Image source={{ uri: child.photoUri }} style={styles.photoImg} />
                <TouchableOpacity style={styles.photoRemove} onPress={() => setChildPhoto(i, null)}>
                  <Ionicons name="close-circle" size={28} color={Colors.sos} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoBtn} onPress={() => takePhoto(i)}>
                  <Ionicons name="camera-outline" size={24} color={Colors.primary} />
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto(i)}>
                  <Ionicons name="images-outline" size={24} color={Colors.primary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
            {errors[`child_${i}_photo`] ? <Text style={styles.errText}>{errors[`child_${i}_photo`]}</Text> : null}
          </View>
        ))}

        {children.length < 8 && (
          <TouchableOpacity style={styles.addChildBtn} onPress={addChild}>
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.addChildText}>Add Another Child</Text>
          </TouchableOpacity>
        )}

        <Button
          label={uploading ? 'Submitting…' : 'Submit for Verification'}
          onPress={handleSubmit}
          loading={uploading}
          fullWidth
          style={styles.cta}
          icon="shield-checkmark-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.grey100, gap: Spacing.sm,
  },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: 20, fontWeight: '700', color: Colors.black },
  scroll:       { padding: Spacing.screenH, gap: Spacing.md },
  infoCard:     { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, alignItems: 'flex-start' },
  infoText:     { flex: 1, fontSize: 13, color: Colors.grey600, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  field:        { marginTop: Spacing.sm },
  photoNote:    { fontSize: 13, color: Colors.grey400, marginBottom: Spacing.sm },
  photoButtons: { flexDirection: 'row', gap: Spacing.md },
  photoBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg, borderRadius: 12, gap: Spacing.sm,
    backgroundColor: Colors.grey100, borderWidth: 1, borderColor: Colors.borderDefault,
    borderStyle: 'dashed',
  },
  photoBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  photoPreview: { alignItems: 'center', position: 'relative' },
  photoImg:     { width: 160, height: 160, borderRadius: 12 },
  photoRemove:  { position: 'absolute', top: -8, right: 80 },
  errText:      { fontSize: 12, color: Colors.borderError, marginTop: 4 },
  cta:          { marginTop: Spacing.xl, marginBottom: Spacing.lg },
  childCard: {
    borderWidth: 1, borderColor: Colors.borderDefault, borderRadius: 12,
    padding: Spacing.md, gap: Spacing.sm,
  },
  childHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  childTitle:   { fontSize: 15, fontWeight: '700', color: Colors.black },
  removeBtn:    { padding: 4 },
  addChildBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed',
  },
  addChildText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  successWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Spacing.xl, gap: Spacing.lg,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: Colors.black, textAlign: 'center' },
  successBody:  { fontSize: 15, color: Colors.grey600, textAlign: 'center', lineHeight: 24 },
  successBtn:   { marginTop: Spacing.md },
});
