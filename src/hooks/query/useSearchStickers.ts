import { useInfiniteQuery } from '@tanstack/react-query';
import { searchStickers } from '../../api/sticker';

export function useSearchStickers(query: string) {
  return useInfiniteQuery({
    queryKey: ['searchStickers', query],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => 
      searchStickers(query, 18, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: query.trim().length > 0,
    // 검색 결과는 캐시 유지 (동일 검색어 재검색 방지)
    staleTime: 1000 * 60 * 5, // 5분간 신선한 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 보관
    // 불필요한 refetch 제거
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
