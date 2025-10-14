import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Linking,
  Switch,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import ProfileCard from '../../components/ProfileCard';
import { colors } from '../../constants/colors';
import MyPageButton from '../../components/MyPageButton';
import BottomSheet from '../../components/BottomSheet';
import useAuth from '../../hooks/useAuth';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import { ThemeMode, useThemeStore } from '../../store/themeStore';
import { useLanguageStore } from '../../store/languageStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import useGetProfile from '../../hooks/query/useGetProfile';


const MyPageScreen = () => {
  const { signOut } = useAuth();
  const { user, isAuthenticated } = useSupabaseSession();
  const { data: profile } = useGetProfile(user?.id);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isSupportModalVisible, setSupportModalVisible] = useState(false);

  // 테마
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  const toggleTheme = useThemeStore(s => s.toggleTheme);

  // 언어
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  
  // 현재 언어 표시용
  const currentLanguageLabel = language === 'korean' ? '한국어' : 'English';

  const handleLanguagePress = () => {
    setLanguageModalVisible(true);
  };

  const handleRatingPress = () => {
    Linking.openURL('https://apps.apple.com');
  };

  const handleSupportPress = () => {
    setSupportModalVisible(true);
  };

  const handleLogoutPress = () => {
    if (isAuthenticated) {
      signOut();
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthNavigation' }],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileCard isAuthenticated={isAuthenticated} profile={profile} />

        {/* 설정 */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          <View style={styles.sectionCard}>
            {/* 알림 기능 추가 예정 
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>알림</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: colors.light.GRAY_300,
                  true: colors.light.PURPLE_400,
                }}
                thumbColor={colors.light.WHITE}
              />
            </View>
            */}

            <Pressable style={styles.settingRow} onPress={handleLanguagePress}>
              <Text style={styles.settingLabel}>{t('languageSettings')}</Text>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>{currentLanguageLabel}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>

            <View style={[styles.settingRow, styles.noBorder]}>
              <Text style={styles.settingLabel}>{t('themeSettings')}</Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors[theme].GRAY_300,
                  true: colors[theme].PURPLE_400,
                }}
                thumbColor={colors[theme].WHITE}
              />
            </View>
          </View>
        </View>

        {/* 기타 */}
        <View style={styles.otherSection}>
          <Text style={styles.sectionTitle}>
            {language === 'korean' ? '기타' : 'Others'}
          </Text>
          <View style={styles.sectionCard}>
            <Pressable style={styles.settingRow} onPress={handleRatingPress}>
              <Text style={styles.settingLabel}>
                {language === 'korean' ? '앱 평가하기' : 'Rate App'}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            <Pressable
              style={[styles.settingRow, styles.noBorder]}
              onPress={handleSupportPress}
            >
              <Text style={styles.settingLabel}>
                {language === 'korean' ? '고객 지원' : 'Support'}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <MyPageButton
          label={isAuthenticated ? t('logout') : t('login')}
          onPress={() => handleLogoutPress()}
          color={isAuthenticated ? colors[theme].RED_500 : colors[theme].BLUE_500}
          style={styles.logoutButton}
        />
      </ScrollView>

      {/* 언어 선택 바텀시트 */}
      <BottomSheet
        visible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title={language === 'korean' ? '언어 선택' : 'Select Language'}
        items={[
          {
            label: '한국어',
            onPress: () => {
              setLanguage('korean');
              setLanguageModalVisible(false);
            },
          },
          {
            label: 'English',
            onPress: () => {
              setLanguage('english');
              setLanguageModalVisible(false);
            },
          },
        ]}
      />

      {/* 고객 지원 바텀시트 */}
      <BottomSheet
        visible={isSupportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        title={language === 'korean' ? '고객 지원' : 'Support'}
        items={[
          {
            label: language === 'korean' ? '이메일 문의' : 'Email Support',
            onPress: () => {
              Linking.openURL('mailto:support@stickr.com');
              setSupportModalVisible(false);
            },
          },
          {
            label: language === 'korean' ? '카카오톡 문의' : 'KakaoTalk Support',
            onPress: () => {
              Linking.openURL('https://pf.kakao.com');
              setSupportModalVisible(false);
            },
          },
        ]}
      />
    </View>
  );
};

export default MyPageScreen;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].GRAY_100,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 14,
  },
  settingsSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  otherSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors[theme].MAIN_DARK_TEXT,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors[theme].WHITE,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors[theme].GRAY_200,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors[theme].MAIN_DARK_TEXT,
  },
  valueText: {
    fontSize: 14,
    color: colors[theme].GRAY_400,
    marginRight: 4,
  },
  chevron: {
    fontSize: 30,
    color: colors[theme].GRAY_400,
    marginLeft: 8,
    marginBottom: 5,
  },
  settingButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 20,
  },
});
