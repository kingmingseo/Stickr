import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';

const MyInfo = () => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.myInfoContainer}>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoNumber, styles.copyNumber]}>100</Text>
        <Text style={styles.infoText}>복사한 스티커</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoNumber, styles.likeNumber]}>100</Text>
        <Text style={styles.infoText}>좋아요한 스티커</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoNumber, styles.uploadNumber]}>100</Text>
        <Text style={styles.infoText}>업로드한 스티커</Text>
      </View>
    </View>
  );
};

export default MyInfo;

const styling = (theme: ThemeMode) => StyleSheet.create({
  myInfoContainer: {
    overflow: 'hidden',
    borderRadius: 15,
    flexDirection: 'row',
    width: '100%',
    height: 100,
    backgroundColor: colors[theme].WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    width: '33.33%',
    height: 100,
    backgroundColor: colors[theme].WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors[theme].PURPLE_400,
  },
  infoText: {
    fontSize: 14,
    color: colors[theme].SUB_DARK_TEXT,
  },
  copyNumber: {
    color: colors[theme].PURPLE_400,
  },
  likeNumber: {
    color: '#60A5FA',
  },
  uploadNumber: {
    color: '#1D4ED8',
  },
});
