import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { colors } from '../../constants/colors';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import useSupabaseSession from '../../hooks/useSupabaseSession';

const OnboardingScreen = () => {
  const { width, height } = Dimensions.get('window');
  const pageWidth = width;
  const pages = useMemo(() => [
    { key: '1', title: '스티커로 스토리를 꾸며보세요', subtitle: '쉽고 빠르게 복사해서 바로 붙여넣기', media: { type: 'image', source: require('../../assets/Stickr.png') } },
    { key: '2', title: '좋아요/즐겨찾기', subtitle: '마음에 드는 스티커를 저장하고 빠르게 찾기', media: { type: 'image', source: require('../../assets/Stickr.png') } },
    { key: '3', title: '검색과 카테고리', subtitle: '원하는 분위기의 스티커를 바로 찾아요', media: { type: 'image', source: require('../../assets/Stickr.png') } },
  ], []);
  const [page, setPage] = useState(0);
  const ref = useRef<FlatList>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useSupabaseSession();

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    setPage(Math.round(x / pageWidth));
  };

  const goNext = async () => {
    if (page < pages.length - 1) {
      ref.current?.scrollToIndex({ index: page + 1, animated: true });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', '1');
      navigation.reset({
        index: 0,
        routes: [
          { name: isAuthenticated ? 'BottomTabNavigation' : 'AuthNavigation' },
        ],
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={pages}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: pageWidth }]}> 
            <View style={styles.media}>
              {item.media.type === 'video' ? (
                <Video source={item.media.source} style={StyleSheet.absoluteFill} resizeMode="cover" repeat muted />
              ) : (
                <Image source={item.media.source} style={StyleSheet.absoluteFill} resizeMode="cover" />
              )}
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
        <Pressable style={styles.cta} onPress={goNext}>
          <Text style={styles.ctaText}>{page < pages.length - 1 ? '계속' : '시작하기'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.WHITE,
  },
  page: {
    flex: 1,
  },
  media: {
    flex: 0.7,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  textBlock: {
    flex: 0.3,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.light.MAIN_DARK_TEXT,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.light.GRAY_400,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.GRAY_200,
  },
  dotActive: {
    backgroundColor: colors.light.PURPLE_400,
    width: 20,
  },
  cta: {
    marginTop: 6,
    width: '90%',
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.light.PURPLE_400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: colors.light.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});
