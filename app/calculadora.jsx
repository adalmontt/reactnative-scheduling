import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Button, Alert, View, Text, ActivityIndicator, Switch, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SectionList, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import InputField from '../components/InputField';
import DatePickerField from '../components/DatePickerField';
import Dropdown from '../components/DropdownField';
import { GOOGLE_SHEET_ITEMS_URL, GOOGLE_SHEET_PRECIOS_URL, GOOGLE_SHEET_URL } from '../config/config';
import { commonStyles } from '../styles/commonStyles';
import { formatDate, formatNumberWithDotsInput, removeDots } from '../utils/utils';
import RadioGroup from '../components/RadioGroup';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithBack from '../components/headerWithBack';
import Checkbox from '../components/Checkbox';
import Footer from '../components/Footer';
import ModalConfirm from '../components/ModalConfirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenLayout from '../components/ScreenLayout';
import PriceComboCard from '../components/PriceComboCard';
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import PriceCard from '../components/PriceCard';
import { categorias, categoryColors } from '../constants/constants';


const Precios = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };


  const groupedItems = categorias.map(cat => ({
    title: cat.label,
    categorias: cat.value,
    data: cartItems.filter(item => item.categoria === cat.value),
  })).filter(section => section.data.length > 0);


  //GET LOGIC
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(GOOGLE_SHEET_ITEMS_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // console.log(data);
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // SOME MAPPING AFTER FETCHING 
useEffect(() => {
  if (data) {
    const initialized = data
      .filter(item => item.show)
      .sort((a, b) => a.nombre.localeCompare(b.nombre)) // ⬅️ sort by name
      .map(item => ({
        ...item,
        quantity: 0,
        priceOverride: null,
      }));
    setCartItems(initialized);
  }
}, [data]);


  // MANUAL UPDATE 
  const updateItem = (id, field, value) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // TOTAL
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + (item.priceOverride ?? item.precio) * item.quantity,
    0
  );



  return (
    <ScreenLayout>

      <HeaderWithBack
        title="Calculadora"
        sideIcon="add-circle-outline"
        sideFunction={() => setShowSaveModal(true)}
        sideTitle="Agregar"
      />

      <Text style={styles.grandTotal}>Total: Gs. {grandTotal.toLocaleString()}</Text>



      {loading || !data ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10, color: '#666' }}>Cargando datos...</Text>
        </View>
      ) : (
        <SectionList
          sections={groupedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderSectionHeader={({ section }) => {
            const sectionTotal = section.data.reduce(
              (sum, item) => sum + (item.priceOverride ?? item.precio) * item.quantity,
              0
            );

            return (
              <View style={[styles.sectionHeader, { backgroundColor: 'white' }]}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{section.title}</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'blue' }}>
                  (Gs. {sectionTotal.toLocaleString()})
                </Text>
              </View>
            );
          }}
          renderItem={({ item, index, section }) => (
            <View
              style={[
                styles.row,
                {
                  backgroundColor: categoryColors[item.categoria] || '#fff',
                  marginTop: index === 0 ? 12 : 0, // Add spacing between sections
                  borderTopWidth: index === 0 ? 1 : 0,
                  paddingTop: 10
                },
              ]}
            >

              <Text numberOfLines={0} style={styles.name}>{item.nombre}</Text>


              <View style={styles.innerRow}>


                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <InputField
                    value={(item.priceOverride ?? item.precio).toString()}
                    keyboardType="numeric"
                    placeholder={item.precio.toString()}
                    onChangeText={(text) => updateItem(item.id, 'priceOverride', parseInt(text || '0'))}
                    style={[styles.input]}
                    styleInput={{ borderWidth: 0, borderColor: 'transparent' }}
                  />
                  <Text style={{fontSize: 12, paddingTop: 10, fontWeight: 'bold'}}>X</Text>
                  <InputField
                    value={item.quantity.toString()}
                    keyboardType="numeric"
                    placeholder="0"
                    onChangeText={(text) => updateItem(item.id, 'quantity', parseInt(text || '0'))}
                    style={styles.input}
                    styleInput={{ borderWidth: 0, borderColor: 'transparent' }}
                  />
                </View>


                <Text style={styles.total}>
                  {((item.priceOverride ?? item.precio) * item.quantity).toLocaleString()}
                </Text>

              </View>
            </View>
          )}
        />
      )
      }



      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />



    </ScreenLayout>
  );
};

export default Precios;

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 15
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  innerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'column',
    alignItems: 'right',
    paddingHorizontal: 12,

   
  },
  column: {
    flex: 1,
    paddingHorizontal: 4,
  },
  rowEven: {
    backgroundColor: '#fafafa',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  input: {

    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  total: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'right',
    paddingHorizontal: 16,
    color: '#222',
  },
});
