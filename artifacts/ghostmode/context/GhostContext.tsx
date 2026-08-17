import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

export type Mission = {
  id: string;
  title: string;
  detail: string;
  targetMinutes: number;
  createdAt: string;
};

export type FocusSession = {
  id: string;
  missionId: string;
  missionTitle: string;
  durationSeconds: number;
  focusedSeconds: number;
  completedAt: string;
  checkpoints: number;
};

export type ActiveSession = {
  id: string;
  missionId: string;
  missionTitle: string;
  durationSeconds: number;
  remainingSeconds: number;
  isPaused: boolean;
  checkpoints: number;
  autoCompleted?: boolean;
};

type GhostSettings = {
  haptics: boolean;
  sessionShield: boolean;
  lowLight: boolean;
};

type StoredState = {
  missions: Mission[];
  sessions: FocusSession[];
  settings: GhostSettings;
};

type GhostContextValue = StoredState & {
  activeSession: ActiveSession | null;
  hydrated: boolean;
  ghostScore: number;
  streak: number;
  focusMinutes: number;
  startSession: (mission: Mission) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSession: () => FocusSession | null;
  abandonSession: () => void;
  recordCheckpoint: () => void;
  addMission: (title: string, detail: string, targetMinutes: number) => Mission;
  deleteMission: (id: string) => void;
  updateSettings: (next: Partial<GhostSettings>) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'success') => void;
};

const STORAGE_KEY = '@ghostmode/state:v1';
const defaultState: StoredState = {
  missions: [],
  sessions: [],
  settings: { haptics: true, sessionShield: true, lowLight: true },
};

const GhostContext = createContext<GhostContextValue | null>(null);

const newId = () => Date.now().toString() + Math.random().toString(36).slice(2, 8);

const dayKey = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

const previousDay = (key: string) => {
  const date = new Date(key + 'T12:00:00');
  date.setDate(date.getDate() - 1);
  return dayKey(date);
};

export function GhostProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [settings, setSettings] = useState<GhostSettings>(defaultState.settings);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const settingsRef = useRef(settings);

  useEffect(() => { settingsRef.current = settings; }, [settings]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as StoredState;
          setMissions(parsed.missions ?? []);
          setSessions(parsed.sessions ?? []);
          setSettings({ ...defaultState.settings, ...(parsed.settings ?? {}) });
        } catch {
          setMissions([]);
          setSessions([]);
        }
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ missions, sessions, settings })).catch(() => undefined);
  }, [hydrated, missions, sessions, settings]);

  useEffect(() => {
    if (!activeSession || activeSession.isPaused) return;
    const timer = setInterval(() => {
      setActiveSession((current) => {
        if (!current || current.isPaused) return current;
        const next = Math.max(current.remainingSeconds - 1, 0);
        return { ...current, remainingSeconds: next, isPaused: next === 0, autoCompleted: next === 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSession?.id, activeSession?.isPaused]);

  useEffect(() => {
    if (activeSession?.autoCompleted && activeSession.remainingSeconds === 0) finishSession();
  }, [activeSession?.autoCompleted, activeSession?.remainingSeconds]);

  const triggerHaptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (!settingsRef.current.haptics || Platform.OS === 'web') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.impactAsync(type === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  };

  const startSession = (mission: Mission) => {
    triggerHaptic('medium');
    setActiveSession({ id: newId(), missionId: mission.id, missionTitle: mission.title, durationSeconds: mission.targetMinutes * 60, remainingSeconds: mission.targetMinutes * 60, isPaused: false, checkpoints: 0 });
  };

  const finishSession = () => {
    if (!activeSession) return null;
    const completed: FocusSession = {
      id: activeSession.id,
      missionId: activeSession.missionId,
      missionTitle: activeSession.missionTitle,
      durationSeconds: activeSession.durationSeconds,
      focusedSeconds: Math.max(activeSession.durationSeconds - activeSession.remainingSeconds, 0),
      completedAt: new Date().toISOString(),
      checkpoints: activeSession.checkpoints,
    };
    setSessions((current) => [completed, ...current]);
    setActiveSession(null);
    triggerHaptic('success');
    return completed;
  };

  const abandonSession = () => {
    setActiveSession(null);
    triggerHaptic('light');
  };

  const addMission = (title: string, detail: string, targetMinutes: number) => {
    const mission: Mission = { id: newId(), title: title.trim(), detail: detail.trim(), targetMinutes, createdAt: new Date().toISOString() };
    setMissions((current) => [mission, ...current]);
    triggerHaptic('light');
    return mission;
  };

  const deleteMission = (id: string) => setMissions((current) => current.filter((mission) => mission.id !== id));
  const updateSettings = (next: Partial<GhostSettings>) => setSettings((current) => ({ ...current, ...next }));
  const pauseSession = () => setActiveSession((current) => current ? { ...current, isPaused: true } : current);
  const resumeSession = () => setActiveSession((current) => current ? { ...current, isPaused: false, autoCompleted: false } : current);
  const recordCheckpoint = () => { setActiveSession((current) => current ? { ...current, checkpoints: current.checkpoints + 1 } : current); triggerHaptic('light'); };

  const focusMinutes = Math.round(sessions.reduce((total, session) => total + session.focusedSeconds, 0) / 60);
  const uniqueDays = new Set(sessions.map((session) => dayKey(session.completedAt)));
  const today = dayKey(new Date());
  let streak = 0;
  let cursor = today;
  while (uniqueDays.has(cursor)) { streak += 1; cursor = previousDay(cursor); }
  const ghostScore = Math.min(9999, Math.round(focusMinutes * 2 + sessions.length * 35 + streak * 40 + uniqueDays.size * 12));

  const value = useMemo(() => ({ missions, sessions, settings, activeSession, hydrated, ghostScore, streak, focusMinutes, startSession, pauseSession, resumeSession, finishSession, abandonSession, recordCheckpoint, addMission, deleteMission, updateSettings, triggerHaptic }), [missions, sessions, settings, activeSession, hydrated, ghostScore, streak, focusMinutes]);
  return <GhostContext.Provider value={value}>{children}</GhostContext.Provider>;
}

export function useGhost() {
  const context = useContext(GhostContext);
  if (!context) throw new Error('useGhost must be used inside GhostProvider');
  return context;
}

export const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return minutes + ':' + remainder;
};

export const formatFocus = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return minutes + 'm';
  return Math.floor(minutes / 60) + 'h ' + String(minutes % 60).padStart(2, '0') + 'm';
};

export const initials = (title: string) => title.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
