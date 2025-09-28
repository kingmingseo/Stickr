import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';

interface ChipButtonProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  color?: string;
  chipStyle?: 'rounded' | 'square';
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ChipButton = ({
  label,
  isSelected = false,
  onPress,
  color,
  chipStyle = 'rounded',
  rightIcon,
  style,
}: ChipButtonProps) => {
  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        color && { backgroundColor: color },
        chipStyle === 'square' && styles.square,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.contentRow}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {label}
        </Text>
        {rightIcon ? <View style={styles.iconWrap}>{rightIcon}</View> : null}
      </View>
    </Pressable>
  );
};

export default ChipButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.GRAY_200,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedContainer: {
    backgroundColor: colors.light.PURPLE_400,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.MAIN_DARK_TEXT,
  },
  selectedText: {
    color: '#fff',
  },
  iconWrap: {
    marginLeft: 6,
  },
  square: {
    borderRadius: 5,
  },
});
