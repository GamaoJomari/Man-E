import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';
import { getCurrentUser, updateUserProfile, loginUser } from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    studentId: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setFetching(true);
        const userData = await getCurrentUser();
        console.log('Fetched user data:', userData);
        
        // Set the user ID if available
        if (userData._id) {
          setUserId(userData._id);
        } else if (userData.id) {
          setUserId(userData.id);
        } else {
          // If no ID is found, try to get it by re-logging in
          try {
            // Get stored credentials
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.username && parsedUser.password) {
                // Make a login request to get the user ID
                const response = await fetch('http://localhost:3000/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: parsedUser.username,
                    password: parsedUser.password,
                    role: parsedUser.role || 'student'
                  }),
                });
                
                if (response.ok) {
                  const data = await response.json();
                  if (data.user && data.user._id) {
                    setUserId(data.user._id);
                    // Update the stored user data with the ID
                    const updatedUser = { ...parsedUser, _id: data.user._id };
                    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error getting user ID:', error);
          }
        }
        
        setProfile({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          studentId: userData.studentId || '',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
        console.error('Error fetching profile:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // If we don't have a user ID yet, try to get it
      if (!userId) {
        // Get stored credentials
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.username && parsedUser.password) {
            try {
              // Try to login again to get the user ID
              const userData = await loginUser(
                parsedUser.username,
                parsedUser.password,
                parsedUser.role || 'student'
              );
              
              if (userData._id) {
                setUserId(userData._id);
                console.log('Got user ID from login:', userData._id);
              } else {
                throw new Error('User ID not found in login response');
              }
            } catch (loginError) {
              console.error('Login error:', loginError);
              throw new Error('Failed to get user ID. Please log out and log in again.');
            }
          } else {
            throw new Error('Username or password not found. Please log out and log in again.');
          }
        } else {
          throw new Error('User data not found. Please log out and log in again.');
        }
      }
      
      // Now we should have a user ID
      if (!userId) {
        throw new Error('User ID not found. Please log out and log in again.');
      }
      
      console.log('Updating profile with ID:', userId);
      console.log('Update data:', profile);
      
      const result = await updateUserProfile(userId, profile);
      console.log('Update result:', result);
      
      Alert.alert(
        'Success', 
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      const err = error as Error;
      Alert.alert('Error', `Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profile.fullName}
          onChangeText={(value) => handleChange('fullName', value)}
          placeholder="Enter your full name"
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={profile.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          value={profile.studentId}
          onChangeText={(value) => handleChange('studentId', value)}
          placeholder="Enter your student ID"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Profile'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    ...SHADOWS.small,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
}); 