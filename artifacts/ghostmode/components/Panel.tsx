import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function Panel({ children, style, onPress, accent = false }: { children: React.ReactNode; style?: object; onPress?: () => void; accent?: boolean }) {
  const colors = useColors();
  const content = <View style={[styles.panel, { backgroundColor: colors.card, borderColor: accent ? colors.primary : colors.border }, style]}>{children}</View>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.82 }]}>{content}</Pressable> : content;
}

export function IconButton({ name, onPress, label }: { name: React.ComponentProps<typeof Feather>['name']; onPress: () => void; label: string }) {
  const colors = useColors();
  return <Pressable accessibilityLabel={label} testID={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.secondary, borderColor: colors.border }, pressed && { opacity: 0.7 }]}><Feather name={name} size={18} color={colors.foreground} /></Pressable>;
}

export function Divider() { const colors = useColors(); return <View style={{ height: 1, backgroundColor: colors.border }} />; }

const styles = StyleSheet.create({ panel: { borderWidth: 1, borderRadius: 16, padding: 16 }, iconButton: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
