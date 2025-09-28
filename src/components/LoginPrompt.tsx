import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import GradientButton from './GradientButton';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

const LoginPrompt = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLoginPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthNavigation' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인이 필요해요</Text>
        <Text style={styles.description}>
          즐겨찾기 기능을 사용하려면{'\n'}로그인해주세요
        </Text>
        <GradientButton
          label="로그인하기"
          onPress={handleLoginPress}
          style={styles.loginButton}
        />
      </View>
    </View>
  );
};

export default LoginPrompt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.MAIN_DARK_TEXT,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.light.GRAY_500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loginButton: {
    width: 200,
  },
});
