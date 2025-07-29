import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IconButton = ({ title, iconName, onPress, iconSize = 20, iconColor = '#fff', backgroundColor = '#007bff', loading = false, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} style={styles.icon} />
      ) : (
        <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    marginLeft: 8,
  },
});
