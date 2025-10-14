import { useLanguageStore } from '../store/languageStore';
import { translations, TranslationKey } from '../constants/translations';

/**
 * 다국어 번역 훅
 * 
 * @example
 * const { t, language } = useTranslation();
 * return <Text>{t('home')}</Text>;
 */
export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  
  /**
   * 번역 키를 현재 언어의 텍스트로 변환
   */
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
  
  return { t, language };
}

