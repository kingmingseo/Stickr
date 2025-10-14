import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import { ThemeMode, useThemeStore } from '../../store/themeStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../../types/navigation';
import useGetProfile from '../../hooks/query/useGetProfile';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import { useModal } from '../../hooks/useModal';
import BottomSheet from '../../components/BottomSheet';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useUpdateProfileImage } from '../../hooks/query/useUpdateProfileImage';
import Toast from 'react-native-toast-message';
import { useTranslation } from '../../hooks/useTranslation';

const ProfileEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();
  const {user} = useSupabaseSession();
  const { data: profile } = useGetProfile(user?.id);
  const { t } = useTranslation();
  const { openModal, closeModal, isVisible } = useModal();
  const { pickImage } = useImagePicker();
  const updateProfileImageMutation = useUpdateProfileImage();

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    closeModal();

    try {
      const imageUri = await pickImage(type);
      if (imageUri) {
        console.log('이미지 선택됨:', imageUri);

        // TanStack Query mutation으로 이미지 업로드
        await updateProfileImageMutation.mutateAsync(imageUri);
        
        // 성공 메시지 표시
        Toast.show({
          type: 'appSuccess',
          text1: t('profileImageUpdated'),
        });
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Toast.show({
        type: 'appError',
        text1: t('imageUploadFailed'),
      });
    }
  };

  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <View style={styles.profileImageWrapper}>
        <Image
          source={
            profile?.avatar_url
              ? { uri: profile.avatar_url }
              : require('../../assets/Stickr.png')
          }
          style={styles.profileImage}
          resizeMode="cover"
        />
        <Pressable
          style={styles.cameraButton}
          onPress={() => {
            openModal(t('changeProfilePhoto'), t('changeProfilePhoto'));
          }}
        >
          <Icon name="camera" size={16} color={colors[theme].MAIN_DARK_TEXT} />
        </Pressable>
      </View>
      <View style={styles.profileInfo}>
        <Pressable
          style={styles.infoContainer}
          onPress={() =>
            navigation.navigate('IndividualEditScreen', {
              title: t('changeNickname'),
            })
          }
        >
          <Text style={styles.infoLabel}>{t('nickname')}</Text>
          <View style={styles.rowRight}>
            <Text style={styles.infoValue}>{profile?.nickname ?? '-'}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>{t('email')}</Text>
          <View style={styles.rowRight}>
            <Text style={styles.infoValue}>{user?.email ?? '-'}</Text>
            <Text style={styles.chevron} />
          </View>
        </View>
        <Pressable
          style={[styles.infoContainer, styles.descriptionContainer]}
          onPress={() =>
            navigation.navigate('IndividualEditScreen', {
              title: t('changeBio'),
            })
          }
        >
          <Text style={styles.infoLabel}>{t('bio')}</Text>
          <View style={styles.rowRight}>
            <Text style={styles.infoValue}>
              {profile?.bio && profile.bio.length > 0
                ? profile.bio
                : t('bioPlaceholder')}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      </View>
      <Pressable style={styles.exitButton}>
        <Text style={styles.exitButtonText}>{t('deleteAccount')}</Text>
      </Pressable>
      <BottomSheet
        visible={isVisible}
        onClose={closeModal}
        title={t('changeProfilePhoto')}
        items={[
          {
            label: t('takePhoto'),
            onPress: () => handleImageSelection('camera'),
          },
          {
            label: t('chooseFromGallery'),
            onPress: () => handleImageSelection('gallery'),
          },
        ]}
      />
    </View>
  );
};

export default ProfileEditScreen;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
    alignItems: 'center',
    paddingTop: 30,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors[theme].GRAY_300,
  },
  profileInfo: {
    marginTop: 20,
    gap: 10,
    width: '100%',
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderColor: colors[theme].GRAY_200,
    borderRadius: 12,
    fontSize: 16,
    color: colors[theme].MAIN_DARK_TEXT,
    backgroundColor: colors[theme].WHITE,
    paddingLeft: 20,
    paddingRight: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 120,
    borderColor: colors[theme].GRAY_200,
    borderRadius: 12,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors[theme].MAIN_DARK_TEXT,
  },
  infoValue: {
    fontSize: 14,
    color: colors[theme].MAIN_DARK_TEXT,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 30,
    color: colors[theme].GRAY_400,
    marginLeft: 8,
    marginBottom: 5,
  },
  exitButton: {
    marginTop: 'auto',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: colors[theme].SUB_DARK_TEXT,
    fontWeight: '500',
    fontSize: 14,
  },
  cameraButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors[theme].WHITE,
    borderWidth: 1,
    borderColor: colors[theme].GRAY_300,
    justifyContent: 'center',
    alignItems: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
