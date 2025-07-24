import React, { useState } from 'react';
import { TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles } from '../styles/commonStyles';


const DatePickerField = ({ label, date, setDate }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <>
      <Text style={commonStyles.inputLabel}>{label}</Text>
  
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        <Text style={{ color: date ? '#000' : '#aaa' }}>{date || `Seleccionar ${label}`}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          locale="es-ES"
        />
      )}
    </>
  );
};

export default DatePickerField;

const styles = StyleSheet.create({
    label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
});
