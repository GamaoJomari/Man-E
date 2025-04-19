import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localhost since we're running the server locally
const API_URL = 'http://localhost:3000/api';  // Keep port 3000 for backend

export interface User {
  username: string;
  password: string;
  role: string;
  fullName?: string;
  studentId?: string;
  phoneNumber?: string;
}

export interface ApiResponse {
  error?: string;
  message?: string;
  user?: User;
}

// Add debug logging
const logRequest = async (url: string, options: RequestInit) => {
  console.log('Making request to:', url);
  console.log('Request options:', {
    method: options.method,
    headers: options.headers,
    body: options.body
  });
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    return { response, data };
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

export async function loginUser(username: string, password: string, role: string) {
  try {
    console.log('Attempting login with:', { username, role });
    
    const { response, data } = await logRequest(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function createUser(userData: User) {
  try {
    console.log('Creating user with data:', userData);
    console.log('API URL:', API_URL);
    
    const { response, data } = await logRequest(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        role: 'student'  // Ensure role is set to student
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create user');
    }

    return data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
