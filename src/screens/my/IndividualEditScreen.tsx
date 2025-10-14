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
import { useTranslation } from '../../hooks/useTranslation';

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
  const { t, language } = useTranslation();
  
  // Extract the actual field type from title
  const isNickname = params.title === t('changeNickname');
  const isBio = params.title === t('changeBio');
  
  const keyboardHeight = useKeyboard(300, -60);
  const [value, setValue] = useState('');
  const { user } = useSupabaseSession();
  const { data: profile } = useGetProfile(user?.id);
  const updateProfile = useUpdateProfile();

  const placeholderValue = (() => {
    if (isNickname) return profile?.nickname ?? t('nickname');
    if (isBio) return profile?.bio ?? t('bioPlaceholder');
    return '';
  })();
  
  const titleText = isNickname ? t('enterNewNickname') : t('enterNewBio');

  const onSave = async () => {
    if (!profile?.id) return;
    const patch = isNickname ? { nickname: value } : { bio: value };
    try {
      await updateProfile.mutateAsync({ id: profile.id, patch });
      Toast.show({ type: 'appSuccess', text1: t('updateComplete') });
      navigation.goBack();
    } catch (e) {
      Toast.show({ type: 'error', text1: t('updateFailed') });
    }
  };

  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleText}</Text>
      <InputField placeholder={placeholderValue} value={value} onChangeText={setValue} />
      <Animated.View
        style={[
          styles.buttonContainer,
          { top: Animated.multiply(keyboardHeight, -1) },
        ]}
      >
        {value.length <= 0 ? (
          <GeneralCustomButton label={t('save')} size="large" textColor={colors[theme].GRAY_300} disabled={true} />
        ) : (
          <GradientButton label={t('save')} size="large" onPress={onSave} />
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
