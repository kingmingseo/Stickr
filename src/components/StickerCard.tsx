import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  NativeModules,
} from 'react-native';
import RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';
import HeartButton from './HeartButton';
import { Sticker } from '../types/sticker';
import { useToggleHeart } from '../hooks/query/useToggleHeart';
import { useTranslation } from '../hooks/useTranslation';
import useSupabaseSession from '../hooks/useSupabaseSession';
import FastImage from 'react-native-fast-image';

export type StickerCardProps = {
  sticker: Sticker;
  size: number;
  borderRadius: number;
  onPress?: () => void;
};

export const StickerCard = ({
  sticker,
  size,
  borderRadius,
  onPress,
}: StickerCardProps) => {
  const theme = useThemeStore(s => s.theme);
  const { t } = useTranslation();
  const { isAuthenticated } = useSupabaseSession();
  const styles = styling(theme);
  const [isCopying, setIsCopying] = useState(false);
  const uri = sticker.image_url;
  const { mutate: toggleHeart } = useToggleHeart();
  const handleHeartPress = () => {
    toggleHeart({
      stickerId: sticker.id,
      currentIsFavorited: sticker.is_favorited ?? false,
      currentLikeCount: sticker.like_count ?? 0,
    });
  };

  const handleCopyPress = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      // UI 안정화를 위해 약간 지연
      await new Promise(resolve => setTimeout(resolve, 200));

      const ext = uri
        .split('?')[0]
        .split('#')[0]
        .split('.')
        .pop()
        ?.toLowerCase();
      const safeExt = ext && ext.length <= 5 ? ext : 'jpg';
      const fileName = `stickr_${Date.now()}.${safeExt}`;
      const toFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const res = await RNFS.downloadFile({
        fromUrl: uri,
        toFile,
        connectionTimeout: 10000,
        readTimeout: 10000,
      }).promise;

      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        const exists = await RNFS.exists(toFile);
        if (exists) {
          if (
            Platform.OS === 'android' &&
            (NativeModules as any)?.ImageClipboard?.setImage
          ) {
            await (NativeModules as any).ImageClipboard.setImage(toFile);
          } else {
            // iOS 또는 안드로이드 폴백
            try {
              // @react-native-clipboard/clipboard의 setImage는 일부 환경에서 미동작 가능 → base64 폴백 유지
              // @ts-ignore
              await (Clipboard as any).setImage?.(toFile);
            } catch {
              const base64 = await RNFS.readFile(toFile, 'base64');
              await Clipboard.setString(
                `data:image/${safeExt};base64,${base64}`,
              );
            }
          }

          // 성공 토스트
          Toast.show({
            type: 'successWithInstagram',
            text1: t('copyComplete'),
            text2: t('imageCopiedToClipboard'),
            position: 'bottom',
            visibilityTime: 5000,
          });
        } else {
          throw new Error('다운로드한 파일을 찾을 수 없습니다');
        }
      } else {
        throw new Error(`다운로드 실패 (status ${res.statusCode})`);
      }

      onPress?.();
    } catch (e) {
      try {
        await Clipboard.setString(uri);
        Toast.show({
          type: 'info',
          text1: t('urlCopied'),
          text2: t('imageUrlCopied'),
        });
      } catch {
        Toast.show({
          type: 'error',
          text1: t('copyFailed'),
          text2: t('copyError'),
        });
      }
    } finally {
      // 약간 지연 후 임시 파일 정리
      setTimeout(async () => {
        try {
          const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
          const targets = files.filter(f => f.name.startsWith('stickr_'));
          await Promise.allSettled(targets.map(f => RNFS.unlink(f.path)));
        } catch {}
        setIsCopying(false);
      }, 1500);
    }
  };

  const image = (
    <View>
      <FastImage
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius }]}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );

  const content = (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCopyPress}
      style={styles.container}
    >
      {image}
      {isCopying && (
        <View
          style={[styles.overlay, { width: size, height: size, borderRadius }]}
        >
          <ActivityIndicator color="#ffffff" />
        </View>
      )}
      {isAuthenticated && (
        <HeartButton
          isHeartPressed={sticker.is_favorited ?? false}
          handleHeartPress={handleHeartPress}
        />
      )}
    </TouchableOpacity>
  );

  return <View>{content}</View>;
};

const styling = (theme: ThemeMode) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      backgroundColor: colors[theme].STICKER_BACKGROUND,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
