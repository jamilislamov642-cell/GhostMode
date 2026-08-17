import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function GhostMark({ size = 28, muted = false }: { size?: number; muted?: boolean }) {
  const colors = useColors();
  return <View style={{ width: size, height: size, borderRadius: size * 0.25, backgroundColor: muted ? colors.secondary : colors.primary, alignItems: 'center', justifyContent: 'center' }}><Feather name="eye-off" size={size * 0.54} color={muted ? colors.steel : colors.primaryForeground} /></View>;
}
