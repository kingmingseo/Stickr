import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownMenuProps = {
  visible: boolean;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  onDismiss: () => void;
  position?: { top: number; left: number; width?: number };
};

const DropdownMenu = ({
  visible,
  options,
  onSelect,
  onDismiss,
  position = { top: 0, left: 0, width: 160 },
}: DropdownMenuProps) => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onDismiss}>
      <View
        style={[
          styles.dropdownContainer,
          {
            top: position.top,
            left: position.left,
            width: position.width ?? 160,
          },
        ]}
      >
        {options.map(opt => (
          <Pressable
            key={opt.value}
            style={styles.dropdownItem}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={styles.dropdownText}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
  );
};

export default DropdownMenu;

const styling = (theme: ThemeMode) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    dropdownContainer: {
      position: 'absolute',
      backgroundColor: colors[theme].WHITE,
      borderRadius: 12,
      paddingVertical: 6,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 20,
      zIndex: 1001,
    },
    dropdownItem: {
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    dropdownText: {
      fontSize: 14,
      color: colors[theme].MAIN_DARK_TEXT,
    },
  });
