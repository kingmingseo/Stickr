import {
  getMyFavorites,
  getPopularStickers,
  getRecentStickers,
} from '../../api/sticker';
import { useInfiniteQuery } from '@tanstack/react-query';

type UseInfiniteStickersOptions = {
  category: string;
  sortBy?: string;

};

export function useInfiniteStickers({ category, sortBy }: UseInfiniteStickersOptions) {
  return useInfiniteQuery({
    queryKey: ['stickers', sortBy, category],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const cursor = pageParam;
      if (sortBy === 'recent') {
        return await getRecentStickers(20, cursor, category);
      } else if (sortBy === 'popular') {
        return await getPopularStickers(20, cursor, category);
      } else if (category === 'favorites') {
        return await getMyFavorites(20, cursor);
      }
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage?.nextCursor,
  });
}
