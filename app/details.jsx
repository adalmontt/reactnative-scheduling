import { View, Text, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Switch, Button, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatDate, formatDateDetails, formatNumberWithDots, parseExtraServices } from '../utils/utils';
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
        const response = await fetch(`${GOOGLE_SHEET_URL}?id=${id}`);
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
      const extraServicesString = item.extra_services || '{}';
      const parsed = Object.fromEntries(
        extraServicesString
          .replace(/{|}/g, '')
          .split(', ')
          .map(pair => {
            const [key, value] = pair.split('=');
            return [key, value === 'true'];
          })
      );
      setServicesState(parsed);
    }
  }, [item]);


  // Swtich extra services
  const handleToggleService = (key) => {
    setServicesState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Post edit
  const handleEdit = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id,
          extra_services: servicesState,
          descripcion: descripcion,

        }),
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

      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if you have header/navbar
        >

          <HeaderWithBack
            title="Detalle de Evento"
          />
          <ScrollView
            contentContainerStyle={[commonStyles.container, { paddingBottom: 40 }]} // add padding bottom
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

              {orderedKeys.map(key => (
                <View key={key} style={commonStyles.rowBetweenClose}>
                  <Text style={styles.labelAdditional}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  <Switch
                    value={servicesState[key] || false}
                    onValueChange={() => handleToggleService(key)}

                  />
                </View>
              ))}
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Button
                  title="Actualizar"
                  onPress={handleEdit}
                  color="#007bff"
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
            {isHiding && (
              <View style={styles.spinnerOverlay}>
                <ActivityIndicator size="large" color="#007bff" />
              </View>
            )}

          </ScrollView>

          <FloatingActionButton
            icon="grid"
            actions={[
              { icon: 'trash', color: 'red', onPress: () => setShowDeleteModal(true) },
            ]}
          />
        </KeyboardAvoidingView>

      </SafeAreaView>


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
  }


});

export default Detail;
