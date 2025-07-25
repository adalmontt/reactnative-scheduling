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
        
          <View style={commonStyles.rowBetween}>
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.dataWhite}>{formatDate(item.fecha)}</Text>
          </View>

              <View style={commonStyles.rowBetween}>
                <Text style={styles.label}>Cliente:</Text>
                <Text style={styles.dataWhite}>{item.cliente}</Text>
          </View>

              <View style={commonStyles.rowBetween}>
                <Text style={styles.label}>Evento:</Text>
                <Text style={styles.dataWhite}>{item.evento}</Text>
          </View>

              <View style={commonStyles.rowBetween}>
                <Text style={styles.label}>Monto Total:</Text>
                <Text style={styles.dataWhite}>Gs. {formatNumberWithDots(item.monto_total)}</Text>
          </View>

    </View>
    <View style={commonStyles.container}>
      <Text style={styles.secondayTitle}>Detalles Adicionales</Text>
      <Text>Cantidad de Personas: {item.cantidad_personas}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
    dataWhite: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
  },
  secondayTitle: {
    fontWeight: 'bold',
    fontSize: 15,
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
