import React, { useEffect, useState } from 'react';
import { ScrollView, Button, Alert, View, Text, ActivityIndicator, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/InputField';
import DatePickerField from '../components/DatePickerField';
import Dropdown from '../components/DropdownField';
import { GOOGLE_SHEET_URL } from '../config/config';
import { commonStyles } from '../styles/commonStyles';
import { formatDate, formatNumberWithDotsInput, removeDots } from '../utils/utils';
import RadioGroup from '../components/RadioGroup';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithBack from '../components/headerWithBack';
import Checkbox from '../components/Checkbox';
import { useLocalSearchParams } from 'expo-router';



const Edit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState(null);
  const [preloaded, setPreloaded] = useState(false);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

const isEditMode = !!params.item;

console.log("params at top", params.item);

useEffect(() => {
  if (params?.item) {
    try {
      const parsed = params.item;

      const extraServices = parsed.extra_services
        ? JSON.parse(parsed.extra_services)
        : emptyExtraServices;

console.log("parsed", parsed);
console.log("extraServices", extraServices);

      setFormData({
        ...parsed,
        extra_services: extraServices,
      });

      setPreloaded(true);
        console.log("entro aca good");

    } catch (err) {
      console.error('Failed to parse item:', err);
          Alert.alert("Error", "Error al cargar los datos");
    setPreloaded(false);
    }
  } else {
    Alert.alert("Error", "Error al cargar los datos");
    setPreloaded(false);
  }
}, [params.item]);



  const emptyExtraServices = {
    decoracion: false,
    buffet: false,
    asado: false,
    hamburguesa: false,
    lomito: false,
    chop_50: false,
    chop_30: false,
    tragos_50: false,
    tragos_100: false,
    entrada: false,
    bocaditos_dulces: false,
  };




  const eventoItems = [
    { label: 'Boda', value: 'Boda' },
    { label: 'Quince', value: 'Quince' },
    { label: 'Cumpleaños', value: 'Cumpleaños' },
    { label: 'UD/UPD', value: 'UD/UPD' },
    { label: 'Otro', value: 'Otro' },
  ];


  const handleChange = (name, value, isNested = false) => {

    console.log("changing" , formData);
    setFormData(prev => {
      if (isNested) {
        return {
          ...prev,
          extra_services: {
            ...prev.extra_services,
            [name]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async () => {

    if (!formData.fecha || !formData.cliente || !formData.evento) {
      Alert.alert('Error', 'Complente todos los campos obligatorios con *');
      return;
    }

    setLoading(true);


    const cleanData = {
      ...formData,
      monto_total: removeDots(formData.monto_total),
      pagado: removeDots(formData.pagado),
      creado: new Date().toISOString(), // <-- override to ensure latest timestamp
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

    if(preloaded){
    return (

      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if you have header/navbar
        >
          <HeaderWithBack title="Editar Evento" />

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={commonStyles.container}>

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
              <Text style={commonStyles.toggleText}>Agregar Servicios adicionales?</Text>
              <Switch
                value={showExtraFields}
                onValueChange={(value) => {
                  setShowExtraFields(value);
                }} />
            </View>

            {showExtraFields && (
              <View>
                {Object.entries(formData.extra_services).map(([key, value]) => (
                  <Checkbox
                    key={key}
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={value}
                    onValueChange={(val) => handleChange(key, val, true)}
                  />
                ))}
              </View>
            )}


            <View style={{ marginTop: 10 }}>
              <Button title={loading ? 'Guardando...' : 'Guardar'} onPress={handleSubmit} disabled={loading} />
            </View>

            <View style={{ marginTop: 16 }}>
              <Button title="Cancelar" color="#888" disabled={loading} onPress={() => router.back()} />
            </View>

            {loading && (
              <View style={{ marginVertical: 20 }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
          </ScrollView>


          <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
          />

        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
};
export default Edit;
