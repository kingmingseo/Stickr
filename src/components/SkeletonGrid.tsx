import React, { useEffect, useMemo, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, View, Animated } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { colors } from '../constants/colors';
import { computeGridItemSize } from '../utils/grid';

type SkeletonGridProps = {
  gap?: number;
  containerPaddingHorizontal?: number;
  borderRadius?: number;
  columns?: number;
  itemCount?: number; // optional override
  itemSize?: number; // when provided, use exact size from parent
};

const SkeletonGrid = ({ gap = 8, containerPaddingHorizontal = 0, borderRadius = 12, columns = 3, itemCount, itemSize: itemSizeProp }: SkeletonGridProps) => {
  const windowWidth = Dimensions.get('window').width;
  const theme = useThemeStore(s => s.theme);
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      // stop loop on unmount
      loop.stop();
    };
  }, [shimmer]);
  const itemSize = useMemo(() => {
    if (typeof itemSizeProp === 'number' && itemSizeProp > 0) return itemSizeProp;
    return computeGridItemSize(windowWidth, containerPaddingHorizontal, gap, columns);
  }, [windowWidth, containerPaddingHorizontal, gap, columns, itemSizeProp]);

  const count = itemCount ?? columns * 3; // default 3 rows
  const data = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <View style={{ paddingHorizontal: containerPaddingHorizontal }}>
      <FlatList
        data={data}
        keyExtractor={(item) => `skeleton-${item}`}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ gap }}
        renderItem={() => {
          const animatedStyle = { opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) };
          return (
            <View style={[styles.item, { width: itemSize, height: itemSize, borderRadius }]}> 
              <View style={[StyleSheet.absoluteFill, styles.itemBase, { borderRadius, backgroundColor: colors[theme].GRAY_200 }]} />
              <Animated.View style={[StyleSheet.absoluteFill, styles.itemHighlight, { borderRadius, backgroundColor: colors[theme].GRAY_100 }, animatedStyle]} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default SkeletonGrid;

const styles = StyleSheet.create({
  item: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  itemBase: {},
  itemHighlight: {},
});


