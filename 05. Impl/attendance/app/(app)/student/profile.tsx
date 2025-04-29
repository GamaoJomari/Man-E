import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../constants/config';
import { getCurrentUser, updateProfile, uploadProfileImage } from '../../../services/auth.service';

export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    studentId: '',
    profileImage: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');

        if (!token || !storedUser) {
          throw new Error('Authentication required. Please log in again.');
        }

        const userData = JSON.parse(storedUser);
        setUserId(userData._id);

        // Set the profile data
        setProfile({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          studentId: userData.studentId || '',
          profileImage: userData.profileImage || null,
        });

        // Also fetch fresh data from the server
        const freshData = await getCurrentUser();
        if (freshData) {
          setProfile({
            fullName: freshData.fullName || '',
            phoneNumber: freshData.phoneNumber || '',
            studentId: freshData.studentId || '',
            profileImage: freshData.profileImage || null,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', error instanceof Error ? error.message : 'Failed to load profile data');
        router.replace('/(auth)/login');
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: Platform.OS === 'web',
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log out and log in again.');
        }

        // Get the image URI
        const imageUri = result.assets[0].uri;
        
        // Upload the image
        const imageUrl = await uploadProfileImage(imageUri);
        
        // Update the profile with the new image URL
        setProfile(prev => ({ ...prev, profileImage: imageUrl }));
        Alert.alert('Success', 'Profile image updated successfully');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log out and log in again.');
      }
      if (!userId) {
        throw new Error('User ID not found');
      }
      await updateProfile(userId, {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        studentId: profile.studentId,
        profileImage: profile.profileImage || undefined
      });
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Function to get the correct image URL
  const getImageUrl = (url: string | null) => {
    if (!url) return '';
    
    // If the URL is already a full URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL, prepend the API URL
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
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
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profile.profileImage ? (
            <Image 
              source={{ uri: getImageUrl(profile.profileImage) }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Tap to add photo</Text>
            </View>
          )}
        </TouchableOpacity>
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SIZES.small,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    textAlign: 'center',
    padding: SIZES.small,
  },
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