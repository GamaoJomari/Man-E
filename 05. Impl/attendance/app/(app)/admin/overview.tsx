import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminOverview() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Overview</Text>

        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.menuCard} 
            onPress={() => router.push('/(app)/admin/students' as any)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.menuText}>Students</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuCard, { marginTop: SIZES.padding * 2 }]} 
            onPress={() => router.push('/(app)/admin/instructors' as any)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="school" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.menuText}>Instructors</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.backContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>Back to Dashboard</Text>
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
    marginBottom: SIZES.padding * 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  menuCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    padding: SIZES.padding * 3,
    alignItems: 'center',
    width: '90%',
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
  iconContainer: {
    marginBottom: SIZES.medium,
  },
  menuText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: '500',
    marginTop: SIZES.small,
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