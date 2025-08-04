import React, { useState } from 'react';
import { TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles } from '../styles/commonStyles';


const DatePickerField = ({ label, date, setDate, isRequired = false }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Save as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  };

  // Format to DD/MM/YYYY for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Text style={commonStyles.inputLabel}>
        {label}
        {isRequired && <Text style={{ color: 'red' }}> *</Text>}
      </Text>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        <Text style={{ color: date ? '#000' : '#aaa' }}>
          {date ? formatDisplayDate(date) : `Seleccionar ${label}`}
        </Text>
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
