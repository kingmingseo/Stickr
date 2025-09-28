import { useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { useProfileStore } from '../store/profileStore';
import queryClient from '../api/queryClient';

function useAuth() {
  const [loading, setLoading] = useState(false);

  async function signInWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ error?: any }> {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) return { error };

      const { user } = data || ({} as any);

      // 프로필 즉시 로드 → 스토어에 저장
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, nickname, bio, avatar_url')
        .eq('id', user.id)
        .single();
      if (!profileError) {
        useProfileStore.getState().setProfile(profile);
        queryClient.setQueryData(['profile', profile.id], profile);
        queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
      }
      return {};
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  }

  async function signOut(): Promise<{ error?: any }> {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) return { error };
      useProfileStore.getState().clearProfile();
      return {};
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  }

  // Google OAuth 로그인 (Android에서 사용)
  async function signInWithGoogle(): Promise<{ error?: any }> {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // 모바일 환경에서는 리디렉트 설정이 필요합니다. (딥링크 구성 권장)
          // skipBrowserRedirect: true 를 사용하면 data.url을 수동으로 열 수 있습니다.
        },
      });
      if (error) return { error };
      return {};
    } catch (error) {
      return { error } as any;
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail({
    email,
    password,
    nickname,
  }: {
    email: string;
    password: string;
    nickname: string;
  }): Promise<{ error?: any }> {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { nickname },
        },
      });
      if (error) return { error };

      return {};
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle,
  };
}

export default useAuth;
