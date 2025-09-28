import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import type { PressableProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, gradients } from '../constants/colors';

type GradientPreset = keyof typeof gradients;

interface GradientButtonProps extends PressableProps {
  label: string | React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  preset?: GradientPreset; // 그라데이션 팔레트 키
  loading?: boolean;
}

const GradientButton = ({
  label,
  size = 'large',
  style,
  preset = 'purpleBlue',
  loading,
  ...props
}: GradientButtonProps) => {
  const gradientColors = [...gradients[preset]];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[size],
        style,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
      disabled={loading}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={gradientColors.length === 3 ? [0, 0.48, 1] : undefined}
        style={[styles.gradient, styles[size]]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : typeof label === 'string' ? (
          <Text style={styles[`${size}Text`]}>{label}</Text>
        ) : (
          label
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  large: {
    width: '100%',
    height: 55,
  },
  medium: {
    paddingHorizontal: 15,
    height: 40,
  },
  small: {
    paddingHorizontal: 10,
    height: 35,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  largeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  mediumText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  smallText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 10,
  },
});

export default GradientButton;
