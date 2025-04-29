import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
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
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
      setLoading(false);
      console.error('Error fetching students:', err);
    }
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <View style={styles.imageContainer}>
          {item.profileImage ? (
            <Image 
              source={{ uri: `${API_URL}${item.profileImage}` }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={30} color={COLORS.white} />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.fullName}</Text>
          <Text style={styles.detailText}>ID: {item.studentId}</Text>
          <Text style={styles.detailText}>{item.phoneNumber}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Students</Text>

        {loading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            renderItem={renderStudent}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.backContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: SIZES.padding * 4,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    color: COLORS.white,
    fontWeight: 'bold',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  listContainer: {
    padding: SIZES.padding,
  },
  studentCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: SIZES.padding,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.small,
    marginBottom: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
  },
  backContainer: {
    alignItems: 'center',
    paddingBottom: SIZES.padding * 2,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
    borderRadius: 15,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
}); 