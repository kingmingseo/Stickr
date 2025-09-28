import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle, Animated } from 'react-native';
import { colors } from '../constants/colors';

type TabOption = { label: string; value: string };

interface TabButtonProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const TabButton = ({ options, value, onChange, style }: TabButtonProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const innerWidth = Math.max(0, containerWidth - 8); // padding: 4 left/right
  const itemWidth = options.length > 0 ? innerWidth / options.length : 0;
  const foundIndex = options.findIndex(o => o.value === value);
  const activeIndex = foundIndex < 0 ? 0 : foundIndex;

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!itemWidth) return;
    Animated.spring(translateX, {
      toValue: activeIndex * itemWidth,
      useNativeDriver: true,
      bounciness: 8,
      speed: 12,
    }).start();
  }, [activeIndex, itemWidth, translateX]);

  return (
    <View
      style={[styles.segmented, style]}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {itemWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              width: itemWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            style={styles.segmentItem}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  segmented: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.light.GRAY_100,
    borderRadius: 14,
    padding: 4,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    backgroundColor: colors.light.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  segmentText: {
    color: colors.light.GRAY_400,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.light.MAIN_DARK_TEXT,
  },
});
