import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import RootNavigation from './src/navigations/RootNavigation';
import queryClient from './src/api/queryClient';
import {
  Linking,
  TouchableOpacity,
  View,
  Text,
  Platform,
  NativeModules,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import InstagramIcon from './src/assets/instagram.svg';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { colors } from './src/constants/colors';
import { useThemeStore } from './src/store/themeStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { supabase } from './src/api/supabaseClient';
// import useAuth from './src/hooks/useAuth';

const toastConfig = {
  successWithInstagram: () => (
    <View style={styles.toastContainer}>
      <View style={styles.toastRow}>
        <View style={styles.titleCol}>
          <Text style={styles.toastTitle}>복사 완료!</Text>
          <Text style={styles.toastSubtitle}>인스타그램 </Text>
          <Text style={styles.toastSubtitle}>바로가기 </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={async () => {
            try {
              // Android: 기존 태스크를 앞으로 가져옴 (편집 상태 유지 기대)
              if (
                Platform.OS === 'android' &&
                (NativeModules as any)?.AppSwitcher?.bringToForeground
              ) {
                console.log('Android: 기존 태스크를 앞으로 가져옴');
                try {
                  await (NativeModules as any).AppSwitcher.bringToForeground(
                    'com.instagram.android',
                  );
                  Toast.hide();
                  return;
                } catch {}
              }

              // iOS 또는 Android 폴백: 앱만 열기
              const appUrl = 'instagram://app';
              const canOpenApp = await Linking.canOpenURL(appUrl);
              if (canOpenApp) {
                await Linking.openURL(appUrl);
                Toast.hide();
                return;
              }

              // 2순위: 웹 브라우저 (폴백)
              await Linking.openURL('https://www.instagram.com/');
            } catch (error) {
              console.log('인스타그램 열기 실패:', error);
            }
            Toast.hide();
          }}
        >
          <LinearGradient
            colors={['#7C3AED', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.instagramButton}
          >
            <InstagramIcon width={18} height={18} color="#fff" fill="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  ),
  appSuccess: ({ text1 }: any) => (
    <View style={styles.appToastContainer}>
      <LinearGradient
        colors={['#7C3AED', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.appToastBg}
      >
        <Text style={styles.appToastText}>{text1 || '완료되었습니다'}</Text>
      </LinearGradient>
    </View>
  ),
  appError: ({ text1 }: any) => (
    <View style={styles.appToastContainer}>
      <View style={[styles.appToastBg, { backgroundColor: '#EF4444' }]}>
        <Text style={styles.appToastText}>{text1 || '오류가 발생했어요'}</Text>
      </View>
    </View>
  ),
};

function App() {
  // const { handleOAuthCallback } = useAuth();
  const theme = useThemeStore(s => s.theme);
  const loadTheme = useThemeStore(s => s.loadTheme);

  useEffect(() => {
    const prepare = async () => {
      // Google Sign-In 초기화
      GoogleSignin.configure({
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID, // 웹 클라이언트 ID
        offlineAccess: true,
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    prepare().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors[theme].WHITE }]}>
          <StatusBar
            barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={colors[theme].WHITE}
            translucent={false}
          />
          <RootNavigation />
          <Toast config={toastConfig} topOffset={60} bottomOffset={24} />
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastContainer: {
    width: '35%',
    alignSelf: 'flex-end',
    height: 120,
    backgroundColor: colors.light.PURPLE_400,
    borderRadius: 12,
    margin: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  toastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCol: {
    flexShrink: 1,
    paddingRight: 10,
  },
  toastTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toastSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  instagramButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  instagramGlyph: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  appToastContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  appToastBg: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  appToastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default App;
