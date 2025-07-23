import React, { useState } from 'react';
import { ScrollView, Button, Alert, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/InputField';
import DatePickerField from '../components/DatePickerField';
import Dropdown from '../components/DropdownField';
import { GOOGLE_SHEET_URL } from '../config/config';  
import { commonStyles } from '../styles/commonStyles';
import { formatDate, formatNumberWithDotsInput, removeDots } from '../utils/utils';


const Form = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
    fecha: '',
    cliente: '',
    evento: '',
    monto_total: '',
    pagado: [],
    observacion: '',
    cantidad_personas: '',
    show: '',
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

      const cleanData = {
    ...formData,
    monto_total: removeDots(formData.monto_total),
    pagado: removeDots(formData.pagado),
  };

    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(cleanData),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (result.result === 'success') {
        Alert.alert('Success', 'Data submitted successfully');
        setFormData({
          id:  Date.now().toString() + Math.random().toString(36).substring(2, 15),
          fecha: '',
          cliente: '',
          evento: '',
          monto_total: '',
          pagado: '',
          observacion: '',
          cantidad_personas: '',
          show: true,
        });
        router.back();
      } else {
        Alert.alert('Error', 'Submission failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the form');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <Text style={commonStyles.title}>Agregar Evento</Text>
      
      <DatePickerField
        label="Fecha"
        date={formData.fecha}
        setDate={(date) => handleChange('fecha', formatDate(date))}
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

      <View style={{ marginTop: 10 }}>
        <Button title="Guardar" onPress={handleSubmit} />
      </View>

      <View style={{ marginTop: 16 }}>
        <Button title="Cancelar" color="#888" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
};

export default Form;
