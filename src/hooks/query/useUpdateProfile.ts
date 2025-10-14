import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../../api/profile';
import queryClient from '../../api/queryClient';

function useUpdateProfile() {

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { nickname?: string; bio?: string } }) => 
      updateProfile(id, patch),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
    },
  });
}

export default useUpdateProfile;