
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/commonStyles';


const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  numberOfLines = 1,
}) => {
  const isMultiline = numberOfLines > 1;

  return (
    <View style={styles.container}>
      <Text style={commonStyles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, isMultiline && styles.multiline]}
        keyboardType={keyboardType}
        editable={editable}
        numberOfLines={numberOfLines}
        multiline={isMultiline}
        textAlignVertical={isMultiline ? 'top' : 'center'}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});
