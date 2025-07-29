import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Label = ({ children, backgroundColor = '#e0f7fa', textColor = '#0c5460' }) => {
  return (
    <View style={[styles.label, { backgroundColor }]}>
      <Text style={[styles.labelText, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export default Label;

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontSize: 13,
  },
});
