// src/store/profileStore.ts
import { create } from 'zustand';

export type Profile = {
  id: string;
  nickname: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type ProfileState = {
  profile?: Profile;
  setProfile: (profile?: Profile) => void;
  updateProfile: (profile: Profile) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: undefined,
  setProfile: (profile) => set({ profile }),
  updateProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: undefined }),
}));
