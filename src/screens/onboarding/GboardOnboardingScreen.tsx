import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { ThemeMode, useThemeStore } from '../../store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useTranslation } from '../../hooks/useTranslation';
import GradientButton from '../../components/GradientButton';
import GeneralCustomButton from '../../components/GeneralCustomButton';
import useSupabaseSession from '../../hooks/useSupabaseSession';

const GBOARD_PACKAGE_NAME = 'com.google.android.inputmethod.latin';
const GBOARD_PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${GBOARD_PACKAGE_NAME}`;
const GBOARD_PAGES_COUNT = 8; // Gboard 관련 페이지 수

const GboardOnboardingScreen = () => {
  const { t } = useTranslation();
  const { width } = Dimensions.get('window');
  const pageWidth = width;
  const [page, setPage] = useState(0);
  const ref = useRef<FlatList>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const theme = useThemeStore(s => s.theme);
  const { isAuthenticated } = useSupabaseSession();

  const pages = useMemo(
    () => [
      // Gboard 설치 및 설정 단계 (8페이지)
      {
        key: '1',
        title: t('gboardOnboardingTitle'),
        subtitle: t('gboardOnboardingSubtitle'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/1.png'),
        },
        showInstallButton: true,
      },
      {
        key: '2',
        title: t('gboardInstallTitle1'),
        subtitle: t('gboardSetupSubtitle'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/2.png'),
        },
      },
      {
        key: '3',
        title: t('gboardInstallTitle2'),
        subtitle: t('gboardSetupSubtitle2'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/3.png'),
        },
      },
      {
        key: '4',
        title: t('gboardInstallTitle3'),
        subtitle: t('gboardSetupSubtitle3'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/4.png'),
        },
      },
      {
        key: '5',
        title: t('gboardInstallTitle4'),
        subtitle: t('gboardSetupSubtitle4'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/5.png'),
        },
      },
      {
        key: '6',
        title: t('gboardInstallTitle5'),
        subtitle: t('gboardSetupSubtitle5'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/6.png'),
        },
      },
      {
        key: '7',
        title: t('gboardInstallTitle6'),
        subtitle: t('gboardSetupSubtitle6'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/7.png'),
        },
      },
      {
        key: '8',
        title: t('gboardInstallTitle7'),
        subtitle: t('gboardSetupCompleteSubtitle'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/8.png'),
        },
      },
      // 서비스 온보딩 (3페이지)
      {
        key: '9',
        title: t('onboarding1Title'),
        subtitle: t('onboarding1Subtitle'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/9.png'),
        },
      },
      {
        key: '10',
        title: t('onboarding2Title'),
        subtitle: t('onboarding2Subtitle'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/10.png'),
        },
      },
      {
        key: '11',
        title: t('onboarding3Title'),
        subtitle: t('onboarding3Subtitle'),
        media: {
          type: 'image',
          source: require('../../assets/onboarding/11.png'),
        },
      },
    ],
    [t],
  );

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    setPage(Math.round(x / pageWidth));
  };

  const handleInstallGboard = async () => {
    try {
      const supported = await Linking.canOpenURL(GBOARD_PLAY_STORE_URL);
      if (supported) {
        await Linking.openURL(GBOARD_PLAY_STORE_URL);
      } else {
        Alert.alert(t('error'), 'Play Store를 열 수 없습니다.');
      }
    } catch (error) {
      Alert.alert(t('error'), '링크를 열 수 없습니다.');
    }
  };

  const goNext = async () => {
    if (page < pages.length - 1) {
      ref.current?.scrollToIndex({ index: page + 1, animated: true });
    } else {
      // 마지막 페이지에서 완료 버튼을 누르면 앱으로 이동
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    // 온보딩 완료 표시
    await AsyncStorage.setItem('hasSeenOnboarding', '1');

    if (isAuthenticated || (await AsyncStorage.getItem('guestMode')) === '1') {
      // 로그인되어 있거나 게스트 모드면 메인으로
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabNavigation' }],
      });
    } else {
      // 비로그인이면 로그인 화면으로
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthNavigation' }],
      });
    }
  };

  const handleSkip = () => {
    // Gboard 설정을 건너뛰고 서비스 온보딩으로 이동
    ref.current?.scrollToIndex({ index: GBOARD_PAGES_COUNT, animated: true });
  };

  const styles = styling(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 건너뛰기 버튼 - Gboard 페이지에서만 표시 */}
      {page < GBOARD_PAGES_COUNT && (
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t('skip')}</Text>
        </Pressable>
      )}

      <FlatList
        ref={ref}
        data={pages}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: pageWidth }]}>
            <View style={styles.media}>
              <Image
                source={item.media.source}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              {/* 설치 버튼 페이지 */}
              {item.showInstallButton && (
                <Pressable
                  style={styles.installTextButton}
                  onPress={handleInstallGboard}
                >
                  <Text style={styles.installTextButtonText}>
                    {t('installGboard')}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        {/* 인디케이터 */}
        <View style={styles.indicatorContainer}>
          {page < GBOARD_PAGES_COUNT
            ? // Gboard 페이지 인디케이터 (8개)
              Array.from({ length: GBOARD_PAGES_COUNT }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === page && styles.dotActive]}
                />
              ))
            : // 서비스 온보딩 페이지 인디케이터 (3개)
              Array.from({ length: pages.length - GBOARD_PAGES_COUNT }).map(
                (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === page - GBOARD_PAGES_COUNT && styles.dotActive,
                    ]}
                  />
                ),
              )}
        </View>

        {/* 버튼 */}
        <View style={styles.ctaContainer}>
          {page === pages.length - 1 ? (
            <GradientButton
              label={t('start')}
              size="large"
              preset="purpleBlue"
              onPress={goNext}
            />
          ) : (
            <GeneralCustomButton
              label={t('continue')}
              size="large"
              backgroundColor={colors[theme].PURPLE_400}
              textColor={colors[theme].WHITE}
              onPress={goNext}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GboardOnboardingScreen;

const styling = (theme: ThemeMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].WHITE,
    },
    skipButton: {
      position: 'absolute',
      top: 8,
      right: 16,
      zIndex: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    skipText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors[theme].PURPLE_400,
      letterSpacing: -0.3,
    },
    page: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 160, // footer 공간 확보
      justifyContent: 'center',
    },
    media: {
      flex: 1,
      marginHorizontal: 20,
      marginVertical: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    textBlock: {
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingTop: 24,
      paddingBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors[theme].MAIN_DARK_TEXT,
      textAlign: 'center',
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors[theme].GRAY_500 || colors[theme].GRAY_400,
      textAlign: 'center',
      lineHeight: 22,
      letterSpacing: -0.2,
    },
    installTextButton: {
      marginTop: 24,
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    installTextButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors[theme].PURPLE_400,
      textDecorationLine: 'underline',
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 20,
      paddingTop: 16,
      backgroundColor: colors[theme].WHITE,
      borderTopWidth: 1,
      borderTopColor: colors[theme].GRAY_100 || '#F5F5F5',
    },
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors[theme].GRAY_200,
    },
    dotActive: {
      backgroundColor: colors[theme].PURPLE_400,
      width: 24,
    },
    ctaContainer: {
      paddingHorizontal: 20,
    },
  });
