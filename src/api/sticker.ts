import { Sticker } from '../types/sticker';
import { supabase } from './supabaseClient';

export async function getRecentStickers(
  limit: number = 20,
  cursor?: string,
  category?: string,
): Promise<{ data: Sticker[]; nextCursor: string | null }> {
  let query = supabase
  .from('sticker')
  .select('*, user_favorites(user_id)')
    .order('auto_increment_id', { ascending: false })
    .limit(limit);

  // 조건부 체이닝으로 조건 추가
  if (category && category !== '전체') query = query.eq('category', category);
  if (cursor) query = query.lt('auto_increment_id', cursor);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const stickers = (data || []).map((row: any) => ({
    ...(row as Sticker),
    is_favorited:
      Array.isArray(row.user_favorites) && row.user_favorites.length > 0,
  }));
  const nextCursor =
    stickers.length === limit
      ? stickers[stickers.length - 1]?.auto_increment_id?.toString()
      : null;

  return { data: stickers, nextCursor };
}

export async function getPopularStickers(
  limit: number = 20,
  cursor?: string,
  category?: string,
): Promise<{ data: Sticker[]; nextCursor: string | null }> {
  let query = supabase
  .from('sticker')
  .select('*, user_favorites(user_id)')
    .order('like_count', { ascending: false }) // 좋아요 수 내림차순
    .order('auto_increment_id', { ascending: false }) // 동일 좋아요 시 최신 우선
    .limit(limit);

  // 조건부 체이닝으로 조건 추가
  if (category && category !== '전체') query = query.eq('category', category);
  if (cursor) {
    // 복합 커서: like_count|auto_increment_id
    const [likeStr, idStr] = cursor.split('|');
    const likeCursor = parseInt(likeStr);
    const idCursor = parseInt(idStr);
    // like_count < cursorLike OR (like_count = cursorLike AND id < cursorId)
    query = query.or(
      `like_count.lt.${likeCursor},and(like_count.eq.${likeCursor},auto_increment_id.lt.${idCursor})`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const stickers = (data || []).map((row: any) => ({
    ...(row as Sticker),
    is_favorited:
      Array.isArray(row.user_favorites) && row.user_favorites.length > 0,
  }));
  const nextCursor =
    stickers.length === limit
      ? `${stickers[stickers.length - 1]?.like_count}|${
          stickers[stickers.length - 1]?.auto_increment_id
        }`
      : null;

  return { data: stickers, nextCursor };
}

// 즐겨찾기 토글 + like_count 동시 갱신 (서버 원자적 처리)
export async function toggleFavorite(
  stickerId: string,
): Promise<{ is_favorited: boolean }> {
  const { data, error } = await supabase.rpc('toggle_favorite', {
    p_sticker_id: stickerId,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  return { is_favorited: (row as any)?.is_favorited };
}

// 즐겨찾기 페이지네이션 (created_at desc, 동률 시 sticker_id desc)
export async function getMyFavorites(
  limit: number = 20,
  cursor?: string,
): Promise<{ data: Sticker[]; nextCursor: string | null }> {
  let query = supabase
    .from('user_favorites')
    .select('sticker:sticker(*), created_at, sticker_id')
    .order('created_at', { ascending: false })
    .order('sticker_id', { ascending: false })
    .limit(limit);

  if (cursor) {
    // cursor 형태: `${createdAtISO}|${sticker_id}`
    const [createdAtISO, idCursor] = cursor.split('|');
    const createdAt = createdAtISO;
    query = query.or(
      `created_at.lt.${createdAt},and(created_at.eq.${createdAt},sticker_id.lt.${idCursor})`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = data || [];
  const stickers: Sticker[] = rows.map((row: any) => ({
    ...(row.sticker as Sticker),
    is_favorited: true,
  }));

  const last = rows[rows.length - 1];
  const nextCursor =
    rows.length === limit && last
      ? `${last.created_at}|${last.sticker_id}`
      : null;
  console.log(stickers);
  return { data: stickers, nextCursor };
}

// 검색 API 함수
export async function searchStickers(
  query: string,
  limit: number = 20,
  cursor?: string,
): Promise<{ data: Sticker[]; nextCursor: string | null }> {
  // 태그는 text[] 이므로 ilike 사용 불가. 제목/설명은 ilike, 태그는 contains(cs)로 처리
  // 주의: tags.cs.{q} 는 태그 요소가 q와 '정확히 일치'해야 매치됩니다.
  const orFilter = `title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`;

  let supabaseQuery = supabase
    .from('sticker')
    .select('*, user_favorites(user_id)')
    .or(orFilter)
    .limit(limit);

  if (cursor) {
    const [likeStr, idStr] = cursor.split('|');
    const likeCursor = parseInt(likeStr);
    const idCursor = parseInt(idStr);
    supabaseQuery = supabaseQuery.or(
      `like_count.lt.${likeCursor},and(like_count.eq.${likeCursor},auto_increment_id.lt.${idCursor})`,
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);

  const stickers = (data || []).map((row: any) => ({
    ...(row as Sticker),
    is_favorited:
      Array.isArray(row.user_favorites) && row.user_favorites.length > 0,
  }));

  const nextCursor =
    stickers.length === limit
      ? `${stickers[stickers.length - 1]?.like_count}|${
          stickers[stickers.length - 1]?.auto_increment_id
        }`
      : null;

  return { data: stickers, nextCursor };
}
