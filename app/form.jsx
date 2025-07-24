import React, { useState } from 'react';
import { ScrollView, Button, Alert, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/InputField';
import DatePickerField from '../components/DatePickerField';
import Dropdown from '../components/DropdownField';
import { GOOGLE_SHEET_URL } from '../config/config';  
import { commonStyles } from '../styles/commonStyles';
import { formatDate, formatNumberWithDotsInput, removeDots } from '../utils/utils';


const Form = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
    fecha: '',
    cliente: '',
    evento: '',
    monto_total: '',
    pagado: [],
    observacion: '',
    cantidad_personas: '',
    show: 'true',
    descripcion: '',
  });

  const eventoItems = [
      { label: 'Boda', value: 'Boda' },
      { label: 'Quince', value: 'Quince' },
      { label: 'Cumpleaños', value: 'Cumpleaños' },
      { label: 'UD/UPD', value: 'UD/UPD' },
      { label: 'Otro', value: 'Otro' },
    ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

    if (!formData.fecha || !formData.cliente || !formData.evento) {
      Alert.alert('Error', 'Complente todos los campos obligatorios');
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

      if (result.result === 'success') {
        Alert.alert('Success', 'Evento guardado exitosamente');
        setFormData({
          id:  Date.now().toString() + Math.random().toString(36).substring(2, 15),
          fecha: '',
          cliente: '',
          evento: '',
          monto_total: '',
          pagado: '',
          observacion: '',
          cantidad_personas: '',
          show: 'true',
          creado: '',
          descripcion: '',
        });
        router.back();
      } else {
        Alert.alert('Error', 'Error al guardar el evento');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al enviar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <Text style={commonStyles.title}>Agregar Evento</Text>
      
      <DatePickerField
        label="Fecha"
        date={formData.fecha}
        locales="es-Es"
        setDate={(date) => handleChange('fecha', date)}
      />

      <InputField
        label="Cliente"
        placeholder="Cliente"
        value={formData.cliente}
        onChangeText={(text) => handleChange('cliente', text)}
      />

    
      <Dropdown
        label="Evento"
        selectedValue={formData.evento}
        onValueChange={(value) => handleChange('evento', value)}
        items={eventoItems}
      />

        <InputField
        label="Cantidad de Personas"
        placeholder="Cantidad de Personas"
        value={formData.cantidad_personas}
        keyboardType="numeric"
        onChangeText={(text) => handleChange('cantidad_personas', text.replace(/[^0-9.]/g, ''))}
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

      <InputField
        label="Pago Inicial"
        placeholder="Pago Inicial"
        value={formData.pagado}
        keyboardType="numeric"
        onChangeText={(text) => {
          const formattedValue = formatNumberWithDotsInput(text);
          handleChange('pagado', formattedValue);
        }}      />

        
      <InputField
        label="Descripción"
        placeholder="Detalles breves del evento"
        value={formData.descripcion}
        onChangeText={(text) => handleChange('descripcion', text)}
        numberOfLines={3}
      />

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
  );
};

export default Form;
