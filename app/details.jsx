import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { formatDate, formatNumberWithDots } from '../utils/utils';
import { commonStyles } from '../styles/commonStyles';
import FloatingActionButton from '../components/FloatingActionButton';
const Detail = () => {
  const item = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.overview}>
        <Text style={[commonStyles.title, {color: 'white'}]}>Detalle de Evento</Text>
        <Text style={styles.label}>Fecha: {formatDate(item.fecha)}</Text>
        <Text style={styles.label}>Cliente: {item.cliente}</Text>
        <Text style={styles.label}>Evento: {item.evento}</Text>
        <Text style={styles.label}>Monto Total: Gs. {formatNumberWithDots(item.monto_total)}</Text>
    </View>
      <FloatingActionButton icon='pencil' onPress={() => router.push('/form')} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
  },
  overview:{
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 50,
    color: 'white',
  },
  value: {
    fontSize: 18,
    color: 'white',
  },
});

export default Detail;
