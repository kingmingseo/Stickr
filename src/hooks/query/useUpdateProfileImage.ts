import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileImage } from '../../api/profile';
import useSupabaseSession from '../useSupabaseSession';

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const { user } = useSupabaseSession();

  return useMutation({
    mutationFn: async (imageUri: string) => {
      if (!user?.id) throw new Error('사용자 ID가 없습니다.');
      return updateProfileImage(user.id, imageUri);
    },
    onSuccess: () => {
      // 프로필 쿼리 무효화하여 새 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: ['profile', user?.id],
      });
    },
    onError: (error) => {
      console.error('프로필 이미지 업데이트 실패:', error);
    },
  });
};
