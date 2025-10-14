import { LanguageMode } from '../types/languageMode';

// 카테고리 키와 API 값 매핑
export const categoriesMap: Record<string, string> = {
  전체: '전체',
  도트: 'dot',
  말풍선: 'speech-bubble',
  캐릭터: 'character',
  이모지: 'emoji',
  감정: 'emotion',
  여행: 'travel',
  음식: 'food',
  스포츠: 'sports',
};

// 카테고리 번역
export const categoryTranslations: Record<LanguageMode, Record<string, string>> = {
  korean: {
    '전체': '전체',
    'dot': '도트',
    'speech-bubble': '말풍선',
    'character': '캐릭터',
    'emoji': '이모지',
    'emotion': '감정',
    'travel': '여행',
    'food': '음식',
    'sports': '스포츠',
  },
  english: {
    '전체': 'All',
    'dot': 'Dot',
    'speech-bubble': 'Speech Bubble',
    'character': 'Character',
    'emoji': 'Emoji',
    'emotion': 'Emotion',
    'travel': 'Travel',
    'food': 'Food',
    'sports': 'Sports',
  },
};

// 언어에 따른 카테고리 라벨 반환
export const getCategoryLabels = (language: LanguageMode): string[] => {
  if (language === 'english') {
    return ['All', 'Dot', 'Speech Bubble', 'Character', 'Emoji', 'Emotion', 'Travel', 'Food', 'Sports'];
  }
  return ['전체', '도트', '말풍선', '캐릭터', '이모지', '감정', '여행', '음식', '스포츠'];
};

// 번역된 라벨을 API 값으로 변환
export const getCategoryValue = (translatedLabel: string, language: LanguageMode): string => {
  if (language === 'korean') {
    return categoriesMap[translatedLabel] || translatedLabel;
  }
  
  // 영어 라벨을 한글로 변환 후 API 값 찾기
  const koreanLabels = getCategoryLabels('korean');
  const englishLabels = getCategoryLabels('english');
  const index = englishLabels.indexOf(translatedLabel);
  
  if (index !== -1) {
    const koreanLabel = koreanLabels[index];
    return categoriesMap[koreanLabel] || translatedLabel;
  }
  
  return translatedLabel;
};

export const categoryLabels: string[] = Object.keys(categoriesMap);


