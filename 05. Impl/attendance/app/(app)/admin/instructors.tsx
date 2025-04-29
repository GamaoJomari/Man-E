import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Instructor {
  _id: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  profileImage: string | null;
  createdAt: string;
}

export default function InstructorsView() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructors');
      console.error('Error fetching instructors:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInstructors();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading instructors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchInstructors}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Instructor }) => (
    <View style={styles.instructorCard}>
      <View style={styles.instructorInfo}>
        <Text style={styles.instructorName}>{item.fullName}</Text>
        <Text style={styles.instructorDetail}>Username: {item.username}</Text>
        <Text style={styles.instructorDetail}>Phone: {item.phoneNumber}</Text>
        <Text style={styles.instructorDetail}>Registered: {formatDate(item.createdAt)}</Text>
      </View>
      {item.profileImage && (
        <Image
          source={{ uri: `${API_URL}${item.profileImage}` }}
          style={styles.profileImage}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          title: 'Instructors List',
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/admin/register-instructor')}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={instructors}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No instructors registered yet</Text>
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
  instructorCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  instructorDetail: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: SIZES.small,
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
