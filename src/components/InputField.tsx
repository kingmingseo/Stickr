import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React, { Ref } from 'react';
import { colors } from '../constants/colors';

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
  return (
    <View>
      <TextInput
        {...props}
        placeholderTextColor={colors.light.GRAY_400}
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

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    justifyContent: 'center',
    height: 50,
    borderColor: colors.light.GRAY_200,
    borderRadius: 12,
    fontSize: 16,
    color: colors.light.MAIN_DARK_TEXT,
    backgroundColor: colors.light.WHITE,
    paddingHorizontal: 10,
  },
  error: {
    color: colors.light.RED_500,
    fontSize: 12,
    paddingTop: 5,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.light.RED_300,
  },
  multiline: {
    height: 150,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  disabled: {
    backgroundColor: colors.light.GRAY_200,
    color: colors.light.GRAY_400,
  },
});
