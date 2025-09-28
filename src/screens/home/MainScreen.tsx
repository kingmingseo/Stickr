import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../constants/colors';
import StickerCardContainer from '../../components/StickerCardContainer';
import ChipButtonGroup from '../../components/ChipButtonGroup';
import ChipButton from '../../components/ChipButton';
import Icon from 'react-native-vector-icons/Ionicons';
import DropdownMenu from '../../components/DropdownMenu';
import { Sticker } from '../../types/sticker';
import { useInfiniteStickers } from '../../hooks/query/useInfiniteStickers';
import { categoriesMap, categoryLabels } from '../../constants/categories';
import { FilterProvider, useFilter } from '../../contexts/FilterContext';

// 메인 컨텐츠 컴포넌트
const MainScreenContent = () => {
  const { selectedCategory, sortBy, setSelectedCategory, setSortBy } =
    useFilter();

  // showSortMenu는 로컬 상태로 관리
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  const categories = categoryLabels;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteStickers({ category: categoriesMap[selectedCategory], sortBy });

  const stickers: Sticker[] = (data?.pages ?? []).flatMap(page =>
    page && Array.isArray(page.data) ? (page.data as Sticker[]) : [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <DropdownMenu
          visible={showSortMenu}
          options={[
            { label: '🔥 인기', value: 'popular' },
            { label: '🚀 최신', value: 'recent' },
          ]}
          onSelect={value => {
            setSortBy(value as 'popular' | 'recent');
            setShowSortMenu(false);
          }}
          onDismiss={() => setShowSortMenu(false)}
          position={{ top: 50, left: 16, width: 140 }}
        />
        <ChipButtonGroup
          chips={categories}
          selectedChip={selectedCategory}
          onChipSelect={setSelectedCategory}
          leftComponent={
            <ChipButton
              label={sortBy === 'popular' ? '🔥 인기' : '🚀 최신'}
              isSelected
              onPress={() => setShowSortMenu(prev => !prev)}
              rightIcon={
                <Icon
                  name={showSortMenu ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.light.WHITE}
                />
              }
            />
          }
        />
        <StickerCardContainer
          isLoading={isLoading}
          stickers={stickers}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </View>
    </View>
  );
};

// 메인 컴포넌트
const MainScreen = () => {
  return (
    <FilterProvider>
      <MainScreenContent />
    </FilterProvider>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.light.WHITE,
    position: 'relative',
  },
  sortRow: {
    flexDirection: 'row',
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
    color: colors.light.SUB_DARK_TEXT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.light.RED_500,
    textAlign: 'center',
  },
});
