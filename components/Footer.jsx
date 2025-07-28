import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#000' : 'white';
  const textColor = isDark ? '#fff' : '#000';
  const iconColor = textColor;
  const borderColor = isDark ? '#333' : '#ccc';

  const [visible, setVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNavigate = (path) => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.footer, {
      backgroundColor,
      borderTopColor: borderColor,
      opacity: fadeAnim,
    }]}>
      <FooterButton icon="home-outline" label="Inicio" onPress={() => handleNavigate('/')} color={iconColor} />
      <FooterButton icon="add-circle-outline" label="Agregar" onPress={() => handleNavigate('/form')} color={iconColor} />
      <FooterButton icon="pricetags-outline" label="Precios" onPress={() => handleNavigate('/precios')} color={iconColor} />
      <FooterButton icon="calendar-outline" label="Calendario" onPress={() => handleNavigate('/calendar')} color={iconColor} />
    </Animated.View>
  );
};

const FooterButton = ({ icon, label, onPress, color }) => (
  <Pressable style={styles.footerButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={[styles.footerButtonText, { color }]}>{label}</Text>
  </Pressable>
);

export default Footer;

const styles = StyleSheet.create({
  footer: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 10,
  borderTopWidth: 1,
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
});
