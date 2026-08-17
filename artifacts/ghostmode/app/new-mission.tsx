import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useGhost } from '@/context/GhostContext';
import { Screen, TextLabel } from '@/components/Screen';

const durations = [30, 60, 90, 120];
export default function NewMissionScreen() {
  const colors = useColors();
  const { addMission, startSession, triggerHaptic } = useGhost();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [duration, setDuration] = useState(30);
  const canSave = title.trim().length > 2;
  const save = () => { if (!canSave) return; const mission = addMission(title, detail, duration); startSession(mission); triggerHaptic('success'); router.replace('/session'); };
  return <Screen><View style={styles.top}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="x" size={19} color={colors.foreground} /></Pressable><TextLabel color={colors.mutedForeground}>NEW OBJECTIVE</TextLabel><View style={{ width: 42 }} /></View><Text style={[styles.title, { color: colors.foreground }]}>Set the mission.</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>One objective. One clean runway. No context switching.</Text>
    <View style={styles.form}><TextLabel color={colors.primary}>MISSION</TextLabel><TextInput autoFocus value={title} onChangeText={setTitle} placeholder="Finish landing page" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: title ? colors.primary : colors.border, backgroundColor: colors.card }]} maxLength={60} /><TextLabel color={colors.primary}>SECONDARY BRIEF <TextLabel color={colors.mutedForeground} size={10}>(OPTIONAL)</TextLabel></TextLabel><TextInput value={detail} onChangeText={setDetail} placeholder="What does done look like?" placeholderTextColor={colors.mutedForeground} style={[styles.input, styles.detailInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} maxLength={100} />
      <TextLabel color={colors.primary}>TIMEBOX</TextLabel><View style={styles.durationRow}>{durations.map((item) => <Pressable key={item} onPress={() => setDuration(item)} style={[styles.duration, { backgroundColor: item === duration ? colors.primary : colors.card, borderColor: item === duration ? colors.primary : colors.border }]}><Text style={[styles.durationText, { color: item === duration ? colors.primaryForeground : colors.foreground }]}>{item >= 60 ? item / 60 + 'H' : item + 'M'}</Text></Pressable>)}</View>
    </View><View style={styles.bottom}><View style={styles.protocol}><Feather name="shield" size={16} color={colors.success} /><TextLabel color={colors.mutedForeground} size={10}>SESSION SHIELD WILL ACTIVATE ON DEPLOY</TextLabel></View><Pressable accessibilityLabel="Deploy mission" testID="Deploy mission" disabled={!canSave} onPress={save} style={({ pressed }) => [styles.deploy, { backgroundColor: canSave ? colors.primary : colors.accent }, pressed && { opacity: 0.78 }]}><Text style={[styles.deployText, { color: canSave ? colors.primaryForeground : colors.mutedForeground }]}>DEPLOY MISSION</Text><Feather name="arrow-up-right" size={17} color={canSave ? colors.primaryForeground : colors.mutedForeground} /></Pressable></View>
  </Screen>;
}
const styles = StyleSheet.create({ top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, back: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, title: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: -1.1, marginTop: 32 }, subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 300 }, form: { gap: 12, marginTop: 38 }, input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontFamily: 'Inter_500Medium', fontSize: 15, marginBottom: 10 }, detailInput: { height: 80, paddingTop: 16, textAlignVertical: 'top' }, durationRow: { flexDirection: 'row', gap: 8, marginTop: 2 }, duration: { flex: 1, height: 49, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, durationText: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1 }, bottom: { marginTop: 'auto', paddingTop: 45 }, protocol: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }, deploy: { height: 55, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, deployText: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.2 } });
