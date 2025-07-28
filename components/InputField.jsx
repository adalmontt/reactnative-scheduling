import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

const InputField = React.memo((props) => {
  const {
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    editable = true,
    numberOfLines = 1,
    isRequired = false,
  } = props;

  return (
    <View style={styles.container}>
      <Text style={commonStyles.inputLabel}>
        {label}
        {isRequired && <Text style={{ color: 'red' }}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input]}
        keyboardType={keyboardType}
        editable={editable}
        numberOfLines={numberOfLines}
        multiline={numberOfLines > 1}
        textAlignVertical="top"
      />
    </View>
  );
});

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