import { LanguageMode } from '../types/languageMode';

// API 요청용 카테고리 값 (진짜 데이터)
export const CATEGORIES = [
  'all',
  'handwriting',
  'character',
  'speech-bubble',
  'dot',
  'emoji',
  'food',
  'decoration',
] as const;

export type CategoryKey = typeof CATEGORIES[number];

// 카테고리 번역
export const categoryTranslations: Record<
  LanguageMode,
  Record<CategoryKey, string>
> = {
  korean: {
    all: '전체',
    handwriting: '손글씨',
    dot: '도트',
    'speech-bubble': '말풍선',
    character: '캐릭터',
    emoji: '이모지',
    food: '음식',
    decoration: '장식',
  },
  english: {
    all: 'All',
    handwriting: 'Handwriting',
    dot: 'Dot',
    'speech-bubble': 'Speech Bubble',
    character: 'Character',
    emoji: 'Emoji',
    food: 'Food',
    decoration: 'Decoration',
  },
};

// 언어에 따른 카테고리 라벨 반환
export const getCategoryLabels = (language: LanguageMode): string[] => {
  return CATEGORIES.map(category => categoryTranslations[language][category]);
};

// 번역된 라벨을 API 값으로 변환
export const getCategoryApiValue = (
  selectedCategory: string,
  language: LanguageMode,
): string => {
  const categoryKey = CATEGORIES.find(
    key => categoryTranslations[language][key] === selectedCategory
  );
  
  return categoryKey!;
}; 