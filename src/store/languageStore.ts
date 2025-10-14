import { create } from 'zustand';
import { LanguageMode } from '../types/languageMode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageState {
  language: LanguageMode;
  setLanguage: (language: LanguageMode) => Promise<void>;
  hydrated: boolean;
  loadLanguage: () => Promise<void>;
}
const LANGUAGE_STORAGE_KEY = 'language';

export const useLanguageStore = create<LanguageState>(set => ({
  language: 'korean',
  hydrated: false,
  setLanguage: async (language: LanguageMode) => {
    set({ language: language });
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {}
  },
  loadLanguage: async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'korean' || stored === 'english') {
        set({ language: stored });
      }
    } finally {
      set({ hydrated: true });
    }
  },
}));
