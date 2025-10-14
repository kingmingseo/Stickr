import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';
import { useTranslation } from '../hooks/useTranslation';

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  const theme = useThemeStore(s => s.theme);
  const { t } = useTranslation();
  const styles = styling(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || t('noStickers')}</Text>
      <Text style={styles.subtitle}>{subtitle || t('noStickersSubtitle')}</Text>
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


