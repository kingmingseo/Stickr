import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ThemeMode, useThemeStore } from '../store/themeStore';

interface MyPageButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  gradientColors?: string[];
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

const MyPageButton = ({ label, onPress, color, gradientColors, style }: MyPageButtonProps) => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  const renderText = () => {
    if (gradientColors) {
      return (
        <MaskedView
          style={styles.maskedView}
          maskElement={<Text style={[styles.text, styles.maskText]}>{label}</Text>}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </MaskedView>
      );
    }
    
    return <Text style={[styles.text, color && { color }]}>{label}</Text>;
  };

  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      {renderText()}
    </Pressable>
  );
};  

export default MyPageButton;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors[theme].WHITE,
    padding: 10,
  },
  text: {
    color: colors[theme].MAIN_DARK_TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  maskedView: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
  },
  maskText: {
    backgroundColor: 'transparent',
    color: 'black',
  },
  gradient: {
    flex: 1,
    height: 20,
  },
});
