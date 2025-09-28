import { StyleSheet, View, Text } from 'react-native';
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

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit?: (data: any) => void;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
          '비밀번호 불일치',
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        );
        return;
      }
      // 회원가입
      if (mode === 'signup') {
        const { error } = await signUpWithEmail({ email, password, nickname });
        if (error) {
          const errorMessage = getErrorMessage(error.message || error);
          openModal('회원가입 실패', errorMessage);
        } else {
          openModal(
            '인증메일 전송',
            '이메일을 확인하여 계정을 활성화해주세요.',
          );
        }
      }
      // 로그인
      else {
        const { error } = await signInWithEmail({ email, password });
        if (error) {
          const errorMessage = getErrorMessage(error.message || error);
          openModal('로그인 실패', errorMessage);
          return;
        }

        // 게스트 모드 해제
        await AsyncStorage.removeItem('guestMode');

        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabNavigation' }],
        });
      }
    } catch (err) {

      openModal(
        '오류 발생',
        '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  const getErrorMessage = (error: string): string => {
    console.log('error', error);
    switch (error) {
      case 'Invalid login credentials':
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 'Email not confirmed':
        return '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.';
      case 'User already registered':
        return '이미 가입된 이메일입니다.';
      case 'Password should be at least 6 characters':
        return '비밀번호는 최소 6자 이상이어야 합니다.';
      case 'Unable to validate email address: invalid format':
        return '올바른 이메일 형식을 입력해주세요.';
      default:
        return error || '알 수 없는 오류가 발생했습니다.';
    }
  };

  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="email"
        rules={{ required: '이메일을 입력해주세요' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            placeholder="이메일 주소"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: '비밀번호를 입력해주세요' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            placeholder="비밀번호"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />

      {mode === 'signup' && (
        <Controller
          control={control}
          name="passwordConfirm"
          rules={{ required: '비밀번호 확인을 입력해주세요' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              placeholder="비밀번호 확인"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
      )}
      {mode === 'signup' && (
        <Controller
          control={control}
          name="nickname"
          rules={{ required: '닉네임을 입력해주세요 ' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              placeholder="닉네임"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <GradientButton
          label={mode === 'login' ? '로그인' : '회원가입'}
          preset="purpleBlue"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
        {mode === 'login' && (
          <Text style={styles.skip}>아이디 혹은 비밀번호를 잊으셨나요?</Text>
        )}
        <GeneralCustomButton
          label="게스트로 시작하기"
          size="large"
          onPress={() => {
            AsyncStorage.setItem('guestMode', '1');
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTabNavigation' }],
            });
          }}
        />
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
