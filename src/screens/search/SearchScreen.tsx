import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../constants/colors';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSearchStickers } from '../../hooks/query/useSearchStickers';
import StickerCardContainer from '../../components/StickerCardContainer';
import { Sticker } from '../../types/sticker';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchStickers(searchQuery, isSearching);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const stickers: Sticker[] = (data?.pages ?? []).flatMap(page =>
    page && Array.isArray(page.data) ? (page.data as Sticker[]) : [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="chevron-back"
          size={20}
          color={colors.light.GRAY_400}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.inputWrapper}>
          <InputField
            placeholder="키워드나 태그를 검색하세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {isSearching && (
        <View style={styles.resultsContainer}>
          {isError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>검색 중 오류가 발생했습니다.</Text>
            </View>
          ) : (
            <StickerCardContainer
              stickers={stickers}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isLoading={isLoading}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.WHITE,
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
    color: colors.light.GRAY_500,
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.light.GRAY_500,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});
