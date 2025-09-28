import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../../types/navigation';
import { useProfileStore } from '../../store/profileStore';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import { useModal } from '../../hooks/useModal';
import BottomSheet from '../../components/BottomSheet';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useUpdateProfileImage } from '../../hooks/query/useUpdateProfileImage';
import Toast from 'react-native-toast-message';

const ProfileEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();
  const profile = useProfileStore(s => s.profile);
  const { openModal, closeModal, isVisible } = useModal();
  const { user } = useSupabaseSession();
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
          text1: '프로필 이미지가 업데이트되었습니다.',
        });
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Toast.show({
        type: 'appError',
        text1: '이미지 업로드에 실패했습니다.',
      });
    }
  };

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
            openModal('프로필 사진 변경', '프로필 사진을 변경하세요');
          }}
        >
          <Icon name="camera" size={16} color={colors.light.MAIN_DARK_TEXT} />
        </Pressable>
      </View>
      <View style={styles.profileInfo}>
        <Pressable
          style={styles.infoContainer}
          onPress={() =>
            navigation.navigate('IndividualEditScreen', {
              title: '닉네임 변경',
            })
          }
        >
          <Text style={styles.infoLabel}>닉네임</Text>
          <View style={styles.rowRight}>
            <Text style={styles.infoValue}>{profile?.nickname ?? '-'}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>이메일</Text>
          <View style={styles.rowRight}>
            <Text style={styles.infoValue}>{user?.email ?? '-'}</Text>
            <Text style={styles.chevron} />
          </View>
        </View>
        <Pressable
          style={[styles.infoContainer, styles.descriptionContainer]}
          onPress={() =>
            navigation.navigate('IndividualEditScreen', {
              title: '자기소개 변경',
            })
          }
        >
          <Text style={styles.infoLabel}>자기소개</Text>
          <View style={styles.rowRight}>
            <Text style={styles.infoValue}>
              {profile?.bio && profile.bio.length > 0
                ? profile.bio
                : '자기소개를 입력해보세요'}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      </View>
      <Pressable style={styles.exitButton}>
        <Text style={styles.exitButtonText}>회원 탈퇴</Text>
      </Pressable>
      <BottomSheet
        visible={isVisible}
        onClose={closeModal}
        title="프로필 사진 변경"
        items={[
          {
            label: '카메라로 촬영하기',
            onPress: () => handleImageSelection('camera'),
          },
          {
            label: '갤러리에서 선택하기',
            onPress: () => handleImageSelection('gallery'),
          },
        ]}
      />
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.WHITE,
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
    borderColor: colors.light.GRAY_300,
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
    borderColor: colors.light.GRAY_200,
    borderRadius: 12,
    fontSize: 16,
    color: colors.light.MAIN_DARK_TEXT,
    backgroundColor: colors.light.WHITE,
    paddingLeft: 20,
    paddingRight: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 120,
    borderColor: colors.light.GRAY_200,
    borderRadius: 12,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.light.MAIN_DARK_TEXT,
  },
  infoValue: {
    fontSize: 14,
    color: colors.light.MAIN_DARK_TEXT,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 30,
    color: colors.light.GRAY_400,
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
    color: colors.light.SUB_DARK_TEXT,
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
    backgroundColor: colors.light.WHITE,
    borderWidth: 1,
    borderColor: colors.light.GRAY_300,
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
