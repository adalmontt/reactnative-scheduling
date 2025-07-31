import React, { useEffect, useState } from 'react';
import { ScrollView, Button, Alert, View, Text, ActivityIndicator, Switch, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet, TextInput } from 'react-native';
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


const Form = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [servicesFetched, setServicesFetched] = useState(false);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_ITEMS_URL);
      const data = await response.json();

      const servicesMap = data.reduce((acc, item) => {
        const key = item.nombre
        acc[key] = { selected: false, quantity: 1 };
        return acc;
      }, {});

      setFormData(prev => ({
        ...prev,
        extra_services: servicesMap,
      }));

      setServicesList(data); // Save raw list too, if needed elsewhere
      setServicesFetched(true);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    if (!servicesFetched) {
      fetchServices();
    }
  }, []);



  // const emptyExtraServices = {
  //   decoracion: { selected: false, quantity: 1 },
  //   buffet: { selected: false, quantity: 1 },
  //   asado: { selected: false, quantity: 1 },
  //   hamburguesa: { selected: false, quantity: 1 },
  //   lomito: { selected: false, quantity: 1 },
  //   chop_50: { selected: false, quantity: 1 },
  //   chop_30: { selected: false, quantity: 1 },
  //   tragos_50: { selected: false, quantity: 1 },
  //   tragos_100: { selected: false, quantity: 1 },
  //   entrada: { selected: false, quantity: 1 },
  //   bocaditos_dulces: { selected: false, quantity: 1 },
  //   mozos: { selected: false, quantity: 1 },
  // };


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

  const handleToggleExtraServices = (value) => {
    setShowExtraFields(value);
  };




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


    const cleanedExtraServices = Object.entries(formData.extra_services)
      .filter(([_, val]) => val.selected)
      .reduce((acc, [key, val]) => {
        acc[key] = val.quantity;
        return acc;
      }, {});


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
          <Text style={commonStyles.toggleText}>¿Agregar servicios adicionales?</Text>
          <Switch
            value={showExtraFields}
            onValueChange={handleToggleExtraServices}
          />
        </View>

        {showExtraFields && formData?.extra_services && (
          <View style={{ marginTop: 10 }}>
            {/* Header */}
            <View style={[styles.tableRow, { marginBottom: 10 }]}>
              <Text style={[styles.tableHeader, { flex: 1 }]}>✔</Text>
              <Text style={[styles.tableHeader, { flex: 3 }]}>Servicio</Text>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Cantidad</Text>
            </View>

            {Object.entries(formData.extra_services).map(([key, service]) => {
              const label =
                typeof key === 'string'
                  ? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
                  : 'Servicio';

              return (
                <View key={key} style={[styles.tableRow,
                {
                  backgroundColor: service.selected ? Colors.lightBlue : 'white', // soft green / soft red
                  justifyContent: 'center', alignItems: 'center', padding: 10,
                },
                ]}>
                  <View style={{ flex: 1, justifyContent: 'center', }}>
                    <Checkbox
                      value={service.selected}
                      onValueChange={(val) => handleChange(key, val, true, 'selected')}
                    />
                  </View>

                  <Text style={[styles.tableCell, { flex: 3 }]}>{label}</Text>

                  <View style={{ flex: 2, justifyContent: 'center' }}>
                    <TextInput
                      placeholder="0"
                      keyboardType="numeric"
                      editable={service.selected}
                      style={{
                        opacity: service.selected ? 1 : 0.3,
                        height: 40,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        backgroundColor: service.selected ? '#fff' : '#eee',
                        textAlignVertical: 'center',  // vertically center the text
                      }}
                      value={String(service.quantity || '')}
                      onChangeText={(val) => handleChange(key, val, true, 'quantity')}
                    />
                  </View>
                </View>
              );
            })}

          </View>
        )}




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
