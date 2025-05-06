import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../../constants/theme';
import { API_URL } from '../../../config/constants';
import CustomDateTimePicker from '../../components/DateTimePicker';

interface CourseData {
  courseCode: string;
  name: string;
  description: string;
  instructorId: string;
  schedule: string;
  location: string;
}

interface Instructor {
  _id: string;
  fullName: string;
  instructorId: string;
}

export default function CreateCourses() {
  const [formData, setFormData] = useState<CourseData>({
    courseCode: '',
    name: '',
    description: '',
    instructorId: '',
    schedule: '',
    location: '',
  });
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      // Get both token and user data
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user')
      ]);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || user.role !== 'administrator') {
        throw new Error('Access denied. Administrator only.');
      }

      const response = await fetch(`${API_URL}/api/users?role=instructor`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch instructors');
      }

      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      Alert.alert('Error', 'Failed to load instructors');
    }
  };

  const validateForm = () => {
    const emptyFields = Object.entries(formData).filter(([_, value]) => !value);
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
        .join(', ');
      Alert.alert(
        'Missing Information',
        `Please fill in all fields. Missing: ${fieldNames}`,
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleCreateCourse = async () => {
    try {
      if (!validateForm()) return;
      setIsLoading(true);

      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      Alert.alert(
        'Success',
        'Course created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Course creation error:', error);
      Alert.alert('Error', error.message || 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const timeStr = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString();
    setFormData({ ...formData, schedule: `${dateStr} ${timeStr}` });
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = selectedDate.toLocaleDateString();
    setFormData({ ...formData, schedule: `${dateStr} ${timeStr}` });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Course</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter course code"
              placeholderTextColor="#666"
              value={formData.courseCode}
              onChangeText={text => setFormData({ ...formData, courseCode: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter course name"
              placeholderTextColor="#666"
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter course description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={text => setFormData({ ...formData, description: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructor</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.instructorId}
                onValueChange={(itemValue: string) => setFormData({ ...formData, instructorId: itemValue })}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Select an instructor" value="" color="#666" />
                {instructors.map((instructor) => (
                  <Picker.Item
                    key={instructor._id}
                    label={instructor.fullName}
                    value={instructor._id}
                    color="#fff"
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Schedule</Text>
            <View style={styles.scheduleContainer}>
              <CustomDateTimePicker
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                mode="date"
              />
              <CustomDateTimePicker
                label="Time"
                value={selectedTime}
                onChange={handleTimeChange}
                mode="time"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCreateCourse}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating...' : 'Create Course'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#333',
    color: '#fff',
    height: 50,
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
