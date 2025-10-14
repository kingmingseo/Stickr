import { useMutation } from '@tanstack/react-query';
import queryClient from '../../api/queryClient';
import { toggleFavorite } from '../../api/sticker';
import { Sticker } from '../../types/sticker';

/**
 * 하트 토글에 필요한 파라미터 타입
 */
type Variables = {
  stickerId: string; // 토글할 스티커 ID
  currentIsFavorited: boolean; // 현재 즐겨찾기 상태
  currentLikeCount?: number; // 현재 좋아요 수 (기본값: 0)
};

/**
 * 하트 토글을 위한 낙관적 업데이트 훅
 *
 * 동작 방식:
 * 1. 즉시 UI 업데이트 (낙관적)
 * 2. 서버에 요청 전송
 * 3. 실패 시 UI 롤백
 * 4. 최종 정합성 보장을 위한 캐시 무효화
 */
export function useToggleHeart() {
  return useMutation({
    // 서버에 전송할 실제 API 호출 함수
    mutationFn: ({ stickerId }: Variables) => toggleFavorite(stickerId),

    /**
     * 낙관적 업데이트: 서버 요청 전에 UI를 즉시 업데이트
     * 사용자가 클릭하자마자 하트 상태가 바뀌어 빠른 피드백 제공
     */
    onMutate: async ({
      stickerId,
      currentIsFavorited,
      currentLikeCount = 0,
    }: Variables) => {
      // 1. 진행 중인 모든 stickers 쿼리 취소 (경쟁 상태 방지)
      await queryClient.cancelQueries({ queryKey: ['stickers'], exact: false });

      // 2. 현재 캐시 상태 백업 (실패 시 롤백용)
      const prev = queryClient.getQueriesData({ queryKey: ['stickers'] });

      // 3. 새로운 상태 계산
      const nextIsFavorited = !currentIsFavorited; // true ↔ false
      const likeDelta = nextIsFavorited ? 1 : -1; // 좋아요 +1 또는 -1

      // 4. 모든 stickers 관련 쿼리 캐시 즉시 업데이트
      // ['stickers', 'popular', '전체'], ['stickers', undefined, 'favorites'] 등 모든 쿼리
      queryClient.setQueriesData(
        { queryKey: ['stickers'], exact: false },
        (old: any) => {
          // infinite query 구조가 아니면 그대로 반환
          if (!old || !Array.isArray(old.pages)) return old;

          // 모든 페이지를 순회하며 해당 스티커만 업데이트
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map(
                (s: Sticker) =>
                  s.id === stickerId
                    ? {
                        ...s,
                        is_favorited: nextIsFavorited, // 즐겨찾기 상태 토글
                        like_count: Math.max(
                          0, // 음수 방지
                          (s.like_count ?? currentLikeCount) + likeDelta, // 좋아요 수 증감
                        ),
                      }
                    : s, // 다른 스티커는 그대로
              ),
            })),
          };
        },
      );

      // 5. 백업된 상태를 context로 반환 (onError에서 롤백용)
      return { prev };
    },

    /**
     * 서버 요청 실패 시 UI 롤백
     * onMutate에서 백업한 이전 상태로 되돌림
     */
    onError: (_err, _vars, ctx) => {
      // 백업된 모든 쿼리 상태를 원래대로 복원
      ctx?.prev?.forEach(([key, data]: any) =>
        queryClient.setQueryData(key, data),
      );
    },

    /**
     * 성공/실패 관계없이 최종 정합성 보장
     * 서버의 최신 데이터로 모든 캐시를 동기화
     */
    onSettled: () => {
      // 모든 stickers 관련 쿼리를 무효화하여 서버에서 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ['stickers'], exact: false });
    },
  });
}
