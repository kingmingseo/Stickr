import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HeartButtonProps {
  isHeartPressed: boolean;
  handleHeartPress: () => void;
}

const HeartButton = ({
  isHeartPressed,
  handleHeartPress,
}: HeartButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.heartButton,
        {
          top: 4,
          right: 4,
        },
      ]}
      onPress={handleHeartPress}
      activeOpacity={0.7}
    >
      <Icon
        name={isHeartPressed ? 'heart' : 'heart-o'}
        size={15}
        color={isHeartPressed ? '#FF6B6B' : '#FFFFFF'}
        style={styles.heartIcon}
      />
    </TouchableOpacity>
  );
};

export default HeartButton;

const styles = StyleSheet.create({
  heartButton: {
    position: 'absolute',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
