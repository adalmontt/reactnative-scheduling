import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { formatNumberWithDots, removeDots } from '../utils/utils';

const EditableField = ({
  label,
  value,
  onChange,
  keyboardType = 'default',
  multiline = false,
  textStyle = {},
  inputStyle = {},
  labelStyle = {},
  placeholder = '',
  prefix = '',
formatWithDots = false,

}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChangeText = (text) => {
    const raw = removeDots(text.replace(prefix, '').trim());
    const formatted = formatWithDots ? formatNumberWithDots(raw) : raw;
    onChange(formatted); // keep formatted value in state
  };

  return (
    <View style={styles.row}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>

      {isEditing ? (
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          autoFocus
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
        />
      ) : (
        <Pressable onPress={() => setIsEditing(true)} style={{ flex: 1 }}>
          <Text style={[styles.text, textStyle]}>
            {value && value !== ''
                ? `${prefix}${formatWithDots ? formatNumberWithDots(removeDots(value)) : value}`
                : '—'}          
        </Text>
        </Pressable>
      )}
    </View>
  );
};

export default EditableField;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {

  },
  text: {
    
  },
  input: {
    flex: 2,
    color: "white",
    borderColor: '#ccc',
    textAlign: 'right',
  },
});
