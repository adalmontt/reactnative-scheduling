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
import { categorias } from '../constants/constants';


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

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };






  const sortByCategory = (items) => {
    const categoryOrder = categorias.map(c => c.value.toLowerCase());

    return [...items].sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.categoria?.toLowerCase());
      const bIndex = categoryOrder.indexOf(b.categoria?.toLowerCase());

      const safeA = aIndex === -1 ? categoryOrder.length : aIndex;
      const safeB = bIndex === -1 ? categoryOrder.length : bIndex;

      return safeA - safeB;
    });
  };

  //GET LOGIC
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(GOOGLE_SHEET_ITEMS_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      setData(sortByCategory(data));
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

  const handleDelete = async () => {
    if (!selectedItemToDelete) return;

    setShowDeleteModal(false);

    const body = {
      id: selectedItemToDelete.id,
      show: 'false',
    };

    try {
      const response = await fetch(GOOGLE_SHEET_ITEMS_URL, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.result === 'updated') {
        showAlert('Item eliminado', 'El item fue eliminado correctamente.');
        setSelectedItemToDelete(null);
        fetchData(); // Refresh list
      } else {
        showAlert('Error', 'No se pudo eliminar el item.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      showAlert('Error', 'No se pudo eliminar el item.');
    }
  };


  return (
    <ScreenLayout>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setSelectedItemToDelete(null); // clear selection when tapping elsewhere
        }}
      >
      <View style={{ flex: 1 }}>

        {selectedItemToDelete ? (
          <HeaderWithBack
            title="Precios"
            sideIcon="trash-outline"
            sideFunction={() => setShowDeleteModal(true)}
            sideTitle="Eliminar"
            sideColor="red"
          />
        ) : (
          <HeaderWithBack title="Precios" />
        )}


        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <Pressable onPress={fetchSchedule} style={styles.retryButton}>
              <Text style={styles.retryText}>Intentalo de nuevo</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={data} // <- your original array of combos
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={({ item }) => (
             <PriceCard
                item={item}
                selected={selectedItemToDelete?.id === item.id}
                onLongPress={(pressedItem) => {
                  if (selectedItemToDelete?.id === pressedItem.id) {
                    setSelectedItemToDelete(null); // toggle off
                  } else {
                    setSelectedItemToDelete(pressedItem); // select
                  }
                }}
              />

            )}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (
              <Pressable
                style={[styles.addButtonContainer, { marginBottom: insets.bottom + 20 }]}
                onPress={() => router.push('/preciosForm')}
              >
                <Ionicons name='add-circle-outline' size={40} color='black' />
                <Text numberOfLines={1} style={{ fontSize: 12, fontStyle: 'italic' }}>
                  Nuevo item
                </Text>
              </Pressable>
            )}
          />

        )}



        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />

        <ModalConfirm
          visible={showDeleteModal}
          message="¿Estás seguro que deseas eliminar este evento?"
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedItemToDelete(null);
          }}
          onConfirm={handleDelete}
        />
        </View>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  );
};

export default Precios;

const styles = StyleSheet.create({

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },





  addButtonContainer: {
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // center horizontally without absolute positioning
    marginVertical: 20,  // spacing from list
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 10,
    borderRadius: 6,
  },
});
