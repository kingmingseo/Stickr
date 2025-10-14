import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';

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
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
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

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    backgroundColor: colors[theme].GRAY_200,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedContainer: {
    backgroundColor: colors[theme].PURPLE_400,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: colors[theme].MAIN_DARK_TEXT,
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
