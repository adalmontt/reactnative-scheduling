import { View, Text, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Switch, Button, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Pressable, Modal, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatDate, formatDateDetails, formatNumberWithDots, parseExtraServices, removeDots } from '../utils/utils';
import { commonStyles } from '../styles/commonStyles';
import { useEffect, useState } from 'react';
import ModalConfirm from '../components/ModalConfirm';
import { GOOGLE_SHEET_ITEMS_URL, GOOGLE_SHEET_URL } from '../config/config';
import CustomAlert from '../components/CustomAlert';
import HeaderWithBack from '../components/headerWithBack';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditableField from '../components/EditableField';
import ScreenLayout from '../components/ScreenLayout';
import IconButton from '../components/IconButton';
import SharePDFButton from '../components/SharePDFButton';
import { Ionicons } from '@expo/vector-icons';
import ModalList from '../components/ModalList';
import { categorias } from '../constants/constants';



const Detail = () => {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [servicesState, setServicesState] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [availableServiceKeys, setAvailableServiceKeys] = useState([]);

  // Editable fields
  const [descripcion, setDescripcion] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [cantidadPersonas, setCantidadPersonas] = useState('');
  const [pagado, setPagado] = useState('');
  const [montoTotal, setMontoTotal] = useState('');



  // Carga los datos
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${GOOGLE_SHEET_URL}&id=${id}`);
        const result = await response.json();
        setItem(result);
        setDescripcion(result.descripcion);
        setCantidadPersonas(result.cantidad_personas);
        setPagado(result.pagado);
        setMontoTotal(result.monto_total);
      } catch (error) {
        console.error('Error fetching item:', error);
        showAlert('Error', 'No se pudo cargar el evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);


  // Alertas setter
  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };


  // Delete
  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsEditing(true);
    const body = {
      id: item.id,
      show: 'false',
    };

    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.result === 'updated') {
        showAlert('Evento Eliminado', 'Evento eliminado correctamente.');
        setIsEditing(false);
        router.back();
      } else {
        showAlert('Error', 'No se pudo ocultar el evento.');
      }
    } catch (error) {
      console.error('Error al ocultar:', error);
      showAlert('Error', 'No se pudo ocultar el evento.');
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  // Parsea extra services
  useEffect(() => {

    if (item?.extra_services) {
      // item.extra_services may come as an object or string, handle both cases:
      let parsedServices = {};

      if (typeof item.extra_services === 'string') {
        // Try to parse JSON string (sometimes backend sends stringified JSON)
        try {
          parsedServices = JSON.parse(item.extra_services);
        } catch {
          // fallback to old parser for `{key=value,...}` format
          parsedServices = Object.fromEntries(
            item.extra_services
              .replace(/{|}/g, '')
              .split(', ')
              .map(pair => {
                const [key, value] = pair.split('=');
                return [key, Number(value) || 0];
              })
          );
        }
      } else {
        // Already an object
        parsedServices = item.extra_services;
      }

      // Convert to structure: { key: { selected: boolean, quantity: number } }
      const servicesStateWithSelection = Object.fromEntries(
        Object.entries(parsedServices).map(([key, quantity]) => [
          key,
          {
            selected: quantity > 0,
            quantity: quantity,
          },
        ])
      );

      setServicesState(servicesStateWithSelection);
    }
  }, [item]);



  // Post edit
  const handleEdit = async () => {
    if (isEditing) return; // prevent double click

    setIsEditing(true);
    try {
      const cleanedExtraServices = Object.entries(servicesState)
        .filter(([_, val]) => val.selected && val.quantity > 0)
        .reduce((acc, [key, val]) => {
          acc[key] = val.quantity;
          return acc;
        }, {});

      const body = {
        id: item.id,
        extra_services: cleanedExtraServices,
        descripcion,
        cantidad_personas: cantidadPersonas,
        pagado: removeDots(pagado),
        monto_total: removeDots(montoTotal),
      };


      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });


      const result = await response.json();
      if (result.result === 'updated') {
        showAlert('Actualizado', 'Evento actualizado.');
      } else {
        showAlert('Error', 'No se pudo actualizar el evento.');
      }
    } catch (err) {
      showAlert('Error', 'No se pudo actualizar el evento.');
    } finally {
      setIsEditing(false);
    }
  };



  const fetchData = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_ITEMS_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();


      // Sort by category (based on predefined order) then by nombre
      const categoriasOrder = categorias.map(c => c.value);

      const sorted = [...data]
        .filter(item => item.categoria.toLowerCase() !== 'quinta') // ⛔ exclude "quinta"
        .sort((a, b) => {
          const catA = categoriasOrder.indexOf(a.categoria);
          const catB = categoriasOrder.indexOf(b.categoria);
          if (catA !== catB) return catA - catB;


          return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
        });

      // Normalize nombre to key format (used internally)
      const keysFromData = sorted.map(item =>
        item.nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')
      );
      setAvailableServiceKeys(keysFromData);
    } catch (err) {
      Alert("Error", "Error al recuperar los items");
    } finally {
      setLoading(false);
    }
  };




  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }
  else if (item) {
    return (

      <ScreenLayout
        isSpinner={isEditing || loading}
      >

        <HeaderWithBack
          title="Detalle de Evento"
          sideIcon="trash-outline"
          sideFunction={() => setShowDeleteModal(true)}
          sideTitle="Eliminar Evento"
          sideColor='red'
        />
        <ScrollView
          contentContainerStyle={[commonStyles.container, { paddingBottom: 100 }]} // add padding bottom
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.overview}>


            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.data}>{formatDateDetails(item.fecha)}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.data}>{item.cliente}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Evento:</Text>
              <Text style={styles.data}>{item.evento}</Text>
            </View>

            <EditableField
              label="Monto total:"
              value={montoTotal}
              onChange={setMontoTotal}
              keyboardType="numeric"
              textStyle={styles.data}
              labelStyle={styles.label}
              prefix="Gs. "
              formatWithDots={true}
            />

            <EditableField
              label="Cantidad de personas:"
              value={cantidadPersonas}
              onChange={setCantidadPersonas}
              keyboardType="numeric"
              textStyle={styles.data}
              labelStyle={styles.label}
            />

            <EditableField
              label="Pagado:"
              value={pagado}
              onChange={setPagado}
              keyboardType="numeric"
              textStyle={styles.data}
              labelStyle={styles.label}
              prefix="Gs. "
              formatWithDots={true}

            />


          </View>

          {/* <Text style={[styles.secondayTitle, { marginTop: 30 }]}>Compartir PDF</Text>


          <View style={{ marginTop: 10, marginLeft: 20 }}>
            <SharePDFButton
              data={{
                cliente: item.cliente,
                evento: item.evento,
                fecha: item.fecha,
                cantidad_personas: cantidadPersonas,
                descripcion: descripcion,
                extra_services: item.extra_services,
                monto_total: montoTotal,
                pagado: pagado,
              }}
            />
          </View> */}


          <View style={{ marginTop: 30 }}>

            <Text style={styles.secondayTitle}>Descripcion o comentarios</Text>

            {isEditingDesc ? (
              <TextInput
                style={[styles.descripcion, styles.descripcionInput]}
                value={descripcion}
                onChangeText={setDescripcion}
                onBlur={() => setIsEditingDesc(false)} // Auto-exit on blur
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                autoFocus
              />
            ) : (
              <Text
                style={styles.descripcion}
                onPress={() => setIsEditingDesc(true)}
              >
                {descripcion.trim() !== '' ? descripcion : 'Sin descripción (tocar para editar)'}
              </Text>
            )}


            <View style={{ marginTop: 10 }}>
              <View style={commonStyles.rowBetween}>
                <Text style={styles.secondayTitle}>Servicios Seleccionados</Text>

                <Pressable
                  onPress={() => setShowServiceModal(true)}
                  style={commonStyles.iconAdd}
                >
                  <Ionicons name="add" size={24} color="black" />
                </Pressable>
              </View>


              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {Object.entries(servicesState)
                  .filter(([_, val]) => val.selected)
                  .map(([key, val]) => {
                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    return (
                      <View key={key} style={commonStyles.chip}>
                        <Text style={commonStyles.chipText}>{val.quantity != 1 ? val.quantity : ""} {label}</Text>
                        <Text style={commonStyles.removeBtn} onPress={() => {
                          setServicesState(prev => ({
                            ...prev,
                            [key]: { selected: false, quantity: 0 },
                          }));
                        }}>✕</Text>

                      </View>
                    );
                  })}
              </View>







            </View>


            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <IconButton
                title="Actualizar"
                iconName="refresh"
                onPress={handleEdit}
                backgroundColor="black"
                iconColor="#fff"
                loading={false}
                disabled={isEditing}
              />
            </View>

            <ModalList
              visible={showServiceModal}
              title="Agregar Servicio"
              items={availableServiceKeys}
              onSelect={(key, qty) => {
                setServicesState(prev => ({
                  ...prev,
                  [key]: { selected: true, quantity: qty || 1 },
                }));
                setShowServiceModal(false);
              }}
              onClose={() => setShowServiceModal(false)}
            />


          </View>



          <ModalConfirm
            visible={showDeleteModal}
            message="¿Estás seguro que deseas eliminar este evento?"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
          <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
          />



        </ScrollView>


      </ScreenLayout >

    );
  }
};


const styles = StyleSheet.create({

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    fontFamily: 'Roboto',
  },
  labelAdditional: {
    fontSize: 16,
  },
  dataWhite: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'right',
    color: 'white',
  },
  data: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'right',
    fontFamily: 'Roboto',

  },
  dataAdditional: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  secondayTitle: {
    fontSize: 16,
    fontFamily: 'Roboto',
    marginBottom: 15
  },

  value: {
    fontSize: 18,
    color: 'white',
  },
  spinnerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  descripcion: {
    fontSize: 16,
    padding: 8,
    color: '#333',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  descripcionInput: {
    backgroundColor: '#f9f9f9',
    minHeight: 60,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },

});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
});


export default Detail;
