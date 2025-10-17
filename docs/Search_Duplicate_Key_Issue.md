# 검색 중복 Key 이슈 해결 기록

## 📋 문제 증상

### 에러 메시지
```
console.js:661 Encountered two children with the same key, 
`.$326d7445-631d-4a14-a7a3-0a5cb098b01e=28c19fafe-cf8d-4e7d-bb58-af11e1c6c6d6=25905f6b1-cde6-4aee-bd39-90c4884efd43`. 
Keys should be unique so that components maintain their identity across updates.
```

### 발생 상황
- **검색 화면에서만** 중복 키 에러 발생
- 같은 스티커가 화면에 2번 표시됨
- 데이터베이스에는 데이터가 하나씩만 존재함 (확인됨)
- 홈 화면, 즐겨찾기 화면은 정상 작동

---

## 🔍 근본 원인

### 1. **검색 API에 ORDER BY 누락**

```typescript
// ❌ 문제 코드 (수정 전)
let supabaseQuery = supabase
  .from('sticker')
  .select('*, user_favorites(user_id)')
  .or(orFilter)
  .limit(limit);
  // ⚠️ ORDER BY가 없음!

if (cursor) {
  supabaseQuery = supabaseQuery.or(
    `like_count.lt.${likeCursor},and(like_count.eq.${likeCursor},auto_increment_id.lt.${idCursor})`
  );
}
```

**왜 문제가 되었나?**

1. **정렬이 없으면 DB가 임의의 순서로 반환**
   - Supabase (PostgreSQL)는 정렬 없이 쿼리하면 내부 저장 순서대로 반환
   - 이 순서는 예측 불가능하고 실행마다 달라질 수 있음

2. **Cursor 기반 페이지네이션이 깨짐**
   ```
   페이지 1 요청:
   결과: [ID:50, ID:35, ID:80, ID:42, ...] (정렬 없이 무작위)
   마지막: like_count=10, auto_increment_id=42
   nextCursor = "10|42"
   
   페이지 2 요청 (cursor="10|42"):
   조건: like_count < 10 OR (like_count = 10 AND id < 42)
   결과: [ID:35, ID:25, ID:50, ...] (또 무작위)
         ↑
         ID:35는 이미 페이지 1에 있었음! → 중복!
   ```

3. **무한 스크롤에서 중복 발생**
   - 첫 페이지와 두 번째 페이지에 같은 데이터가 포함
   - flatMap으로 합치면 중복된 ID 발생
   - React의 `keyExtractor={item => item.id}`에서 중복 key 경고

---

## ✅ 해결 방법

### 1. **ORDER BY 추가**

```typescript
// ✅ 해결 코드 (수정 후)
let supabaseQuery = supabase
  .from('sticker')
  .select('*, user_favorites(user_id)')
  .or(orFilter)
  .order('like_count', { ascending: false })        // 좋아요 수 내림차순
  .order('auto_increment_id', { ascending: false }) // 동일 좋아요 시 최신 우선

if (cursor) {
  const [likeStr, idStr] = cursor.split('|');
  const likeCursor = parseInt(likeStr);
  const idCursor = parseInt(idStr);
  
  supabaseQuery = supabaseQuery.or(
    `like_count.lt.${likeCursor},and(like_count.eq.${likeCursor},auto_increment_id.lt.${idCursor})`
  );
}

supabaseQuery = supabaseQuery.limit(limit);
```

**효과:**
- 항상 일관된 순서로 데이터 반환
- Cursor 기반 페이지네이션이 정확하게 작동
- 중복 데이터 원천 차단

### 2. **Supabase 쿼리 순서 최적화**

```typescript
// 올바른 쿼리 체이닝 순서:
1. .select()           // 필드 선택
2. .or(검색조건)        // WHERE 조건
3. .order()            // 정렬 (중요!)
4. .or(cursor조건)      // 페이지네이션 조건
5. .limit()            // 개수 제한
```

### 3. **디버깅 로그 추가**

```typescript
// 중복 확인 로그
const ids = stickers.map(s => s.id);
const uniqueIds = new Set(ids);
if (ids.length !== uniqueIds.size) {
  console.warn('⚠️ 중복 ID 발견!', {
    total: ids.length,
    unique: uniqueIds.size,
    duplicates: ids.filter((id, index) => ids.indexOf(id) !== index),
  });
}
```

---

## 🎯 왜 다른 화면은 문제가 없었나?

### 홈 화면 (`getRecentStickers`)
```typescript
let query = supabase
  .from('sticker')
  .select('*, user_favorites(user_id)')
  .order('auto_increment_id', { ascending: false }) // ✅ ORDER BY 있음
  .limit(limit);
```

### 즐겨찾기 화면 (`getMyFavorites`)
```typescript
let query = supabase
  .from('user_favorites')
  .select('sticker:sticker(*), created_at, sticker_id')
  .order('created_at', { ascending: false })         // ✅ ORDER BY 있음
  .order('sticker_id', { ascending: false })         // ✅ ORDER BY 있음
  .limit(limit);
```

### 검색 화면 (`searchStickers`) - 수정 전
```typescript
let supabaseQuery = supabase
  .from('sticker')
  .select('*, user_favorites(user_id)')
  .or(orFilter)
  .limit(limit);
  // ❌ ORDER BY 없음!
```

**결론:** 검색 API에만 ORDER BY가 누락되어 있었음!

---

## 💡 추가로 시도했던 방법들 (필요 없었음)

### 1. 중복 제거 유틸 함수 (불필요)
```typescript
// utils/sticker.ts (삭제됨)
export function deduplicateStickers(stickers: Sticker[]): Sticker[] {
  const seen = new Set<string>();
  return stickers.filter(s => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
```
→ 근본 원인을 해결하면 불필요

### 2. 검색 상태 관리 개선 (부가 효과)
```typescript
// SearchScreen.tsx
const [searchQuery, setSearchQuery] = useState('');
const [activeQuery, setActiveQuery] = useState('');

const handleSearch = () => {
  queryClient.removeQueries({ 
    queryKey: ['searchStickers'],
    exact: false 
  });
  setActiveQuery(trimmedQuery);
};
```
→ 중복 해결에는 영향 없었지만, UX 개선에는 도움됨

### 3. 캐시 정책 개선 (부가 효과)
```typescript
// useSearchStickers.ts
staleTime: 1000 * 60 * 5,  // 5분
gcTime: 1000 * 60 * 10,    // 10분
refetchOnMount: false,
refetchOnWindowFocus: false,
```
→ 중복 해결에는 영향 없었지만, 성능 개선에는 도움됨

---

## 📊 Cursor 페이지네이션 작동 원리

### 정렬이 있을 때 (정상)
```
DB 데이터 (like_count, id 순으로 정렬됨):
┌────┬──────────┬────────────┐
│ ID │ 제목     │ like_count │
├────┼──────────┼────────────┤
│ 50 │ 고양이A  │     15     │
│ 49 │ 강아지A  │     12     │
│ 48 │ 토끼A    │     10     │
│ 47 │ 햄스터A  │     10     │
│ 46 │ 앵무새A  │      8     │
│ 45 │ 금붕어A  │      5     │
└────┴──────────┴────────────┘

페이지 1 (limit=3):
쿼리: ORDER BY like_count DESC, id DESC LIMIT 3
결과: [50, 49, 48]
nextCursor = "10|48"

페이지 2 (cursor="10|48"):
쿼리: WHERE like_count < 10 OR (like_count = 10 AND id < 48)
       ORDER BY like_count DESC, id DESC LIMIT 3
결과: [47, 46, 45]
nextCursor = "5|45"

✅ 중복 없음!
```

### 정렬이 없을 때 (문제)
```
DB 데이터 (정렬 없이 임의 순서):
페이지 1:
결과: [50, 46, 48, ...] (무작위)
nextCursor = "8|46"

페이지 2 (cursor="8|46"):
쿼리: WHERE like_count < 8 OR (like_count = 8 AND id < 46)
결과: [45, 50, 47, ...] (또 무작위)
       ↑
       50은 이미 페이지 1에 있었음!

❌ 중복 발생!
```

---

## 🎓 교훈

1. **Cursor 기반 페이지네이션에는 정렬이 필수**
   - ORDER BY 없이는 결과 순서가 예측 불가능
   - Cursor 조건만으로는 중복 방지 불가능

2. **데이터베이스 쿼리의 기본을 지키자**
   - 페이지네이션 = 정렬 + 제한 + Offset/Cursor
   - 정렬은 선택이 아닌 필수

3. **같은 패턴을 일관되게 사용**
   - 다른 API들은 정렬이 있었음
   - 검색 API만 예외적으로 누락
   - 코드 리뷰나 템플릿으로 방지 가능

4. **디버깅 로그의 중요성**
   - 중복 확인 로그가 원인 파악에 도움
   - API 응답을 확인하여 문제 위치 특정

---

## 📚 참고 자료

- [Supabase Pagination Documentation](https://supabase.com/docs/guides/api/pagination)
- [PostgreSQL ORDER BY](https://www.postgresql.org/docs/current/queries-order.html)
- [React Query Infinite Queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)

---

**해결 일시:** 2025년 10월 17일  
**최종 수정:** `src/api/sticker.ts` - `searchStickers()` 함수에 ORDER BY 추가  
**결과:** 검색 시 중복 키 에러 완전 해결 ✅

