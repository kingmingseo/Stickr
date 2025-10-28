import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';
import ChipButton from './ChipButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../types/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { Profile } from '../types/profile';

interface ProfileCardProps {
  isAuthenticated: boolean;
  profile?: Profile;
}

const ProfileCard = ({ isAuthenticated, profile }: ProfileCardProps) => {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();
  const { t } = useTranslation();
  
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={
          profile?.avatar_url
            ? { uri: profile.avatar_url }
            : require('../assets/guest.png')
        }
      />
      <Text style={styles.text}>{profile?.nickname ?? t('guest')}</Text>
      {profile?.bio ? (
        <Text style={styles.subText} numberOfLines={2}>
          {profile.bio}
        </Text>
      ) : null}
      <ChipButton
        label={isAuthenticated ? t('editMyInfo') : t('guestMode')}
        color={colors[theme].GRAY_100}
        style={{ marginRight: 0 }}
        onPress={() => isAuthenticated && navigation.navigate('ProfileEditScreen')}
      />
      {/*{isAuthenticated && <MyInfo />}*/}
    </View>
  );
};

export default ProfileCard;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    width: '100%',
    backgroundColor: colors[theme].WHITE,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors[theme].MAIN_DARK_TEXT,
  },
  subText: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
    color: colors[theme].GRAY_400,
    textAlign: 'center',
  },
});
