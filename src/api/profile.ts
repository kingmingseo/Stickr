import { supabase } from './supabaseClient';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, nickname, bio, avatar_url')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  patch: {
    nickname?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
  },
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(patch)
    .eq('id', userId)
    .select('id, nickname, bio, avatar_url')
    .single();
  if (error) throw error;
  return data;
}

// 프로필 이미지 업로드 (Supabase Storage)
export async function uploadProfileImage(
  userId: string,
  imageUri: string,
  fileName?: string,
): Promise<string> {
  try {
    // 파일명 생성
    const fileExt = imageUri.split('.').pop() || 'jpg';
    const finalFileName =
      fileName || `profile_${userId}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${finalFileName}`;

    // FormData 생성
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: `image/${fileExt}`,
      name: finalFileName,
    } as any);

    // Supabase Storage에 업로드
    const { error } = await supabase.storage
      .from('profile-images') // 버킷 이름
      .upload(filePath, formData, {
        contentType: `image/${fileExt}`,
        upsert: true, // 같은 파일명이면 덮어쓰기
      });

    if (error) throw error;

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from('profile-images').getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
}

// 프로필 이미지 업데이트 (업로드 + 프로필 업데이트)
export async function updateProfileImage(
  userId: string,
  imageUri: string,
): Promise<string> {
  try {
    // 1. S3에 이미지 업로드
    const imageUrl = await uploadProfileImage(userId, imageUri);

    // 2. Supabase 프로필 업데이트
    await updateProfile(userId, { avatar_url: imageUrl });

    return imageUrl;
  } catch (error) {
    console.error('프로필 이미지 업데이트 실패:', error);
    throw error;
  }
}
