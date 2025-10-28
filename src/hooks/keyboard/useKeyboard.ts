import { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Keyboard, Platform } from 'react-native';

type FieldRect = { y: number; height: number };

type UseKeyboardOptions = {
  duration?: number;
  extraOffset?: number;
};

export function useKeyboard(
  options: UseKeyboardOptions = {}
): [Animated.Value, (rect: FieldRect) => void] {
  const { duration = 300, extraOffset = 130 } = options;

  // UI를 움직일 Animated 값 (실제로는 위로 올릴 양)
  const translateAmount = useRef(new Animated.Value(0)).current;
  const focusedFieldRectRef = useRef<FieldRect | null>(null);
  const keyboardVisibleRef = useRef(false);
  const lastKeyboardHeightRef = useRef(0);
  const currentTranslateRef = useRef(0);

  const computeTargetTranslate = useCallback((kbHeight: number) => {
    const rect = focusedFieldRectRef.current;
    if (!rect) return kbHeight + extraOffset;
    const windowHeight = Dimensions.get('window').height;
    const keyboardTop = windowHeight - kbHeight;
    const fieldBottomMeasured = rect.y + rect.height;
    
    // 부모가 이미 올라가 있으면 측정값에 반영되어 있으므로, 기준 좌표로 환원
    const fieldBottomFromBase = fieldBottomMeasured + currentTranslateRef.current;
    const needed = fieldBottomFromBase + extraOffset - keyboardTop;
    return needed > 0 ? needed : 0;
  }, [extraOffset]);

  const animateTo = useCallback((toValue: number) => {
    // 애니메이션 시작 전에 목표값을 기억해 기준 좌표 계산의 일관성 보장
    currentTranslateRef.current = toValue;
    Animated.timing(translateAmount, {
      toValue,
      duration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false, // 레이아웃 변경 → false
    }).start(() => {
      currentTranslateRef.current = toValue;
    });
  }, [duration, translateAmount]);

  const setFocusedFieldRect = useCallback((rect: FieldRect) => {
    focusedFieldRectRef.current = rect;
    // 키보드가 열린 상태에서 포커스 이동 시 즉시 재계산
    if (keyboardVisibleRef.current) {
      const kbHeight = lastKeyboardHeightRef.current;
      const toValue = computeTargetTranslate(kbHeight);
      animateTo(toValue);
    }
  }, [computeTargetTranslate, animateTo]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      const kbHeight = e.endCoordinates.height;
      keyboardVisibleRef.current = true;
      lastKeyboardHeightRef.current = kbHeight;
      const toValue = computeTargetTranslate(kbHeight);
      animateTo(toValue);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardVisibleRef.current = false;
      lastKeyboardHeightRef.current = 0;
      currentTranslateRef.current = 0;
      animateTo(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [duration, translateAmount, extraOffset, computeTargetTranslate, animateTo]);

  return [translateAmount, setFocusedFieldRect];
}
