// components/Checkbox.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Checkbox = ({ label, value, onValueChange }) => {

    const formatServiceLabel = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\d+/g, num => ` ${num}`); // e.g., "chop_50" → "Chop 50"


  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={styles.container}
    >
      <Ionicons
        name={value ? 'checkbox' : 'square-outline'}
        size={24}
        color={value ? '#007AFF' : '#888'}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.label}>{formatServiceLabel(label)}</Text>
    </Pressable>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});
