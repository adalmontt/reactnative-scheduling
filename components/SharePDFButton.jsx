import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { generateAndSharePDF } from '../utils/generatePDF';

const SharePDFButton = ({ data, size = 24, color = '#28a745', backgroundColor = 'white', onShared }) => {
  const handleShare = () => {
    if (!data) return;
    generateAndSharePDF(data);
    if (onShared) onShared();
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={handleShare}
      activeOpacity={0.7}
    >
      <Ionicons name="share-social-outline" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25, // half of width/height to make it a perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745', // fallback if not passed as prop
    elevation: 4, // optional shadow for Android
    shadowColor: '#000', // optional shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default SharePDFButton;
