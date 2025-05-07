import React, { useState } from 'react';
import { Platform, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES } from '../constants/theme';

interface CustomDateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time';
  label?: string;
}

export default function CustomDateTimePicker({ 
  value, 
  onChange, 
  mode = 'date',
  label 
}: CustomDateTimePickerProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS !== 'web');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    if (mode === 'date') {
      return date.toLocaleDateString();
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <input
          type={mode === 'date' ? 'date' : 'time'}
          value={mode === 'date' ? value.toISOString().split('T')[0] : value.toTimeString().slice(0, 5)}
          onChange={(e) => {
            const newDate = new Date(value);
            if (mode === 'date') {
              const [year, month, day] = e.target.value.split('-').map(Number);
              newDate.setFullYear(year, month - 1, day);
            } else {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              newDate.setHours(hours, minutes);
            }
            onChange(newDate);
          }}
          style={{
            ...styles.webInput,
            border: 'none',
            outline: 'none',
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setShow(true)}
      >
        <Text style={styles.buttonText}>{formatDate(value)}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  label: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    marginBottom: SIZES.small,
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: SIZES.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  webInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: SIZES.medium,
    color: COLORS.white,
    fontSize: SIZES.medium,
    width: '100%',
  },
}); 