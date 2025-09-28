import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';

interface GeneralCustomButtonProps extends PressableProps {
  label: string | React.ReactNode;
  size: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  textColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
const GeneralCustomButton = ({
  label,
  size = 'large',
  style = null,
  backgroundColor = colors.light.GRAY_200,
  textColor = colors.light.MAIN_DARK_TEXT,
  leftIcon,
  rightIcon,
  ...props
}: GeneralCustomButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[size],
        { backgroundColor },
        style,
        pressed && styles.pressed,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <Text style={[styles[`${size}Text`], { color: textColor }]}>
          {label}
        </Text>
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </Pressable>
  );
};

export default GeneralCustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: '100%',
    height: 55,
  },
  small: {
    paddingHorizontal: 10,
    height: 35,
  },
  medium: {
    paddingHorizontal: 15,
    height: 40,
  },
  pressed: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  largeText: {
    fontSize: 14,
    color: colors.light.MAIN_DARK_TEXT,
    fontWeight: '600',
  },
  mediumText: {
    fontSize: 12,
    color: colors.light.MAIN_DARK_TEXT,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
    color: colors.light.MAIN_DARK_TEXT,
    fontWeight: '600',
  },
});
