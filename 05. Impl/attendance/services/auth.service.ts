import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../app/constants/config';
import { Platform } from 'react-native';

interface User {
  _id: string;
  username: string;
  role: string;
  fullName: string;
  studentId?: string;
  instructorId?: string;
  phoneNumber?: string;
  profileImage?: string | null;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (username: string, password: string, role: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, profileData: Partial<User>): Promise<User> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const uploadProfileImage = async (imageUri: string): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Create FormData for the image upload
    const formData = new FormData();
    
    // Handle different platforms
    if (Platform.OS === 'web') {
      // For web platform, fetch the image and convert to blob
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        formData.append('image', file);
      } catch (error) {
        console.error('Error processing web image:', error);
        throw new Error('Failed to process image for upload');
      }
    } else {
      // For mobile platforms (iOS, Android)
      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Create the file object for FormData
      formData.append('image', {
        uri: imageUri,
        type,
        name: filename,
      } as any);
    }

    // Send the request to the server
    const response = await fetch(`${API_URL}/api/upload-profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // Don't set Content-Type header, let the browser set it with the boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    
    // Ensure the image URL is in the correct format
    let imageUrl = data.imageUrl;
    
    // If the URL is relative, make sure it starts with a slash
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
      imageUrl = `/${imageUrl}`;
    }
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
