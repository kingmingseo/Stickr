import { useState } from 'react';
import { supabase } from '../api/supabaseClient';
import queryClient from '../api/queryClient';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useModal } from './useModal';
import CookieManager from '@react-native-cookies/cookies';

type AuthError = {
  message: string;
  code?: string;
} | null;

function normalizeToAuthError(err: any): { message: string; code?: string } {
  if (!err) {
    return { message: '알 수 없는 오류가 발생했습니다.' };
  }
  const message =
    err?.message || err?.error_description || err?.error || String(err);
  const code = err?.code || (err?.status ? String(err.status) : undefined);
  return { message, code };
}

function useAuth() {
  const [loading, setLoading] = useState(false);
  const { isVisible, openModal, closeModal } = useModal();
  const [oauthUrl, setOauthUrl] = useState('');
  const [authError, setAuthError] = useState<AuthError>(null);

  function clearAuthError() {
    setAuthError(null);
  }

  async function signInWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ error?: any }> {
    try {
      clearAuthError();
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setAuthError(normalizeToAuthError(error));
        return { error };
      }

      const { user } = data || ({} as any);

      // 프로필 즉시 로드 → 스토어에 저장
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, nickname, bio, avatar_url')
        .eq('id', user.id)
        .single();
      if (!profileError) {
        queryClient.setQueryData(['profile', profile.id], profile);
        queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
      }

      // 게스트 모드 비활성화
      await AsyncStorage.removeItem('guestMode');

      return {};
    } catch (error) {
      setAuthError(normalizeToAuthError(error));
      return { error };
    } finally {
      setLoading(false);
    }
  }

  async function signOut(): Promise<{ error?: any }> {
    try {
      clearAuthError();
      setLoading(true);

      // Supabase 로그아웃
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(normalizeToAuthError(error));
        return { error };
      }
      //WebView 쿠키 삭제 (카카오 OAuth 세션 정리)
      try {
        await CookieManager.clearAll();
        console.log('WebView 쿠키 삭제 완료');
      } catch (cookieError) {
        console.error('쿠키 삭제 에러:', cookieError);
      }
      // 온보딩 상태 보존
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      // 로컬 캐시 완전히 클리어
      queryClient.clear();
      await AsyncStorage.clear();

      // 온보딩 상태 복원
      if (hasSeenOnboarding) {
        await AsyncStorage.setItem('hasSeenOnboarding', hasSeenOnboarding);
      }

      return {};
    } catch (error) {
      setAuthError(normalizeToAuthError(error));
      return { error };
    } finally {
      setLoading(false);
    }
  }

  async function deleteAccount(): Promise<{ error?: any }> {
    try {
      clearAuthError();
      setLoading(true);

      // 1. 현재 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        const e = new Error('로그인된 사용자가 없습니다.');
        setAuthError(normalizeToAuthError(e));
        return { error: e };
      }
      // 2. Supabase RPC 함수 호출하여 계정 삭제
      const { error: rpcError } = await supabase.rpc('delete_user');

      if (rpcError) {
        console.error('계정 삭제 RPC 에러:', rpcError);
      }

      // 3. Supabase Auth 세션 로그아웃 (OAuth 세션 정리)
      await supabase.auth.signOut();

      // 4. WebView 쿠키 삭제 (카카오 OAuth 세션 정리)
      try {
        await CookieManager.clearAll();
        console.log('WebView 쿠키 삭제 완료');
      } catch (cookieError) {
        console.error('쿠키 삭제 에러:', cookieError);
      }

      // 5. 온보딩 상태 보존
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

      // 6. 로컬 캐시 클리어
      queryClient.clear();
      await AsyncStorage.clear();

      // 7. 온보딩 상태 복원
      if (hasSeenOnboarding) {
        await AsyncStorage.setItem('hasSeenOnboarding', hasSeenOnboarding);
      }

      return {};
    } catch (error) {
      console.error('회원 탈퇴 에러:', error);
      setAuthError(normalizeToAuthError(error));
      return { error };
    } finally {
      setLoading(false);
    }
  }

  // Google 로그인 (네이티브 Google Sign-In 방식)
  async function signInWithGoogle(): Promise<{ error?: any }> {
    try {
      console.log('Google 로그인 시작');
      clearAuthError();
      setLoading(true);

      // Play Services 확인
      await GoogleSignin.hasPlayServices();

      // Google 로그인 실행
      const userInfo = await GoogleSignin.signIn();
      console.log('Google 로그인 성공:', userInfo);

      if (!userInfo.data?.idToken) {
        const e = new Error('Google 로그인에서 ID 토큰을 받지 못했습니다.');
        setAuthError(normalizeToAuthError(e));
        return { error: e };
      }
      console.log(userInfo.data.user.givenName);
      // Supabase에 Google ID 토큰으로 로그인
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });

      console.log('Supabase 로그인 결과:', { data, error });

      if (error) {
        setAuthError(normalizeToAuthError(error));
        return { error };
      }

      const { user } = data || ({} as any);

      // Google 사용자 정보에서 이름 추출
      const googleName =
        userInfo.data.user.givenName ||
        userInfo.data.user.name ||
        'Google 사용자';
      console.log('Google 이름:', googleName);

      // 프로필 업데이트 (UPSERT 방식)
      console.log('프로필 업데이트 중...');

      const { data: profile, error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          nickname: googleName,
          bio: '',
          avatar_url: userInfo.data.user.photo || null,
        })
        .select()
        .single();

      if (updateError) {
        console.log('프로필 업데이트 에러:', updateError);
        return { error: updateError };
      }

      console.log('프로필 업데이트 완료:', profile);

      if (profile) {
        queryClient.setQueryData(['profile', profile.id], profile);
        queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
      }

      // 게스트 모드 비활성화
      await AsyncStorage.removeItem('guestMode');
      console.log('게스트 모드 비활성화 완료');

      console.log('Google 로그인 완료');
      return {};
    } catch (error: any) {
      console.log('Google 로그인 에러:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('사용자가 로그인을 취소했습니다');
        const e = new Error('로그인이 취소되었습니다.');
        setAuthError(normalizeToAuthError(e));
        return { error: e };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('로그인이 이미 진행 중입니다');
        const e = new Error('로그인이 이미 진행 중입니다.');
        setAuthError(normalizeToAuthError(e));
        return { error: e };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google Play Services를 사용할 수 없습니다');
        const e = new Error('Google Play Services를 사용할 수 없습니다.');
        setAuthError(normalizeToAuthError(e));
        return { error: e };
      } else {
        setAuthError(normalizeToAuthError(error));
        return { error };
      }
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
      clearAuthError();
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { nickname },
          emailRedirectTo: 'https://stickr-uploader.vercel.app/confirm',
        },
      });
      if (error) {
        setAuthError(normalizeToAuthError(error));
        return { error };
      }

      return {};
    } catch (error) {
      setAuthError(normalizeToAuthError(error));
      return { error };
    } finally {
      setLoading(false);
    }
  }

  async function signInWithKakao(): Promise<{ error?: any }> {
    try {
      clearAuthError();
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: 'stickr://auth/callback',
        },
      });

      console.log('Kakao OAuth 결과:', { data, error });
      if (error) {
        setAuthError(normalizeToAuthError(error));
        return { error };
      }

      // OAuth URL이 있으면 WebView 모달로 열기
      if (data?.url) {
        setOauthUrl(data.url);
        openModal();
      }

      return {};
    } catch (error) {
      setAuthError(normalizeToAuthError(error));
      return { error };
    } finally {
      setLoading(false);
    }
  }

  // OAuth 콜백 처리 후 프로필 업데이트
  async function handleOAuthCallback(user: any): Promise<{ error?: any }> {
    try {
      console.log('OAuth 콜백 처리 시작:', user);

      // Kakao 사용자 정보에서 이름 추출
      const kakaoName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.nickname ||
        'Kakao 사용자';

      console.log('Kakao 이름:', kakaoName);

      // 프로필 업데이트 (UPSERT 방식)
      const { data: profile, error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          nickname: kakaoName,
          bio: '',
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();

      if (updateError) {
        console.log('프로필 업데이트 에러:', updateError);
        setAuthError(normalizeToAuthError(updateError));
        return { error: updateError };
      }

      console.log('프로필 업데이트 완료:', profile);

      if (profile) {
        queryClient.setQueryData(['profile', profile.id], profile);
        queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
      }

      // 게스트 모드 비활성화
      await AsyncStorage.removeItem('guestMode');
      console.log('게스트 모드 비활성화 완료');

      return {};
    } catch (error) {
      console.log('OAuth 콜백 처리 에러:', error);
      setAuthError(normalizeToAuthError(error));
      return { error };
    }
  }

  // OAuth WebView 콜백 URL 처리
  async function handleOAuthWebViewCallback(
    callbackUrl: string,
  ): Promise<{ error?: any }> {
    try {
      console.log('OAuth WebView 콜백 URL:', callbackUrl);

      // URL에서 access_token과 refresh_token 추출 (fragment 부분에서)
      const urlObj = new URL(callbackUrl);

      // Fragment에서 파라미터 추출
      const fragment = urlObj.hash.substring(1); // # 제거
      const params = new URLSearchParams(fragment);

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        // Supabase 세션 설정
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('OAuth 콜백 처리 에러:', error);
          setAuthError(normalizeToAuthError(error));
          return { error };
        }

        console.log('OAuth 로그인 성공:', data);

        // 사용자 정보가 있으면 프로필 업데이트
        if (data?.user) {
          await handleOAuthCallback(data.user);
        }
      }

      return {};
    } catch (error) {
      console.log('OAuth WebView 콜백 처리 에러:', error);
      setAuthError(normalizeToAuthError(error));
      return { error };
    }
  }

  return {
    loading,
    authError,
    clearAuthError,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    deleteAccount,
    signInWithGoogle,
    signInWithKakao,
    handleOAuthCallback,

    // WebView 관련
    isVisible,
    oauthUrl,
    openModal,
    closeModal,
    handleOAuthWebViewCallback,
  };
}

export default useAuth;
