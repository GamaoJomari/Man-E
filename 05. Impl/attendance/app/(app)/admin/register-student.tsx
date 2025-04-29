import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUser } from '../../services/auth.service';

interface StudentData {
  fullName: string;
  studentId: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterStudent() {
  const [formData, setFormData] = useState<StudentData>({
    fullName: '',
    studentId: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Check for empty fields
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'The passwords you entered do not match. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      console.log('Starting registration process...');
      if (!validateForm()) {
        console.log('Form validation failed');
        return;
      }

      setIsLoading(true);
      console.log('Sending registration data:', {
        ...formData,
        password: '[REDACTED]'
      });

      // Create user in database
      const result = await createUser({
        username: formData.username,
        password: formData.password,
        role: 'student',
        fullName: formData.fullName,
        studentId: formData.studentId,
        phoneNumber: formData.phoneNumber,
      });

      console.log('Registration successful:', result);

      Alert.alert(
        'Registration Successful',
        'The student has been successfully registered in the system.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to register student';
      
      if (error instanceof Error) {
        console.log('Error message:', error.message);
        // Handle specific error messages from the server
        if (error.message.includes('username')) {
          errorMessage = 'This username is already registered';
        } else if (error.message.includes('studentId')) {
          errorMessage = 'This student ID is already registered';
        } else if (error.message.includes('fullName')) {
          errorMessage = 'A student with this name is already registered';
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert(
        'Registration Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor={COLORS.gray}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter student ID"
              placeholderTextColor={COLORS.gray}
              value={formData.studentId}
              onChangeText={(text) => setFormData({ ...formData, studentId: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.gray}
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor={COLORS.gray}
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  scrollContent: {
    paddingTop: SIZES.padding,
  },
  form: {
    gap: SIZES.padding,
  },
  inputContainer: {
    marginBottom: SIZES.small,
  },
  label: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    marginBottom: SIZES.small / 2,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SIZES.small,
    color: COLORS.white,
    fontSize: SIZES.medium,
    ...SHADOWS.small,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SIZES.padding,
    ...SHADOWS.medium,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: '500',
  },
});
