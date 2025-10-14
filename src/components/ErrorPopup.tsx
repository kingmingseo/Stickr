import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';
import Icon from 'react-native-vector-icons/Ionicons';

interface ErrorPopupProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

const { width } = Dimensions.get('window');

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  visible,
  onClose,
  title,
  message,
  type = 'error',
}) => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  const getIconName = () => {
    switch (type) {
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'close-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#EF4444';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#FEF2F2';
      case 'warning':
        return '#FFFBEB';
      case 'info':
        return '#EFF6FF';
      default:
        return '#FEF2F2';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return '#FECACA';
      case 'warning':
        return '#FED7AA';
      case 'info':
        return '#DBEAFE';
      default:
        return '#FECACA';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />

        <View
          style={[
            styles.container,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            },
          ]}
        >
          {/* 아이콘 */}
          <View style={styles.iconContainer}>
            <Icon name={getIconName()} size={48} color={getIconColor()} />
          </View>

          {/* 제목 */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* 메시지 */}
          <Text style={styles.message}>{message}</Text>

          {/* 버튼 */}
          <Pressable
            style={[styles.button, { backgroundColor: getIconColor() }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styling = (theme: ThemeMode) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: width * 0.85,
    maxWidth: 320,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors[theme].MAIN_DARK_TEXT,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: colors[theme].SUB_DARK_TEXT,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ErrorPopup;
