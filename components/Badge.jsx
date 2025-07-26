// components/EventBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getBadgeStyle = (evento) => {
  switch (evento) {
    case 'UD/UPD':
      return { backgroundColor: '#3498db' }; // Blue
    case 'Otro':
      return { backgroundColor: '#2ecc71' }; // Green
    case 'Cumpleaños':
      return { backgroundColor: '#e74c3c' }; // Red
    case 'Boda':
      return { backgroundColor: '#f39c12' }; // Orange
    case 'Quince':
      return { backgroundColor: '#9b59b6' }; // Purple
    default:
      return { backgroundColor: '#7f8c8d' }; // Gray
  }
};

const EventBadge = ({ evento }) => {
  return (
    <View style={[styles.badge, getBadgeStyle(evento)]}>
      <Text style={styles.badgeText}>{evento}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default EventBadge;
