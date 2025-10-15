import { useInfiniteQuery } from '@tanstack/react-query';
import { searchStickers } from '../../api/sticker';

export function useSearchStickers(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['searchStickers', query],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => searchStickers(query, 18, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && query.trim().length > 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0
  });
}
