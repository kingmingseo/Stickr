import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        retry: 2, // 실패 시 2번 재시도
        staleTime: 1000 * 60 * 5, // 5분간 신선하다고 간주
        gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
        refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
      },
      mutations: {
        retry: 1, // mutation 실패 시 1번만 재시도
      },
    },
  }
);

export default queryClient;