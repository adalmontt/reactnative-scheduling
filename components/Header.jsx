import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const navigate = (path) => {
    setMenuVisible(false);
    router.push(path);
  };

  return (
    <View>
      {/* Header */}
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' , gap: 10}}>
          <Ionicons name="leaf-outline" size={20} color="green" />
          <Text style={{ fontFamily: 'PlayfairDisplayItalic', fontSize: 23 }}>Villa Francis</Text>
        </View>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Overlay Menu */}
      {menuVisible && (
        <Pressable style={styles.backdrop} onPress={toggleMenu}>
          <View style={styles.menu}>
            <Text style={{ fontFamily: 'PlayfairDisplayItalic', fontSize: 16, marginBottom: 15  }}>Menú</Text>
            <TouchableOpacity onPress={() => navigate('/preciosForm')} style={styles.menuItem}>
              <Ionicons name="pricetags-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Precios</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/contact')} style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/settings')} style={styles.menuItem}>
              <Ionicons name="settings-outline" size={20} color="#333" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
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
    zIndex: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 20,
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.6,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
    shadowRadius: 6,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});
