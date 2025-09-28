import { useEffect, useRef } from 'react';
import { Animated, Easing, Keyboard, Platform } from 'react-native';

export function useKeyboard(duration: number = 300, extraOffset: number = 130) {
  // UI를 움직일 Animated 값 (키보드 높이 저장)
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height + extraOffset,
        duration,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false, // 레이아웃 변경 → false
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [duration, keyboardHeight, extraOffset]);

  return keyboardHeight;
}
