import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Student {
  _id: string;
  fullName: string;
  studentId: string;
  username: string;
  phoneNumber: string;
  profileImage: string | null;
  createdAt: string;
}

export default function StudentsView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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

      const response = await fetch(`${API_URL}/api/users?role=student`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const deleteStudent = async (studentId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/users/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }

      // Remove the student from the local state
      setStudents(students.filter(student => student._id !== studentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchStudents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.fullName}</Text>
        <Text style={styles.studentDetail}>ID: {item.studentId}</Text>
        <Text style={styles.studentDetail}>Username: {item.username}</Text>
        <Text style={styles.studentDetail}>Phone: {item.phoneNumber}</Text>
        <Text style={styles.studentDetail}>Registered: {formatDate(item.createdAt)}</Text>
      </View>
      <View style={styles.imageContainer}>
        {item.profileImage ? (
          <Image
            source={{ uri: `${API_URL}${item.profileImage}` }}
            style={styles.profileImage}
          />
        ) : (
          <Ionicons name="person-circle" size={50} color={COLORS.primary} style={styles.profileImage} />
        )}
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteStudent(item._id)}
        >
          <Ionicons name="trash-outline" size={24} color={COLORS.error} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          title: 'Students List',
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/admin/register-student')}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students registered yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: SIZES.medium,
  },
  studentCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  studentInfo: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  deleteButton: {
    marginTop: SIZES.small,
    alignItems: 'center',
  },
  deleteText: {
    color: COLORS.error,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  studentName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  studentDetail: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 2,
  },
  addButton: {
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.large,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xxLarge,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: SIZES.medium,
  },
});