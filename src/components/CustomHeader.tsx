import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';

const CustomHeader = () => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <Svg height="30" width="120" style={styles.logoContainer}>
        <Defs>
          <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#7C3AED" />
            <Stop offset="50%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </SvgLinearGradient>
        </Defs>
        <SvgText
          x="1"
          y="25"
          fontSize="30"
          fontWeight="bold"
          fill="url(#gradient)"
        >
          Stickr
        </SvgText>
      </Svg>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          navigation.navigate('SearchScreen');
        }}
      >
        <Icon name="search" size={20} color={colors[theme].MAIN_DARK_TEXT} />
      </TouchableOpacity>
    </View>
  );
};

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: colors[theme].WHITE,
  },
  logoContainer: {
    marginLeft: 0,
  },
  settingsButton: {
    padding: 8,
  },
});

export default CustomHeader;
