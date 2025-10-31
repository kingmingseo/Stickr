import { StyleSheet, View, Keyboard } from 'react-native';
import React from 'react';
import InputField from './InputField';
import { useForm, Controller } from 'react-hook-form';
import GeneralCustomButton from './GeneralCustomButton';
import GradientButton from './GradientButton';
import ErrorPopup from './ErrorPopup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import useAuth from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useModal } from '../hooks/useModal';
import { useTranslation } from '../hooks/useTranslation';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit?: (data: any) => void;
  onFieldFocusForKeyboard?: (rect: { y: number; height: number }) => void;
}

const AuthForm = ({ mode, onFieldFocusForKeyboard }: AuthFormProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { isVisible, openModal, closeModal, title, message } = useModal();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const { signInWithEmail, signUpWithEmail, loading } = useAuth();

  const onSubmit = async (data: any) => {
    try {
      const { email, password, nickname, passwordConfirm } = data;

      // 회원가입 시 비밀번호 확인
      if (mode === 'signup' && password !== passwordConfirm) {
        openModal(
          t('passwordMismatch'),
          t('passwordMismatchMessage'),
        );
        return;
      }
      // 회원가입
      if (mode === 'signup') {
        const { error } = await signUpWithEmail({ email, password, nickname });
        if (error) {
          const errorMessage = getErrorMessage(error.message || error);
          openModal(t('signupFailed'), errorMessage);
        } else {
          openModal(
            t('verificationEmailSent'),
            t('verificationEmailMessage'),
          );
        }
      }
      // 로그인
      else {
        const { error } = await signInWithEmail({ email, password });
        if (error) {
          const errorMessage = getErrorMessage(error.message || error);
          openModal(t('loginFailed'), errorMessage);
          return;
        }

        // 키보드 닫기
        Keyboard.dismiss();

        // 게스트 모드 해제
        await AsyncStorage.removeItem('guestMode');

        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabNavigation' }],
        });
      }
    } catch (err) {

      openModal(
        t('errorOccurred'),
        t('unexpectedError'),
      );
    }
  };

  const getErrorMessage = (error: string): string => {
    console.log('error', error);
    switch (error) {
      case 'Invalid login credentials':
        return t('invalidCredentials');
      case 'Email not confirmed':
        return t('emailNotConfirmed');
      case 'User already registered':
        return t('userAlreadyRegistered');
      case 'Password should be at least 6 characters':
        return t('passwordTooShort');
      case 'Unable to validate email address: invalid format':
        return t('invalidEmailFormat');
      default:
        return error || t('unknownError');
    }
  };

  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="email"
        rules={{ required: t('emailRequired') }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            placeholder={t('email')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            onMeasureForKeyboard={onFieldFocusForKeyboard}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: t('passwordRequired') }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            placeholder={t('password')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            onMeasureForKeyboard={onFieldFocusForKeyboard}
          />
        )}
      />

      {mode === 'signup' && (
        <Controller
          control={control}
          name="passwordConfirm"
          rules={{ required: t('passwordConfirmRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              placeholder={t('passwordConfirm')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              onMeasureForKeyboard={onFieldFocusForKeyboard}
            />
          )}
        />
      )}
      {mode === 'signup' && (
        <Controller
          control={control}
          name="nickname"
          rules={{ required: t('nicknameRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              placeholder={t('nickname')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              onMeasureForKeyboard={onFieldFocusForKeyboard}
            />
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <GradientButton
          label={mode === 'login' ? t('login') : t('signup')}
          preset="purpleBlue"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
        {mode === 'login' && (
        <GeneralCustomButton
          label={t('startAsGuest')}
          size="large"
          onPress={() => {
            AsyncStorage.setItem('guestMode', '1');
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTabNavigation' }],
            });
          }}
        />)}
      </View>

      {/* 에러 팝업 */}
      <ErrorPopup
        visible={isVisible}
        onClose={closeModal}
        title={title}
        message={message}
        type={title.includes('성공') || title.includes('인증메일 전송') ? 'info' : 'error'}
      />
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  skip: {
    textAlign: 'center',
    color: '#8E8E8E',
  },
});
