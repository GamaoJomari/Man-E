import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import BurgerMenu from '../../components/BurgerMenu';
import { useUserRole } from '../../context/UserRoleContext';
import { login } from '../../../services/auth.service';

export default function LoginScreen() {
  const { currentRole } = useUserRole();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear inputs when component mounts or role changes
  useEffect(() => {
    clearInputs();
  }, [currentRole]);

  const clearInputs = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await login(username, password, currentRole);
      setIsLoading(false);
      clearInputs();
      
      // Redirect based on role
      switch (currentRole) {
        case 'administrator':
          router.replace('/(app)/admin/dashboard');
          break;
        case 'instructor':
          router.replace('/(app)/instructor/dashboard');
          break;
        case 'student':
          router.replace('/(app)/student/dashboard');
          break;
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed');
      clearInputs();
    }
  };

  const getRoleTitle = () => {
    return currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  };

  return (
    <View style={styles.container}>
      <BurgerMenu />
      
      <View style={styles.header}>
        <Text style={styles.title}>ProjectX</Text>
        <Text style={styles.subtitle}>Attendance System</Text>
        <Text style={styles.roleText}>{getRoleTitle()} Login</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            key={`username-${currentRole}`} // Force new instance on role change
            style={styles.input}
            placeholder={`Enter ${currentRole} username`}
            placeholderTextColor={COLORS.gray}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            autoComplete="off" // Disable browser autocomplete
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            key={`password-${currentRole}`} // Force new instance on role change
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            autoComplete="off" // Disable browser autocomplete
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.loginButtonText}>Login as {getRoleTitle()}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.large,
  },
  header: {
    marginTop: SIZES.xxLarge * 2,
    alignItems: 'center',
    marginBottom: SIZES.xxLarge,
  },
  title: {
    fontSize: SIZES.xxLarge,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.medium,
  },
  roleText: {
    fontSize: SIZES.large,
    color: COLORS.text,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: SIZES.xxLarge,
  },
  inputContainer: {
    marginBottom: SIZES.large,
  },
  label: {
    color: COLORS.text,
    marginBottom: SIZES.xSmall,
    fontSize: SIZES.medium,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    color: COLORS.text,
    ...SHADOWS.small,
  },
  loginButton: {
    backgroundColor: COLORS.text,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.large,
    ...SHADOWS.medium,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});
