### InputField 키보드 스마트 스크롤 동작 정리

- **목표**: 포커스된 `InputField`가 키보드에 가려지지 않도록, 해당 필드의 절대 좌표를 기준으로 필요한 만큼만 부모 `Animated.View`를 위로 올린다.
- **핵심 구성**: `InputField`의 포커스 측정 → `AuthForm`을 통해 상위로 전달 → 화면에서 `useKeyboard({ smart: true })`에 연결 → 키보드 이벤트와 함께 최소 이동량만 애니메이션.

---

### 전체 흐름(Sequence)

1) 사용자가 `InputField`를 터치
- `onFocus` 발생 → 다음 프레임에서 `measureInWindow`로 절대 좌표 측정(`requestAnimationFrame`으로 레이아웃 안정화)
- 측정값 `{ y, height }`를 상위로 콜백 전달

2) `AuthForm`이 측정값을 상위 화면으로 그대로 전달
- 컨트롤러 내부 각 `InputField`에 `onMeasureForKeyboard` 전달

3) 화면(`AuthHomeScreen`)은 `useKeyboard({ smart: true })`의 setter에 측정값을 전달
- 훅은 내부에 포커스된 필드의 위치를 기억
- 키보드가 열려 있으면 즉시 “필요한 추가 이동량”을 재계산해 애니메이션

4) `useKeyboard`의 스마트 계산
- 키보드 표시/숨김 이벤트에서 높이/상태를 저장
- 이미 올라간 높이(`currentTranslateRef`)를 기준으로 측정값을 “기준 좌표”로 환원
- 키보드 상단과 필드 하단의 겹침 만큼만 추가로 올림

---

### 핵심 API: useKeyboard

```ts
// 오버로드 시그니처
export function useKeyboard(duration?: number, extraOffset?: number): Animated.Value;
export function useKeyboard(options: {
  duration?: number;
  extraOffset?: number;
  smart: true;
}): [Animated.Value, (rect: { y: number; height: number }) => void];
```

- **기본 모드**: `useKeyboard(300, 150)` → 키보드 높이 + 여유분만큼 올릴 `Animated.Value`를 반환
- **스마트 모드**: `useKeyboard({ smart: true, duration, extraOffset })` → `[Animated.Value, setFocusedFieldRect]` 반환
  - `setFocusedFieldRect({ y, height })`에 포커스된 필드의 절대 좌표를 전달하면, 겹치는 만큼만 올릴 값을 계산해 애니메이션

---

### 계산 로직(스마트 모드)

- 정의
  - \( windowHeight \): 화면 높이
  - \( kbHeight \): 키보드 높이
  - \( keyboardTop = windowHeight - kbHeight \)
  - \( fieldBottomMeasured = y + height \) (측정된 필드 하단)
  - \( currentTranslate \): 이미 올라가 있는 누적 이동값
  - \( fieldBottomFromBase = fieldBottomMeasured + currentTranslate \)
  - \( extraOffset \): 커서 위 여유 공간

- 목표 이동량
  - \( needed = fieldBottomFromBase + extraOffset - keyboardTop \)
  - 최종: \( toValue = \max(needed, 0) \)

- 의도
  - 이미 올라간 만큼을 고려해 “기준 좌표”로 환원하고, 키보드 상단과 겹치는 부분만큼만 추가로 올림.

---

### 코드 스니펫

1) `InputField`: 포커스 시 절대 좌표 측정 (rAF로 안정화 후 measure)

```tsx
// src/components/InputField.tsx (발췌)
onFocus={e => {
  props.onFocus?.(e);
  // 절대 좌표로 입력 위치 측정 (지연 호출로 레이아웃 안정화)
  requestAnimationFrame(() => {
    inputRef.current?.measureInWindow?.((x, y, width, height) => {
      onMeasureForKeyboard?.({ y, height });
    });
  });
}}
```

2) `AuthForm`: 각 필드가 측정값을 상위로 전파

```tsx
// src/components/AuthForm.tsx (발췌)
<InputField
  placeholder={t('email')}
  onBlur={onBlur}
  onChangeText={onChange}
  value={value}
  onMeasureForKeyboard={onFieldFocusForKeyboard}
/>
```

3) `AuthHomeScreen`: 스마트 모드 훅 사용 및 상단 컨테이너 이동 적용

```tsx
// src/screens/auth/AuthHomeScreen.tsx (발췌)
const [keyboardHeight, onFieldFocusForKeyboard] = useKeyboard({
  duration: 300,
  extraOffset: 200,
  smart: true,
});

<Animated.View
  style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: Animated.multiply(keyboardHeight, -1), // 키보드/필드 기준만큼 위로
    bottom: 0,
  }}
/>

<AuthForm mode={mode} onFieldFocusForKeyboard={onFieldFocusForKeyboard} />
```

4) `useKeyboard`: 스마트 계산과 애니메이션

```ts
// src/hooks/keyboard/useKeyboard.ts (발췌)
const computeTargetTranslate = useCallback((kbHeight: number) => {
  if (!isSmartMode) return kbHeight + extraOffset;
  const rect = focusedFieldRectRef.current;
  if (!rect) return kbHeight + extraOffset;
  const windowHeight = Dimensions.get('window').height;
  const keyboardTop = windowHeight - kbHeight;
  const fieldBottomMeasured = rect.y + rect.height;
  // 부모가 이미 올라가 있으면 측정값에 반영되어 있으므로, 기준 좌표로 환원
  const fieldBottomFromBase = fieldBottomMeasured + currentTranslateRef.current;
  const needed = fieldBottomFromBase + extraOffset - keyboardTop;
  return needed > 0 ? needed : 0;
}, [isSmartMode, extraOffset]);

const animateTo = useCallback((toValue: number) => {
  // 애니메이션 시작 전에 목표값을 기억해 기준 좌표 계산의 일관성 보장
  currentTranslateRef.current = toValue;
  Animated.timing(translateAmount, {
    toValue,
    duration,
    easing: Easing.out(Easing.exp),
    useNativeDriver: false,
  }).start(() => {
    currentTranslateRef.current = toValue;
  });
}, [duration, translateAmount]);
```

---

### 파라미터 튜닝 가이드

- **extraOffset**: 필드/커서 위 여유 공간. 140~220 범위에서 장치/폰트/여백에 맞춰 조정.
- **duration**: 애니메이션 시간(ms). 250~320ms 권장.

---

### 에지 케이스/주의사항

- 포커스 이동이 잦아도 `setFocusedFieldRect`가 즉시 재계산을 트리거 → 위치 안정.
- iOS: `keyboardWillShow/Hide`, Android: `keyboardDidShow/Hide` 사용으로 플랫폼 타이밍 차이 대응.
- 측정 시점은 rAF 이후(레이아웃 확정)로 수행해야 정확.

---

### 다른 화면에 적용하기

1) 화면 컴포넌트에서 스마트 모드로 훅 사용
```ts
const [keyboardHeight, onFieldFocusForKeyboard] = useKeyboard({ smart: true, duration: 300, extraOffset: 180 });
```
2) 상단(또는 이동 대상) 컨테이너를 `top: -keyboardHeight`로 바인딩
3) 폼 컴포넌트에 `onFieldFocusForKeyboard`를 전달 → 각 `InputField`에 `onMeasureForKeyboard` 연결

---

### 트러블슈팅 체크리스트

- 필드가 여전히 살짝 가려지면: `extraOffset`을 10~20 단위로 증가
- 과도하게 올라간다면: `extraOffset`을 10~20 단위로 감소
- 특정 기기에서만 어긋나면: 화면 안전영역(상/하단 인셋), 폰트 크기/스케일(allowFontScaling), 시스템 내비게이션 바 높이 영향 여부 확인


