import React, { useEffect, useState } from 'react';
import { ScrollView, Button, Alert, View, Text, ActivityIndicator, Switch, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/InputField';
import DatePickerField from '../components/DatePickerField';
import Dropdown from '../components/DropdownField';
import { GOOGLE_SHEET_ITEMS_URL, GOOGLE_SHEET_URL } from '../config/config';
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
import Colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import ModalList from '../components/ModalList';
import { categorias } from '../constants/constants';


const Form = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [servicesState, setServicesState] = useState({});
  const [availableServiceKeys, setAvailableServiceKeys] = useState([]);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
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



  useEffect(() => {
    fetchData();
  }, []);




  const createInitialFormData = () => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
    fecha: '',
    cliente: '',
    evento: '',
    monto_total: '',
    pagado: '',
    observacion: '',
    cantidad_personas: '',
    show: 'true',
    descripcion: '',
    creado: '',
    extra_services: {},

  });
  const [formData, setFormData] = useState(createInitialFormData());




  const eventoItems = [
    { label: 'Boda', value: 'Boda' },
    { label: 'Quince', value: 'Quince' },
    { label: 'Cumpleaños', value: 'Cumpleaños' },
    { label: 'UD/UPD', value: 'UD/UPD' },
    { label: 'Otro', value: 'Otro' },
  ];


  const handleChange = (name, value, isNested = false, field = 'selected') => {
    setFormData(prev => {
      if (isNested) {
        return {
          ...prev,
          extra_services: {
            ...prev.extra_services,
            [name]: {
              ...prev.extra_services[name],
              [field]: value
            }
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };



  const handleSubmit = async () => {

    if (!formData.fecha || !formData.cliente || !formData.evento) {
      Alert.alert('Error', 'Complente todos los campos obligatorios con *');
      setShowSaveModal(false);
      return;
    }


    setShowSaveModal(false);
    setLoading(true);

    const cleanedExtraServices = Object.entries(servicesState)
      .filter(([_, val]) => val.selected && val.quantity > 0)
      .reduce((acc, [key, val]) => {
        acc[key] = val.quantity;
        return acc;
      }, {});

    ;


    const cleanData = {
      ...formData,
      extra_services: cleanedExtraServices,
      monto_total: removeDots(formData.monto_total),
      pagado: removeDots(formData.pagado),
      creado: new Date().toISOString(),
    };

    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(cleanData),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (result.result === 'created') {
        showAlert('Evento creado', 'Evento guardado correctamente.');
        setFormData(createInitialFormData());
        router.back();
      } else {
        Alert.alert('Error', 'Error al guardar el evento');
        setFormData(createInitialFormData());
      }
    } catch (error) {
      Alert.alert('Error', 'Error al enviar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout
      isSpinner={loading}>

      <HeaderWithBack
        title="Agregar Evento"
        sideIcon="add-circle-outline"
        sideFunction={() => setShowSaveModal(true)}
        sideTitle="Agregar"
      />

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} contentContainerStyle={[commonStyles.container, { paddingBottom: 100 }]}>

        <DatePickerField
          label="Fecha"
          date={formData.fecha}
          locales="es-Es"
          setDate={(date) => handleChange('fecha', date)}
          isRequired
        />

        <InputField
          label="Cliente"
          placeholder="Cliente"
          value={formData.cliente}
          onChangeText={(text) => handleChange('cliente', text)}
          isRequired
        />


        <RadioGroup
          label="Evento"
          options={eventoItems}
          selectedValue={formData.evento}
          onValueChange={(value) => handleChange('evento', value)}
          isRequired
        />


        <InputField
          label="Monto total"
          placeholder="Monto total"
          value={formData.monto_total}
          keyboardType="numeric"
          onChangeText={(text) => {
            const formattedValue = formatNumberWithDotsInput(text);
            handleChange('monto_total', formattedValue);
          }}
        />




        <View style={commonStyles.rowBetween}>
          <View style={{ flex: 2, marginRight: 8 }}>
            <InputField
              label="Pago Inicial"
              placeholder="Pago Inicial"
              value={formData.pagado}
              keyboardType="numeric"
              onChangeText={(text) => {
                const formattedValue = formatNumberWithDotsInput(text);
                handleChange('pagado', formattedValue);
              }} />
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              label="# de Personas"
              placeholder="Personas"
              value={formData.cantidad_personas}
              keyboardType="numeric"
              onChangeText={(text) => handleChange('cantidad_personas', text.replace(/[^0-9.]/g, ''))}
            />
          </View>
        </View>


        <InputField
          label="Descripción / Observación"
          placeholder="Detalles breves del evento"
          value={formData.descripcion}
          onChangeText={(text) => handleChange('descripcion', text)}
          numberOfLines={3}
        />


        <View style={commonStyles.rowBetween}>
          <Text style={[styles.secondayTitle, { fontWeight: 'bold' }]}>¿Agregar servicios adicionales?</Text>

          <Pressable
            onPress={() => setShowServiceModal(true)}
            style={commonStyles.iconAdd}
          >
            <Ionicons name="add" size={24} color="black" />
          </Pressable>
        </View>


        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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




      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <ModalConfirm
        visible={showSaveModal}
        message="¿Estás seguro que deseas agregar este evento?"
        onCancel={() => setShowSaveModal(false)}
        onConfirm={handleSubmit}
      />

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



    </ScreenLayout>
  );
};

export default Form;
const styles = StyleSheet.create({
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
