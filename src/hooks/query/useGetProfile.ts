import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/profile";
import { useProfileStore } from "../../store/profileStore";
import type { Profile } from "../../store/profileStore";
import { useEffect } from "react";

export function useGetProfile(id: string) {
  const result = useQuery<Profile>({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id) as Promise<Profile>,
    enabled: !!id,
    staleTime: 0,
  });

  // 서버에서 최신값을 받으면 전역 스토어에 동기화
  useEffect(() => {
    if (result.data) {
      useProfileStore.getState().setProfile(result.data);
    }
  }, [result.data]);

  return result;
}