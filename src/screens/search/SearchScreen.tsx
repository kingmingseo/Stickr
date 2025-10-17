import { StyleSheet, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors } from '../../constants/colors';
import { ThemeMode, useThemeStore } from '../../store/themeStore';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSearchStickers } from '../../hooks/query/useSearchStickers';
import StickerCardContainer from '../../components/StickerCardContainer';
import { FilterProvider } from '../../contexts/FilterContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useQueryClient } from '@tanstack/react-query';
import { Sticker } from '../../types/sticker';

const SearchScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(''); // 실제 검색 중인 쿼리

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchStickers(activeQuery);

  // 검색어가 변경되면 이전 검색 초기화
  useEffect(() => {
    if (searchQuery !== activeQuery) {
      setActiveQuery(''); // 이전 검색 결과 숨김
    }
  }, [searchQuery, activeQuery]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      // 이전 검색 캐시 완전 제거
      queryClient.removeQueries({ 
        queryKey: ['searchStickers'],
        exact: false 
      });
      // 새 검색 시작
      setActiveQuery(trimmedQuery);
    }
  };

  const stickers: Sticker[] = (data?.pages ?? []).flatMap(page =>
    page && Array.isArray(page.data) ? (page.data as Sticker[]) : [],
  );

  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="chevron-back"
          size={20}
          color={colors[theme].GRAY_400}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.inputWrapper}>
          <InputField
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {activeQuery && (
        <View style={styles.resultsContainer}>
          {isError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{t('error')}</Text>
            </View>
          ) : (
            <FilterProvider>
              <StickerCardContainer
                stickers={stickers}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
              />
            </FilterProvider>
          )}
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styling = (theme: ThemeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  inputWrapper: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors[theme].GRAY_500,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors[theme].RED_500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors[theme].GRAY_500,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});
