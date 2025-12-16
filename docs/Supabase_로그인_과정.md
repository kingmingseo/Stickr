# Supabase를 통한 로그인 과정 상세 설명

> Stickr 프로젝트의 Supabase 인증 시스템 동작 방식

<br/>

## 📋 목차
1. [전체 아키텍처](#-전체-아키텍처)
2. [이메일/비밀번호 로그인](#-이메일비밀번호-로그인)
3. [Google 로그인](#-google-로그인)
4. [Kakao 로그인 (OAuth)](#-kakao-로그인-oauth)
5. [세션 관리](#-세션-관리)
6. [로그아웃 과정](#-로그아웃-과정)

<br/>

---

## 🏗 전체 아키텍처

### Supabase 클라이언트 설정

```typescript
// src/api/supabaseClient.ts
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,        // 세션을 AsyncStorage에 저장
      autoRefreshToken: true,       // 토큰 자동 갱신
      persistSession: true,         // 세션 영구 저장
      detectSessionInUrl: false,    // URL에서 세션 감지 비활성화 (모바일)
    },
  },
);
```

**주요 설정:**
- `storage: AsyncStorage`: 세션 정보를 로컬 스토리지에 저장하여 앱 재시작 후에도 로그인 상태 유지
- `autoRefreshToken: true`: Access Token이 만료되기 전에 자동으로 갱신
- `persistSession: true`: 세션을 영구적으로 저장

### 세션 상태 감지

```typescript
// src/hooks/useSupabaseSession.ts
const { data: { session: initialSession } } = await supabase.auth.getSession();
setSession(initialSession);

// 인증 상태 변경 리스너
supabase.auth.onAuthStateChange((_e, next) => {
  setSession(next);
});
```

**동작 방식:**
1. 앱 시작 시 저장된 세션을 확인
2. `onAuthStateChange` 리스너로 로그인/로그아웃 상태 변화 감지
3. 세션 변경 시 자동으로 UI 업데이트

<br/>

---

## 📧 이메일/비밀번호 로그인

### 플로우 다이어그램

```
사용자 입력
    ↓
[이메일, 비밀번호]
    ↓
supabase.auth.signInWithPassword()
    ↓
Supabase 서버 인증
    ↓
[성공] → Session 생성
    ↓
user_profiles 테이블에서 프로필 조회
    ↓
React Query 캐시에 프로필 저장
    ↓
게스트 모드 비활성화
    ↓
로그인 완료
```

### 코드 상세

```typescript
// src/hooks/useAuth.ts - signInWithEmail
async function signInWithEmail({ email, password }) {
  // 1. Supabase에 이메일/비밀번호로 로그인
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return { error };
  }

  // 2. 사용자 정보 추출
  const { user } = data || {};

  // 3. 프로필 정보 즉시 로드
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, nickname, bio, avatar_url')
    .eq('id', user.id)
    .single();

  // 4. React Query 캐시에 프로필 저장
  queryClient.setQueryData(['profile', profile.id], profile);
  queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });

  // 5. 게스트 모드 비활성화
  await AsyncStorage.removeItem('guestMode');

  return {};
}
```

### 단계별 설명

1. **인증 요청**
   - `supabase.auth.signInWithPassword()` 호출
   - Supabase 서버에서 이메일/비밀번호 검증

2. **세션 생성**
   - 인증 성공 시 Supabase가 `access_token`과 `refresh_token` 생성
   - 토큰이 `AsyncStorage`에 자동 저장됨

3. **프로필 로드**
   - `user_profiles` 테이블에서 사용자 프로필 정보 조회
   - React Query 캐시에 저장하여 이후 빠른 접근 가능

4. **게스트 모드 해제**
   - 로그인 성공 시 게스트 모드 플래그 제거

<br/>

---

## 🔵 Google 로그인

### 플로우 다이어그램

```
사용자 클릭
    ↓
GoogleSignin.signIn()
    ↓
Google Play Services 확인
    ↓
Google 로그인 화면 표시
    ↓
사용자 인증 완료
    ↓
[ID Token 획득]
    ↓
supabase.auth.signInWithIdToken()
    ↓
Supabase 서버에서 Google ID Token 검증
    ↓
[성공] → Session 생성
    ↓
Google 사용자 정보 추출 (이름, 사진)
    ↓
user_profiles 테이블에 UPSERT
    ↓
React Query 캐시에 프로필 저장
    ↓
게스트 모드 비활성화
    ↓
로그인 완료
```

### 코드 상세

```typescript
// src/hooks/useAuth.ts - signInWithGoogle
async function signInWithGoogle() {
  // 1. Google Play Services 확인
  await GoogleSignin.hasPlayServices();

  // 2. Google 로그인 실행 (네이티브)
  const userInfo = await GoogleSignin.signIn();
  
  if (!userInfo.data?.idToken) {
    throw new Error('ID 토큰을 받지 못했습니다.');
  }

  // 3. Supabase에 Google ID 토큰으로 로그인
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: userInfo.data.idToken,
  });

  if (error) {
    return { error };
  }

  const { user } = data || {};

  // 4. Google 사용자 정보 추출
  const googleName = 
    userInfo.data.user.givenName ||
    userInfo.data.user.name ||
    'Google 사용자';

  // 5. 프로필 업데이트 (UPSERT)
  const { data: profile } = await supabase
    .from('user_profiles')
    .upsert({
      id: user.id,
      nickname: googleName,
      bio: '',
      avatar_url: userInfo.data.user.photo || null,
    })
    .select()
    .single();

  // 6. React Query 캐시에 저장
  queryClient.setQueryData(['profile', profile.id], profile);
  queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });

  // 7. 게스트 모드 비활성화
  await AsyncStorage.removeItem('guestMode');

  return {};
}
```

### 특징

- **네이티브 Google Sign-In**: `@react-native-google-signin/google-signin` 사용
- **ID Token 방식**: Google에서 받은 ID Token을 Supabase에 전달
- **자동 프로필 생성**: 첫 로그인 시 자동으로 프로필 생성/업데이트
- **UPSERT 사용**: 이미 프로필이 있으면 업데이트, 없으면 생성

<br/>

---

## 🟡 Kakao 로그인 (OAuth)

### 플로우 다이어그램

```
사용자 클릭
    ↓
supabase.auth.signInWithOAuth({ provider: 'kakao' })
    ↓
Supabase에서 OAuth URL 생성
    ↓
WebView 모달로 OAuth URL 열기
    ↓
사용자가 Kakao 로그인
    ↓
콜백 URL: stickr://auth/callback#access_token=...&refresh_token=...
    ↓
URL에서 토큰 추출
    ↓
supabase.auth.setSession({ access_token, refresh_token })
    ↓
Supabase 세션 설정
    ↓
Kakao 사용자 정보 추출
    ↓
user_profiles 테이블에 UPSERT
    ↓
React Query 캐시에 프로필 저장
    ↓
게스트 모드 비활성화
    ↓
로그인 완료
```

### 코드 상세

#### 1단계: OAuth 시작

```typescript
// src/hooks/useAuth.ts - signInWithKakao
async function signInWithKakao() {
  // 1. Supabase OAuth URL 요청
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: 'stickr://auth/callback',  // 딥링크 콜백 URL
    },
  });

  if (error) {
    return { error };
  }

  // 2. OAuth URL을 WebView 모달로 열기
  if (data?.url) {
    setOauthUrl(data.url);
    openModal();  // WebView 모달 표시
  }

  return {};
}
```

#### 2단계: 콜백 처리

```typescript
// src/hooks/useAuth.ts - handleOAuthWebViewCallback
async function handleOAuthWebViewCallback(callbackUrl: string) {
  // 1. URL에서 토큰 추출
  const urlObj = new URL(callbackUrl);
  const fragment = urlObj.hash.substring(1);  // # 제거
  const params = new URLSearchParams(fragment);

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken && refreshToken) {
    // 2. Supabase 세션 설정
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      return { error };
    }

    // 3. 사용자 정보가 있으면 프로필 업데이트
    if (data?.user) {
      await handleOAuthCallback(data.user);
    }
  }

  return {};
}
```

#### 3단계: 프로필 업데이트

```typescript
// src/hooks/useAuth.ts - handleOAuthCallback
async function handleOAuthCallback(user: any) {
  // 1. Kakao 사용자 정보에서 이름 추출
  const kakaoName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.nickname ||
    'Kakao 사용자';

  // 2. 프로필 업데이트 (UPSERT)
  const { data: profile } = await supabase
    .from('user_profiles')
    .upsert({
      id: user.id,
      nickname: kakaoName,
      bio: '',
      avatar_url: user.user_metadata?.avatar_url || null,
    })
    .select()
    .single();

  // 3. React Query 캐시에 저장
  queryClient.setQueryData(['profile', profile.id], profile);
  queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });

  // 4. 게스트 모드 비활성화
  await AsyncStorage.removeItem('guestMode');

  return {};
}
```

### 특징

- **WebView 사용**: React Native에서 OAuth 플로우를 처리하기 위해 WebView 사용
- **딥링크 콜백**: `stickr://auth/callback` 형식의 딥링크로 콜백 처리
- **Fragment 기반 토큰**: URL의 hash fragment(`#`)에서 토큰 추출
- **쿠키 관리**: WebView 쿠키를 `@react-native-cookies/cookies`로 관리

<br/>

---

## 🔄 세션 관리

### 자동 토큰 갱신

```typescript
// src/api/supabaseClient.ts
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();  // 앱이 활성화되면 토큰 갱신 시작
    } else {
      supabase.auth.stopAutoRefresh();   // 앱이 백그라운드로 가면 갱신 중지
    }
  });
}
```

**동작 방식:**
- 앱이 포그라운드로 올 때 자동으로 토큰 갱신 시작
- 백그라운드로 가면 갱신 중지하여 배터리 절약
- `autoRefreshToken: true` 설정으로 만료 전 자동 갱신

### 세션 상태 감지

```typescript
// src/hooks/useSupabaseSession.ts
function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 1. 초기 세션 로드
    const { data: { session: initialSession } } = 
      await supabase.auth.getSession();
    setSession(initialSession);

    // 2. 인증 상태 변경 리스너 등록
    const { data } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next);  // 로그인/로그아웃 시 자동 업데이트
    });

    return () => {
      data.subscription.unsubscribe();  // 컴포넌트 언마운트 시 구독 해제
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
  };
}
```

**사용 예시:**

```typescript
// src/navigations/RootNavigation.tsx
function RootNavigation() {
  const { isAuthenticated } = useSupabaseSession();

  // 인증 상태에 따라 다른 화면 표시
  const initialRouteName = 
    !isAuthenticated && !guestMode
      ? 'AuthNavigation'
      : 'BottomTabNavigation';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {/* ... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

<br/>

---

## 🚪 로그아웃 과정

### 플로우 다이어그램

```
사용자 클릭 (로그아웃)
    ↓
supabase.auth.signOut()
    ↓
Supabase 세션 무효화
    ↓
WebView 쿠키 삭제 (Kakao OAuth 세션 정리)
    ↓
온보딩 상태 보존
    ↓
React Query 캐시 클리어
    ↓
AsyncStorage 완전 클리어
    ↓
온보딩 상태 복원
    ↓
로그아웃 완료
```

### 코드 상세

```typescript
// src/hooks/useAuth.ts - signOut
async function signOut() {
  // 1. Supabase 로그아웃
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error };
  }

  // 2. WebView 쿠키 삭제 (카카오 OAuth 세션 정리)
  try {
    await CookieManager.clearAll();
  } catch (cookieError) {
    console.error('쿠키 삭제 에러:', cookieError);
  }

  // 3. 온보딩 상태 보존
  const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

  // 4. 로컬 캐시 완전히 클리어
  queryClient.clear();  // React Query 캐시 클리어
  await AsyncStorage.clear();  // AsyncStorage 클리어

  // 5. 온보딩 상태 복원
  if (hasSeenOnboarding) {
    await AsyncStorage.setItem('hasSeenOnboarding', hasSeenOnboarding);
  }

  return {};
}
```

### 특징

- **완전한 세션 정리**: Supabase 세션뿐만 아니라 WebView 쿠키도 삭제
- **온보딩 상태 보존**: 사용자가 이미 본 온보딩은 다시 보지 않도록 보존
- **캐시 클리어**: React Query 캐시와 AsyncStorage를 완전히 클리어하여 다음 사용자 정보가 남지 않도록 함

<br/>

---

## 🔐 보안 고려사항

### 토큰 저장

- **AsyncStorage**: Supabase 클라이언트가 자동으로 `AsyncStorage`에 토큰 저장
- **암호화**: `react-native-encrypted-storage`를 사용하여 민감한 정보 암호화 가능 (현재는 사용하지 않음)

### 토큰 갱신

- **자동 갱신**: `autoRefreshToken: true`로 설정하여 만료 전 자동 갱신
- **백그라운드 처리**: 앱이 활성화될 때만 토큰 갱신하여 배터리 절약

### 세션 만료

- Supabase가 자동으로 토큰 만료 시간 관리
- 만료된 토큰으로 요청 시 자동으로 갱신 시도
- 갱신 실패 시 자동으로 로그아웃 처리

<br/>

---

## 📊 요약

### 로그인 방식 비교

| 방식 | 토큰 획득 | 프로필 생성 | 특징 |
|------|----------|-----------|------|
| **이메일/비밀번호** | Supabase 직접 인증 | 수동 생성 필요 | 가장 간단한 방식 |
| **Google** | Google ID Token → Supabase | 자동 UPSERT | 네이티브 모듈 사용 |
| **Kakao** | OAuth → 콜백 URL | 자동 UPSERT | WebView + 딥링크 |

### 공통 플로우

1. **인증 요청** → Supabase 서버에서 인증
2. **세션 생성** → Access Token + Refresh Token 생성
3. **로컬 저장** → AsyncStorage에 자동 저장
4. **프로필 로드** → `user_profiles` 테이블에서 프로필 조회
5. **캐시 저장** → React Query 캐시에 저장
6. **게스트 모드 해제** → AsyncStorage에서 `guestMode` 제거

### 세션 관리

- **자동 갱신**: 앱 활성화 시 자동으로 토큰 갱신
- **상태 감지**: `onAuthStateChange`로 로그인/로그아웃 상태 실시간 감지
- **영구 저장**: `persistSession: true`로 앱 재시작 후에도 로그인 상태 유지

<br/>

---

**마지막 업데이트**: 2025-01-XX  
**프로젝트**: Stickr  
**버전**: 0.0.1



