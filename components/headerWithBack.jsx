import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '../styles/commonStyles';

const HeaderWithBack = ({ title, color, backgroundColor }) => {
  const router = useRouter();

  return (
<View style={[styles.container, backgroundColor ? { backgroundColor } : {}]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={color? color : 'Black'} />
      </TouchableOpacity>
        <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplayItalic', color: color ? color : 'black' }}>
        {title}
        </Text>    
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
    paddingLeft: 20
  },
  backButton: {
    marginRight: 10,
    marginTop: 7,
  },
});
