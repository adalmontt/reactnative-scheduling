import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

const RadioGroup = ({ label, options, selectedValue, onValueChange, isRequired = false }) => {
  return (
    <View>
<Text style={styles.inputLabel}>
  {label}
  {isRequired && <Text style={{ color: 'red' }}> *</Text>}
</Text>  
      {options.map((option) => {
        const selected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.optionContainer}
            onPress={() => onValueChange(option.value)}
          >
            <View style={[styles.outerCircle, selected && styles.outerCircleSelected]}>
              {selected && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
     inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  outerCircleSelected: {
    borderColor: '#007AFF', // iOS blue accent color
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 16,
  },
});

export default RadioGroup;
