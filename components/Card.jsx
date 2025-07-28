import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { formatDate, formatNumberWithDots } from '../utils/utils';
import { useRouter } from 'expo-router';
import EventBadge from './Badge';
import Colors from '../constants/colors';

const Card = ({item}) => {
    const router = useRouter();

      const handlePress = () => {
    router.push({
      pathname: '/details',
      params: { ...item },
    });
  };

  return (
    <Pressable onPress={handlePress}>

        <View style={styles.card}>
        <Text style={styles.date}>{formatDate(item.fecha)}</Text>
        <Text style={styles.name}>{item.cliente}</Text>
        <View style={styles.rowBetween}>
            <EventBadge evento={item.evento} />
                <Text style={styles.amount}>Gs. {formatNumberWithDots(item.monto_total)}</Text>
          </View>
        </View>
    </Pressable>
  )
}

export default Card

const styles = StyleSheet.create({

  card: {
  backgroundColor: Colors.offWhite,
  padding: 16,
  marginBottom: 12,
  borderRadius: 10,

 
  borderWidth: 1,
  borderColor: '#e0e0e0', 


  elevation: 1, // Android
  shadowColor: '#000', // iOS
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 2,
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