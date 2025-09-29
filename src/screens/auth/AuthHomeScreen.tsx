import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform } from 'react-native';
import React, { useState } from 'react';
import GeneralCustomButton from '../../components/GeneralCustomButton';
import { colors } from '../../constants/colors';
import KakaoIcon from '../../assets/Kakao.svg';
import TabButton from '../../components/TabButton';
import AuthForm from '../../components/AuthForm';
import { useKeyboard } from '../../hooks/keyboard/useKeyboard';
import useAuth from '../../hooks/useAuth';
import OAuthWebView from '../../components/OAuthWebView';

const AuthHomeScreen = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { height } = useWindowDimensions();
  const isSmallScreen = height < 740;
  const imageSize = isSmallScreen ? 84 : 120;
  const verticalGap = isSmallScreen ? 6 : 12;
  const keyboardHeight = useKeyboard(300, 150);
  const { 
    signInWithGoogle, 
    loading, 
    signInWithKakao,
    isVisible,
    oauthUrl,
    closeModal,
    handleOAuthWebViewCallback,
  } = useAuth();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: Animated.multiply(keyboardHeight, -1), // 키보드 높이만큼 위로
        bottom: 0,
        backgroundColor: 'white', // 필요 시 배경색
      }}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/Stickr.png')}
            style={[styles.image, { width: imageSize, height: imageSize }]}
            resizeMode="contain"
          />
          <View
            style={[
              styles.imageTextContainer,
              { marginTop: isSmallScreen ? 6 : 12 },
            ]}
          >
            <Text
              style={styles.imageText}
              allowFontScaling={false}
              numberOfLines={1}
            >
              Stickr
            </Text>
            <Text
              style={styles.imageSubText}
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              스티커를 활용해 인스타 스토리 꾸미기!
            </Text>
          </View>
        </View>
        <View style={[styles.buttonContainer, { gap: verticalGap }]}>
          <TabButton
            options={[
              { label: '로그인', value: 'login' },
              { label: '회원가입', value: 'signup' },
            ]}
            value={mode}
            onChange={v => setMode(v as 'login' | 'signup')}
          />
          {Platform.OS === 'ios' && (
            <GeneralCustomButton
              leftIcon={
                <Icon name="apple" size={18} color={colors.light.WHITE} />
              }
              label={mode === 'signup' ? 'Apple로 회원가입하기' : 'Apple로 로그인하기'}
              size="large"
              backgroundColor={colors.light.BLACK}
              textColor={colors.light.WHITE}
              onPress={() => {}}
            />
          )}
          {Platform.OS === 'android' && (
            <GeneralCustomButton
              leftIcon={
                <View style={styles.googleIconContainer}>
                  <Icon name="google" size={20} color="#4285F4" />
                </View>
              }
              label={mode === 'signup' ? 'Google로 회원가입하기' : 'Google로 로그인하기'}
              size="large"
              backgroundColor={colors.light.WHITE}
              textColor={colors.light.MAIN_DARK_TEXT}
              style={styles.googleButton}
              disabled={loading}
              onPress={async () => {
                await signInWithGoogle();
              }}
            />
          )}
          <GeneralCustomButton
            label={mode === 'signup' ? '카카오로 회원가입하기' : '카카오로 로그인하기'}
            size="large"
            backgroundColor="#FEE500"
            textColor="rgba(0, 0, 0, 0.85)"
            leftIcon={<KakaoIcon width={18} height={18} />}
            onPress={async () => {
              console.log('카카오로 로그인 시작');
              console.log(await signInWithKakao());
            }}
          />
          {mode === 'login' && <Text style={styles.skip}>또는</Text>}
          <AuthForm mode={mode} />
        </View>
      </View>
      
      <OAuthWebView
        visible={isVisible}
        url={oauthUrl}
        onClose={() => closeModal()}
        onSuccess={async (callbackUrl) => {
          await handleOAuthWebViewCallback( callbackUrl );
        }}
      />
    </Animated.View>
  );
};

export default AuthHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.light.WHITE,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  buttonContainer: {
    flex: 1,
  },
  skip: {
    textAlign: 'center',
    color: '#8E8E8E',
  },
  formContainer: {
    flex: 0.4,
  },
  guestButton: {
    color: colors.light.GRAY_100,
  },
  imageTextContainer: {
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.MAIN_DARK_TEXT,
    textAlign: 'center',
    marginBottom: 4,
  },
  imageSubText: {
    fontSize: 16,
    color: colors.light.GRAY_400,
    textAlign: 'center',
    lineHeight: 22,
  },
  googleButton: {
    borderWidth: 0.5,
    borderColor: '#dadce0',
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
