import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  theme: ThemeMode;
  hydrated: boolean;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
};

const THEME_STORAGE_KEY = 'themeMode';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  hydrated: false,
  setTheme: async (mode: ThemeMode) => {
    set({ theme: mode });
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {}
  },
  toggleTheme: async () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: next });
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  },
  loadTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        set({ theme: stored });
      }
    } finally {
      set({ hydrated: true });
    }
  },
}));


