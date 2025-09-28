import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import ChipButtonGroup from '../../components/ChipButtonGroup';
import { colors } from '../../constants/colors';
import StickerCardContainer from '../../components/StickerCardContainer';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import LoginPrompt from '../../components/LoginPrompt';
import { useInfiniteStickers } from '../../hooks/query/useInfiniteStickers';
import { Sticker } from '../../types/sticker';
import { FilterProvider } from '../../contexts/FilterContext';

// 즐겨찾기 컨텐츠 컴포넌트
const FavoritesScreenContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('즐겨찾기');
  const { isAuthenticated } = useSupabaseSession();

  const categoriesMap: Record<string, string> = {
    즐겨찾기: 'favorites',
    // 보관함: 'archive',
  };
  const categories = Object.keys(categoriesMap);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteStickers({ category: 'favorites', enabled: isAuthenticated });

  const stickers: Sticker[] = (data?.pages ?? []).flatMap(page =>
    page && Array.isArray(page.data) ? (page.data as Sticker[]) : [],
  );

  return isAuthenticated ? (
    <View style={styles.container}>
      <ChipButtonGroup
        chips={categories}
        chipStyle="square"
        selectedChip={selectedCategory}
        onChipSelect={setSelectedCategory}
      />
      <StickerCardContainer
        stickers={stickers}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
      />
    </View>
  ) : (
    <LoginPrompt />
  );
};

// 메인 컴포넌트
const FavoritesScreen = () => {
  return (
    <FilterProvider>
      <FavoritesScreenContent />
    </FilterProvider>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.WHITE,
  },
});
