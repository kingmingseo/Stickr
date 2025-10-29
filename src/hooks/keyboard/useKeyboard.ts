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
  const translateAmount = useRef(new Animated.Value(0)).current; // → 화면을 올릴 양 (픽셀 단위)
  
  const focusedFieldRectRef = useRef<FieldRect | null>(null); // → 현재 포커스된 필드의 위치 { y: number, height: number }
  const keyboardVisibleRef = useRef(false); // → 키보드가 현재 보이는지 여부
  const lastKeyboardHeightRef = useRef(0); // → 마지막 키보드 높이
  const currentTranslateRef = useRef(0); // → 현재 화면이 올라간 양 (기준 좌표 계산용)

  const computeTargetTranslate = useCallback((kbHeight: number) => {
    const rect = focusedFieldRectRef.current;
    if (!rect) return kbHeight + extraOffset;
    const windowHeight = Dimensions.get('window').height;  //화면 높이
    const keyboardTop = windowHeight - kbHeight;   // 키보드 상단 위치
    const fieldBottomMeasured = rect.y + rect.height;   // 필드 하단 위치 (측정된 값)
    
    // 부모가 이미 올라가 있으면 측정값에 반영되어 있으므로, 기준 좌표로 환원
    const fieldBottomFromBase = fieldBottomMeasured + currentTranslateRef.current;   // 이미 올라간 만큼 반영 (기준 좌표로 환원)
    const needed = fieldBottomFromBase + extraOffset - keyboardTop;   // 필요한 이동량 계산
    return needed > 0 ? needed : 0;
  }, [extraOffset]);

  const animateTo = useCallback((toValue: number) => {
    // 애니메이션 완료 후에만 currentTranslateRef를 업데이트하여
    // 애니메이션 진행 중 새로운 필드 측정 시 올바른 기준 좌표 사용
    Animated.timing(translateAmount, {
      toValue,
      duration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false, // 레이아웃 변경 → false
    }).start(() => {
      currentTranslateRef.current = toValue;
    });
  }, [duration, translateAmount]);


  const calculate = useCallback(() => {
    const kbHeight = lastKeyboardHeightRef.current;
    const toValue = computeTargetTranslate(kbHeight);
    animateTo(toValue);
  }, [computeTargetTranslate, animateTo]);

  const setFocusedFieldRect = useCallback((rect: FieldRect) => {
    focusedFieldRectRef.current = rect;
    calculate();  // 간단하게 계산 함수 호출
  }, [calculate]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      const kbHeight = e.endCoordinates.height;
      keyboardVisibleRef.current = true;
      lastKeyboardHeightRef.current = kbHeight;
      calculate();  
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardVisibleRef.current = false;
      lastKeyboardHeightRef.current = 0;
      // currentTranslateRef는 animateTo의 완료 콜백에서 설정됨 (애니메이션 완료 후)
      animateTo(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [calculate, animateTo]);

  return [translateAmount, setFocusedFieldRect];
}
