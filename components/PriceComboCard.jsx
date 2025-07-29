import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { formatNumberWithDots } from '../utils/utils';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';

const PriceComboCard = ({ item }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleNavigate = () => {
    router.push({
      pathname: '/',
      params: { ...item },
    });
  };

  const renderTable = () => {
    const data =  
     [{"name":"Nombre","price":"450000","description":"Ninguna","subElements":["Hello","Bye"]},{"name":"Apellido","price":"60000","description":"No ","subElements":[""]}]
    ;
if (!data || data.length === 0) {
    return <Text style={styles.noData}>Sin detalles</Text>;
  }
  return (
    <View style={styles.table}>
      {data.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableTitle}>{item.name || '-'}</Text>
          <Text style={styles.tableValue}>
            {item.price ? `Gs. ${formatNumberWithDots(item.price)}` : 'Gs. -'}
          </Text>
          <Text style={styles.tableDescription}>
            {item.description?.trim() ? item.description : 'Sin descripción'}
          </Text>

          <View style={styles.subElementsContainer}>
            {(Array.isArray(item.subElements) && item.subElements.some(s => s.trim())) ? (
              item.subElements.map((sub, i) =>
                sub.trim() ? (
                  <Text key={i} style={styles.subElement}>• {sub}</Text>
                ) : null
              )
            ) : (
              <Text style={styles.subElement}>Sin sub-elementos</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};



  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.nombre_combo}</Text>
        <Text style={styles.description}>Tipo: {item.tipo_evento}</Text>

        {expanded && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.subtitle}>Detalle de precios:</Text>
            {renderTable()}

            <Pressable onPress={handleNavigate} style={styles.detailsButton}>
              <Text style={styles.detailsText}>Ver más</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default PriceComboCard;


const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.offWhite,
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  table: {
      marginVertical: 10,
  },
  tableRow: {
      backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
    tableTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  tableKey: {
    fontSize: 14,
    color: '#444',
    textTransform: 'capitalize',
  },
  tableValue: {
     fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  tableDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  subElementsContainer: {
    paddingLeft: 8,
  },
  subElement: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  noData: {
      fontStyle: 'italic',
    color: '#999',
    padding: 10,
    textAlign: 'center',
  },
  detailsButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primary || '#007bff',
    borderRadius: 6,
  },
  detailsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
