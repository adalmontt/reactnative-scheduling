import { View, Text, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Switch, Button, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatDate, formatDateDetails, formatNumberWithDots, parseExtraServices, removeDots } from '../utils/utils';
import { commonStyles } from '../styles/commonStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import { useEffect, useState } from 'react';
import ModalConfirm from '../components/ModalConfirm';
import { GOOGLE_SHEET_URL } from '../config/config';
import CustomAlert from '../components/CustomAlert';
import HeaderWithBack from '../components/headerWithBack';
import { SERVICE_LABELS } from '../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditableField from '../components/EditableField';
import Footer from '../components/Footer';
import ScreenLayout from '../components/ScreenLayout';
import IconButton from '../components/IconButton';
import { generateAndSharePDF } from '../utils/generatePDF';
import SharePDFButton from '../components/SharePDFButton';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from '../components/Checkbox';



const Detail = () => {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isHiding, setIsHiding] = useState(false);
  const [servicesState, setServicesState] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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
    setIsHiding(true);
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


  // Swtich extra services
  const handleToggleService = (key) => {
    setServicesState(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
        showAlert('Actualizado', 'Servicios adicionales actualizados.');
      } else {
        showAlert('Error', 'No se pudo actualizar los servicios.');
      }
    } catch (err) {
      console.error('Error al enviar extra services:', err);
      showAlert('Error', 'Fallo la actualización.');
    } finally {
      setIsEditing(false);
    }
  };


  const orderedKeys = [
    'decoracion',
    'asado',
    'buffet',
    'lomito',
    'hamburguesa',
    'entrada',
    'bocaditos_dulces',
    'chop_30',
    'chop_50',
    'tragos_50',
    'tragos_100',
    'mozos'
  ];



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
        footer='false'
        isSpinner={isEditing}
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
              <Text style={styles.dataWhite}>{formatDateDetails(item.fecha)}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.dataWhite}>{item.cliente}</Text>
            </View>

            <View style={commonStyles.rowBetween}>
              <Text style={styles.label}>Evento:</Text>
              <Text style={styles.dataWhite}>{item.evento}</Text>
            </View>

            <EditableField
              label="Monto total:"
              value={montoTotal}
              onChange={setMontoTotal}
              keyboardType="numeric"
              textStyle={styles.dataWhite}
              labelStyle={styles.label}
              prefix="Gs. "
              formatWithDots={true}
            />

            <EditableField
              label="Cantidad de personas:"
              value={cantidadPersonas}
              onChange={setCantidadPersonas}
              keyboardType="numeric"
              textStyle={styles.dataWhite}
              labelStyle={styles.label}
            />

            <EditableField
              label="Pagado:"
              value={pagado}
              onChange={setPagado}
              keyboardType="numeric"
              textStyle={styles.dataWhite}
              labelStyle={styles.label}
              prefix="Gs. "
              formatWithDots={true}

            />


          </View>

          <View style={{ marginTop: 30, marginLeft: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Compartir PDF</Text>

            <View style={{ marginTop: 10 }}>
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
            </View>
          </View>

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


            <Text style={styles.secondayTitle}>Servicios Adicionaless</Text>

            {/* <FlatList
              data={orderedKeys}
              keyExtractor={(key) => key}
              scrollEnabled={false}
              renderItem={({ item: key }) => {
                const service = servicesState[key] || { selected: false, quantity: 0 };
                return (
                  <View style={commonStyles.rowBetweenClose}>
                    <Text style={styles.labelAdditional}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Switch
                      value={service.selected}
                      onValueChange={() => {
                        setServicesState(prev => ({
                          ...prev,
                          [key]: {
                            selected: !service.selected,
                            quantity: service.quantity
                          },
                        }));
                      }}
                    />
                    {service.selected && (
                      <TextInput
                        style={{
                          width: 60,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          marginLeft: 10,
                          textAlign: 'center',
                        }}
                        keyboardType="numeric"
                        value={String(service.quantity)}
                        onChangeText={(val) => {
                          const qty = val.replace(/[^0-9]/g, '');
                          setServicesState(prev => ({
                            ...prev,
                            [key]: {
                              selected: service.selected,
                              quantity: Number(qty) || 0,
                            },
                          }));
                        }}
                      />
                    )}
                  </View>
                );
              }}
            /> */}


            <View style={{ marginTop: 10 }}>
              {/* Header */}
              <View style={[styles.tableRow, { marginBottom: 10 }]}>
                <Text style={[styles.tableHeader, { flex: 1 }]}>✔</Text>
                <Text style={[styles.tableHeader, { flex: 3 }]}>Servicio</Text>
                <Text style={[styles.tableHeader, { flex: 2 }]}>Cantidad</Text>
              </View>

              {orderedKeys.map((key) => {
                const service = servicesState[key] || { selected: false, quantity: 0 };
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <View
                    key={key}
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: service.selected ? '#ADD8E6' : 'white',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderRadius: 6,
                        marginBottom: 8,
                      },
                    ]}
                  >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Checkbox
                    value={service.selected}
                    onValueChange={(val) => {
                      setServicesState(prev => ({
                        ...prev,
                        [key]: {
                          ...service,
                          selected: val,
                        },
                      }));
                    }}
                  />
                </View>

                    <Text style={[styles.tableCell, { flex: 3 }]}>{label}</Text>

                    <View style={{ flex: 2, justifyContent: 'center' }}>
                      <TextInput
                        placeholder="0"
                        keyboardType="numeric"
                        editable={service.selected}
                        style={{
                          opacity: service.selected ? 1 : 0.4,
                          height: 40,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 5,
                          paddingHorizontal: 10,
                          backgroundColor: service.selected ? '#fff' : '#eee',
                          textAlign: 'center',
                        }}
                        value={String(service.quantity || '')}
                        onChangeText={(val) => {
                          const qty = val.replace(/[^0-9]/g, '');
                          setServicesState(prev => ({
                            ...prev,
                            [key]: {
                              ...service,
                              quantity: Number(qty) || 0,
                            },
                          }));
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>


            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <IconButton
                title="Actualizar"
                iconName="refresh"
                onPress={handleEdit}
                backgroundColor="#007bff"
                iconColor="#fff"
                loading={false}
                disabled={isEditing}
              />
            </View>

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


      </ScreenLayout>

    );
  }
};


const styles = StyleSheet.create({

  descripcion: {
    fontSize: 16,
    marginBottom: 15,
    flex: 1
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
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
  dataAdditional: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  secondayTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplayNormal',
    marginBottom: 15,
  },

  overview: {
    backgroundColor: '#007bff',
    padding: 20,
    color: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,

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

export default Detail;
