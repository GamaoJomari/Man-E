import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';

export default function InstructorDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instructor Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Take Attendance</Text>
            <Text style={styles.cardDescription}>Record student attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Class Schedule</Text>
            <Text style={styles.cardDescription}>View and manage classes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Student List</Text>
            <Text style={styles.cardDescription}>View enrolled students</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardDescription}>View attendance reports</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: SIZES.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});
