import React from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: ViewStyle }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + (Platform.OS === 'web' ? 67 : 16);
  const paddingBottom = insets.bottom + (Platform.OS === 'web' ? 34 : 24);
  const contentStyle = [styles.content, { paddingTop, paddingBottom }, style];
  if (!scroll) return <View style={[styles.root, { backgroundColor: colors.background }]}><View style={contentStyle}>{children}</View></View>;
  return <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

export function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  const colors = useColors();
  return <View style={styles.sectionRow}><View style={styles.sectionTitleWrap}><View style={[styles.signal, { backgroundColor: colors.primary }]} /><TextLabel color={colors.mutedForeground}>{children}</TextLabel></View>{right}</View>;
}

export function TextLabel({ children, color, size = 11, weight = '600' }: { children: React.ReactNode; color: string; size?: number; weight?: '400' | '500' | '600' | '700' }) {
  return <View><RNText style={{ color, fontSize: size, fontFamily: 'Inter_' + (weight === '700' ? '700Bold' : weight === '600' ? '600SemiBold' : weight === '500' ? '500Medium' : '400Regular'), letterSpacing: size <= 11 ? 1.4 : 0 }}>{children}</RNText></View>;
}

import { Text as RNText } from 'react-native';

const styles = StyleSheet.create({ root: { flex: 1 }, content: { paddingHorizontal: 20 }, sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 }, sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 }, signal: { width: 6, height: 6, borderRadius: 3 }, });
