import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { formatDate, formatNumberWithDots } from '../utils/utils';
import { useRouter } from 'expo-router';


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
            <Text style={styles.description}>{item.evento}</Text>
            <Text style={styles.amount}>Gs. {formatNumberWithDots(item.monto_total)}</Text>
          </View>
        </View>
    </Pressable>
  )
}

export default Card

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f7f7f7',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    color: '#007bff',
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