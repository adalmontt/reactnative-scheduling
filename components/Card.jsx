import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { formatDate, formatNumberWithDots } from '../utils/utils';
import { useRouter } from 'expo-router';
import EventBadge from './Badge';
import Colors from '../constants/colors';
import { commonStyles } from '../styles/commonStyles';
import { FontAwesome5 } from '@expo/vector-icons';

const Card = ({ item }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/details',
      params: { ...item },
    });
  };

  const getEventIconData = (evento) => {
    switch (evento) {
      case 'UD/UPD':
        return { icon: 'graduation-cap', color: '#3498db' }; // Blue
      case 'Otro':
        return { icon: 'leaf', color: '#2ecc71' }; // Green
      case 'Cumpleaños':
        return { icon: 'birthday-cake', color: '#e74c3c' }; // Red
      case 'Boda':
        return { icon: 'ring', color: '#f39c12' }; // Orange
      case 'Quince':
        return { icon: 'crown', color: '#9b59b6' }; // Purple
      default:
        return { icon: 'calendar', color: '#7f8c8d' }; // Gray
    }
  };

  const { icon, color } = getEventIconData(item.evento);

  return (
    <Pressable onPress={handlePress}>

      <View style={styles.card}>

        <View style={[commonStyles.rowBetweenClose, { gap: 10 }]}>
          <View>
            {/* <EventBadge evento={item.evento} /> */}
            {
              <View style={{ width: 50, height: 50, backgroundColor: color, alignItems: 'center', justifyContent: 'center', borderRadius: 25 }}>
                <FontAwesome5 name={icon} size={24} color="white" />
              </View>
            }
            {/* <Text style={styles.amount}>Gs. {formatNumberWithDots(item.monto_total)}</Text> */}
          </View>
          <View>
            <Text style={styles.date}>{formatDate(item.fecha)}</Text>
            <Text style={styles.name}>{item.cliente}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default Card

const styles = StyleSheet.create({

  card: {
    // backgroundColor: Colors.offWhite,
    padding: 16,
    marginBottom: 12,
    // borderRadius: 10,


    borderBottomWidth: 1,
    borderColor: '#e0e0e0',



  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
name: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  flexShrink: 1, // prevent overflow
  flexWrap: 'wrap', // allow wrapping
  maxWidth: 220, // or set according to your layout
},

  amount: {
    fontSize: 16,
    // color: '#007bff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 45,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 10,
  },

});