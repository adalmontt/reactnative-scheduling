import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon.png')} // Make sure this path is correct
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity >
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   
  },
  logo: {
    width: 100,
    height: 40,
  },
});
