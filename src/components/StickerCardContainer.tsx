import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { StickerCard } from './StickerCard';
import { Sticker } from '../types/sticker';
import EmptyState from './EmptyState';
import SkeletonGrid from './SkeletonGrid';
import { computeGridItemSize } from '../utils/grid';
import { colors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

type StickerCardContainerProps = {
  gap?: number;
  borderRadius?: number;
  containerPaddingHorizontal?: number;
  onPressItem?: (uri: string, index: number) => void;
  stickers: Sticker[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
};

const StickerCardContainer = ({
  gap = 8,
  borderRadius = 12,
  containerPaddingHorizontal = 14,
  onPressItem,
  stickers,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading,
}: StickerCardContainerProps) => {
  const windowWidth = Dimensions.get('window').width;
  const theme = useThemeStore(s => s.theme);

  const itemSize = useMemo(() => {
    return computeGridItemSize(windowWidth, containerPaddingHorizontal, gap, 3);
  }, [windowWidth, containerPaddingHorizontal, gap]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colors[theme].PURPLE_400} />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: containerPaddingHorizontal },
      ]}
    >
      {isLoading ? (
        <SkeletonGrid
          gap={gap}
          borderRadius={borderRadius}
          columns={3}
          itemSize={itemSize}
        />
      ) : stickers.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={stickers}
          keyExtractor={item => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ gap, paddingBottom: 50 }}
          renderItem={({ item, index }) => (
            <StickerCard
              sticker={item}
              size={itemSize}
              borderRadius={borderRadius}
              onPress={
                onPressItem
                  ? () => onPressItem(item.image_url, index)
                  : undefined
              }
            />
          )}
          ListFooterComponent={renderFooter}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
        />
      )}
    </View>
  );
};

export default StickerCardContainer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
