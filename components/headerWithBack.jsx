import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';


const HeaderWithBack = ({
  title,
  color = 'black',
  backgroundColor,
  sideIcon,        // name of the right icon (Ionicons)
  sideColor = '',  // optional style for right icon button
  sideFunction,    // onPress function for right icon
  sideTitle = '',  // accessibility label for right icon button
}) => {
  const router = useRouter();
  const navigationState = useNavigationState((state) => state);


  const handleBack = () => {
    const currentRoute = navigationState.routes[navigationState.index];
    const previousRoute = navigationState.routes[navigationState.index - 1];

    if (previousRoute?.name === currentRoute?.name) {
      router.push('/'); // fallback route
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, backgroundColor && { backgroundColor }]}>
      <View style={styles.titleSection}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={color} />
        </TouchableOpacity>
        <Text style={[styles.title, { color }]}>{title}</Text>
      </View>
      {sideIcon && sideFunction && (
        <TouchableOpacity
          onPress={sideFunction}
          style={[styles.sideButton]}
          accessibilityLabel={sideTitle}
        >
          <Ionicons name={sideIcon} size={24} color={sideColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderWithBack;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',

  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  backButton: {
    marginTop: 7,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplayItalic',
    textAlign: 'center',
  },
  sideButton: {
    marginTop: 7,
    color: 'red'
  },
});
