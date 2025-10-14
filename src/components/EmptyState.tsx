import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

const EmptyState = ({ title = '표시할 스티커가 없어요', subtitle = '필터를 바꾸거나 다시 시도해 주세요' }: EmptyStateProps) => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default EmptyState;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    color: colors[theme].MAIN_DARK_TEXT,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: colors[theme].GRAY_400,
    fontSize: 13,
  },
});


