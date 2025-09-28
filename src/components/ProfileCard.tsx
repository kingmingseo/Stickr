import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import ChipButton from './ChipButton';
import MyInfo from './MyInfo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../types/navigation';
import type { Profile } from '../store/profileStore';

interface ProfileCardProps {
  isAuthenticated: boolean;
  profile?: Profile;
}

const ProfileCard = ({ isAuthenticated, profile }: ProfileCardProps) => {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();
  
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={
          profile?.avatar_url
            ? { uri: profile.avatar_url }
            : require('../assets/Stickr.png')
        }
      />
      <Text style={styles.text}>{profile?.nickname ?? '게스트'}</Text>
      {profile?.bio ? (
        <Text style={styles.subText} numberOfLines={2}>
          {profile.bio}
        </Text>
      ) : null}
      <ChipButton
        label={isAuthenticated ? "내 정보 수정" : "게스트 모드"}
        color={colors.light.GRAY_100}
        style={{ marginRight: 0 }}
        onPress={() => isAuthenticated && navigation.navigate('ProfileEditScreen')}
      />
      {isAuthenticated && <MyInfo />}
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    width: '100%',
    backgroundColor: colors.light.WHITE,
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
    color: colors.light.MAIN_DARK_TEXT,
  },
  subText: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
    color: colors.light.GRAY_400,
    textAlign: 'center',
  },
});
