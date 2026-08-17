import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';

function NativeTabLayout() {
  return <NativeTabs><NativeTabs.Trigger name="index"><Icon sf={{ default: 'scope', selected: 'scope' }} /><Label>Command</Label></NativeTabs.Trigger><NativeTabs.Trigger name="sessions"><Icon sf={{ default: 'timer', selected: 'timer' }} /><Label>Sessions</Label></NativeTabs.Trigger><NativeTabs.Trigger name="intel"><Icon sf={{ default: 'chart.bar.xaxis', selected: 'chart.bar.xaxis' }} /><Label>Intel</Label></NativeTabs.Trigger><NativeTabs.Trigger name="settings"><Icon sf={{ default: 'slider.horizontal.3', selected: 'slider.horizontal.3' }} /><Label>System</Label></NativeTabs.Trigger></NativeTabs>;
}

function ClassicTabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.mutedForeground, tabBarStyle: { position: 'absolute', backgroundColor: isIOS ? 'transparent' : colors.background, borderTopWidth: isWeb ? 1 : 0, borderTopColor: colors.border, elevation: 0, ...(isWeb ? { height: 84 } : {}) }, tabBarBackground: () => isIOS ? <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill} /> : isWeb ? <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} /> : null }}>
    <Tabs.Screen name="index" options={{ title: 'Command', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="scope" tintColor={color} size={23} /> : <Feather name="crosshair" size={21} color={color} /> }} />
    <Tabs.Screen name="sessions" options={{ title: 'Sessions', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="timer" tintColor={color} size={23} /> : <Feather name="clock" size={21} color={color} /> }} />
    <Tabs.Screen name="intel" options={{ title: 'Intel', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="chart.bar.xaxis" tintColor={color} size={23} /> : <Feather name="bar-chart-2" size={21} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: 'System', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="slider.horizontal.3" tintColor={color} size={23} /> : <Feather name="sliders" size={21} color={color} /> }} />
  </Tabs>;
}

export default function TabLayout() { return isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />; }
