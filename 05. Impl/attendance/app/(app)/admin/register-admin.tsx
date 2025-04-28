import React, { useState } from 'react';
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
import { createUser } from '../../services/auth.service';

interface AdminData {
  fullName: string;
  adminId: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterAdmin() {
  const [formData, setFormData] = useState<AdminData>({
    fullName: '',
    adminId: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Check for empty fields
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
      if (!validateForm()) return;
      setIsLoading(true);
      
      console.log('Registering administrator with data:', {
        ...formData,
        password: '[REDACTED]'
      });

      // Create administrator in database
      const result = await createUser({
        username: formData.username,
        password: formData.password,
        role: 'administrator',
        fullName: formData.fullName,
        adminId: formData.adminId,
        phoneNumber: formData.phoneNumber,
      });

      console.log('Registration successful:', result);

      Alert.alert(
        'Registration Successful',
        'The administrator has been successfully registered.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to register administrator';
      if (error instanceof Error) {
        if (error.message.includes('username')) {
          errorMessage = 'This username is already registered';
        } else if (error.message.includes('adminId')) {
          errorMessage = 'This admin ID is already registered';
        } else if (error.message.includes('fullName')) {
          errorMessage = 'An administrator with this name is already registered';
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert('Registration Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.headerTitle}>register-admin</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#666"
              value={formData.fullName}
              onChangeText={text => setFormData({ ...formData, fullName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admin ID"
              placeholderTextColor="#666"
              value={formData.adminId}
              onChangeText={text => setFormData({ ...formData, adminId: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={text => setFormData({ ...formData, phoneNumber: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#666"
              autoCapitalize="none"
              value={formData.username}
              onChangeText={text => setFormData({ ...formData, username: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#666"
              secureTextEntry
              value={formData.password}
              onChangeText={text => setFormData({ ...formData, password: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#666"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={text => setFormData({ ...formData, confirmPassword: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              Register
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
    fontSize: 20,
    marginLeft: 16,
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 