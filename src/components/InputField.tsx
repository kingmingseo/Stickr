import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React, { Ref } from 'react';
import { colors } from '../constants/colors';
import { ThemeMode, useThemeStore } from '../store/themeStore';

interface InputFieldProps extends TextInputProps {
  ref?: Ref<TextInput>;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

const InputField = ({
  error,
  touched,
  disabled = false,
  ...props
}: InputFieldProps) => {
  const theme = useThemeStore(s => s.theme);
  const styles = styling(theme);
  return (
    <View>
      <TextInput
        {...props}
        placeholderTextColor={colors[theme].GRAY_400}
        style={[
          styles.input,
          props.multiline && styles.multiline,
          touched && Boolean(error) && styles.inputError,
          disabled && styles.disabled,
        ]}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize="none"
        editable={!disabled}
      />
      {touched && Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default InputField;

const styling = (theme: ThemeMode) => StyleSheet.create({
  input: {
    borderWidth: 1,
    justifyContent: 'center',
    height: 50,
    borderColor: colors[theme].GRAY_200,
    borderRadius: 12,
    fontSize: 16,
    color: colors[theme].MAIN_DARK_TEXT,
    backgroundColor: colors[theme].WHITE,
    paddingHorizontal: 10,
  },
  error: {
    color: colors[theme].RED_500,
    fontSize: 12,
    paddingTop: 5,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors[theme].RED_300,
  },
  multiline: {
    height: 150,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  disabled: {
    backgroundColor: colors[theme].GRAY_200,
    color: colors[theme].GRAY_400,
  },
});
