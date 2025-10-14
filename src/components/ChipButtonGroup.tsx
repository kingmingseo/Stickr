import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeMode, useThemeStore } from '../store/themeStore';
import { colors } from '../constants/colors';
import ChipButton from './ChipButton';

interface ChipButtonGroupProps {
  chips: string[];
  selectedChip?: string;
  onChipSelect?: (chip: string) => void;
  chipStyle?: 'rounded' | 'square';
  leftComponent?: React.ReactNode;
}

const ChipButtonGroup = ({
  chips,
  selectedChip,
  onChipSelect,
  chipStyle = 'rounded',
  leftComponent,
}: ChipButtonGroupProps) => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {leftComponent && <View>{leftComponent}</View>}
        {leftComponent && <View style={styles.divider} />}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          
        >
          {chips.map((chip, index) => (
            <ChipButton
              key={`${chip}-${index}`}
              label={chip}
              isSelected={selectedChip === chip}
              onPress={() => onChipSelect?.(chip)}
              chipStyle={chipStyle}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChipButtonGroup;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 6,
  },
  row: {
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors[theme].GRAY_200,
    marginHorizontal: 6,
  },
});
