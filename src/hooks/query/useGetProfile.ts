import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../api/profile';
import { Profile } from '../../types/profile';

function useGetProfile(id: string) {
  const result = useQuery<Profile>({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id) as Promise<Profile>,
    enabled: !!id, //게스트 모드에선 호출을 방지
    staleTime: 0,
  });
  return result;
}



export default useGetProfile;
