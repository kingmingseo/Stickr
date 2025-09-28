import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';

interface BottomSheetItem {
  label: string;
  onPress: () => void;
}

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: BottomSheetItem[];
  cancelText?: string;
  style?: ViewStyle;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  items,
  cancelText = '취소',
  style,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <View style={[styles.bottomSheet, style]}>
        <Text style={styles.sheetTitle}>{title}</Text>
        
        {items.map((item, index) => (
          <Pressable
            key={index}
            style={styles.sheetItem}
            onPress={item.onPress}
          >
            <Text style={styles.sheetItemText}>{item.label}</Text>
          </Pressable>
        ))}
        
        <Pressable style={styles.sheetCancel} onPress={onClose}>
          <Text style={styles.sheetCancelText}>{cancelText}</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.light.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.MAIN_DARK_TEXT,
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.GRAY_100,
  },
  sheetItemText: {
    fontSize: 16,
    color: colors.light.MAIN_DARK_TEXT,
  },
  sheetCancel: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 10,
  },
  sheetCancelText: {
    fontSize: 16,
    color: colors.light.GRAY_400,
    textAlign: 'center',
  },
});

export default BottomSheet;
