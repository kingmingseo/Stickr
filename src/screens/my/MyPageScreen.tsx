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
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGetProfile } from '../../hooks/query/useGetProfile';

const MyPageScreen = () => {
  const { signOut } = useAuth();
  const { user, isAuthenticated } = useSupabaseSession();
  const { data: profile } = useGetProfile(user?.id);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    '한국어' | 'English'
  >('한국어');
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isSupportModalVisible, setSupportModalVisible] = useState(false);
  console.log(profile);
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
    <View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileCard isAuthenticated={isAuthenticated} profile={profile} />

        {/* 설정 */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.sectionCard}>
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

            <Pressable style={styles.settingRow} onPress={handleLanguagePress}>
              <Text style={styles.settingLabel}>언어</Text>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>{selectedLanguage}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>다크 테마</Text>
              <Switch
                value={theme}
                onValueChange={setTheme}
                trackColor={{
                  false: colors.light.GRAY_300,
                  true: colors.light.PURPLE_400,
                }}
                thumbColor={colors.light.WHITE}
              />
            </View>
          </View>
        </View>

        {/* 기타 */}
        <View style={styles.otherSection}>
          <Text style={styles.sectionTitle}>기타</Text>
          <View style={styles.sectionCard}>
            <Pressable style={styles.settingRow} onPress={handleRatingPress}>
              <Text style={styles.settingLabel}>앱 평가하기</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            <Pressable style={styles.settingRow} onPress={handleSupportPress}>
              <Text style={styles.settingLabel}>고객 지원</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <MyPageButton
          label={isAuthenticated ? '로그아웃' : '로그인 하러 가기'}
          onPress={() => handleLogoutPress()}
          color={isAuthenticated ? colors.light.RED_500 : colors.light.BLUE_500}
          style={styles.logoutButton}
        />
      </ScrollView>

      {/* 언어 선택 바텀시트 */}
      <BottomSheet
        visible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title="언어 선택"
        items={[
          {
            label: '한국어',
            onPress: () => {
              setSelectedLanguage('한국어');
              setLanguageModalVisible(false);
            },
          },
          {
            label: 'English',
            onPress: () => {
              setSelectedLanguage('English');
              setLanguageModalVisible(false);
            },
          },
        ]}
      />

      {/* 고객 지원 바텀시트 */}
      <BottomSheet
        visible={isSupportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        title="고객 지원"
        items={[
          {
            label: '이메일 문의',
            onPress: () => {
              Linking.openURL('mailto:support@stickr.com');
              setSupportModalVisible(false);
            },
          },
          {
            label: '카카오톡 문의',
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

const styles = StyleSheet.create({
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
    color: colors.light.MAIN_DARK_TEXT,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.light.WHITE,
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
    borderBottomColor: colors.light.GRAY_200,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.MAIN_DARK_TEXT,
  },
  valueText: {
    fontSize: 14,
    color: colors.light.GRAY_400,
    marginRight: 4,
  },
  chevron: {
    fontSize: 30,
    color: colors.light.GRAY_400,
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
