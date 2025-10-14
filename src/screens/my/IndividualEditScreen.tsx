import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../constants/colors';
import { ThemeMode, useThemeStore } from '../../store/themeStore';
import { Route, useNavigation, useRoute } from '@react-navigation/native';
import InputField from '../../components/InputField';
import GeneralCustomButton from '../../components/GeneralCustomButton';
import { useKeyboard } from '../../hooks/keyboard/useKeyboard';
import GradientButton from '../../components/GradientButton';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../../types/navigation';
import useGetProfile from '../../hooks/query/useGetProfile';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import useUpdateProfile from '../../hooks/query/useUpdateProfile';

// 한글 종성(받침) 유무 판단: 받침 있으면 true
function hasFinalConsonant(word: string) {
  if (!word) return false;
  const ch = word[word.length - 1];
  const code = ch.charCodeAt(0);
  // 한글 음절 범위: 가(0xAC00) ~ 힣(0xD7A3)
  if (code < 0xac00 || code > 0xd7a3) return false;
  return ((code - 0xac00) % 28) !== 0;
}



const IndividualEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();
  const { params } = useRoute<Route<string, { title: string }>>();
  const title = params.title.replace('변경', '').trim();
  const keyboardHeight = useKeyboard(300, -60);
  const objectParticle = hasFinalConsonant(title) ? '을' : '를';
  const [value, setValue] = useState('');
  const { user } = useSupabaseSession();
  const { data: profile } = useGetProfile(user?.id);
  const updateProfile = useUpdateProfile();

  const placeholderValue = (() => {
    if (title === '닉네임') return profile?.nickname ?? title;
    if (title === '자기소개') return profile?.bio ?? title;
    return title;
  })();

  const onSave = async () => {
    if (!profile?.id) return;
    const patch = title === '닉네임' ? { nickname: value } : { bio: value };
    try {
      await updateProfile.mutateAsync({ id: profile.id, patch });
      Toast.show({ type: 'appSuccess', text1: '변경 완료' });
      navigation.goBack();
    } catch (e) {
      Toast.show({ type: 'error', text1: '변경 실패' });
    }
  };

  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>새로운 {title}{objectParticle} 입력해주세요</Text>
      <InputField placeholder={placeholderValue} value={value} onChangeText={setValue} />
      <Animated.View
        style={[
          styles.buttonContainer,
          { top: Animated.multiply(keyboardHeight, -1) },
        ]}
      >
        {value.length <= 0 ? (
          <GeneralCustomButton label="저장" size="large" textColor={colors[theme].GRAY_300} disabled={true} />
        ) : (
          <GradientButton label="저장" size="large" onPress={onSave} />
        )}
      </Animated.View>
    </View>
  );
};

export default IndividualEditScreen;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors[theme].MAIN_DARK_TEXT,
    marginBottom: 16,
    paddingLeft: 4,
  },
  buttonContainer: {
    marginTop: 'auto',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors[theme].WHITE,
  },
});
