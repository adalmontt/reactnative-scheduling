import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const Header = () => {


  return (
    <View style={styles.container}>
        <Text style={{fontFamily: 'PlayfairDisplayItalic', fontSize: 23}}>Villa Francis</Text>
          <TouchableOpacity>
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
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  }
});