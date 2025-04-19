import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserRole } from '../../context/UserRoleContext';

export default function AdminDashboard() {
  const { logout } = useUserRole();
  const screenHeight = Dimensions.get('window').height;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administrator Dashboard</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.menuCard} 
          onPress={() => router.push('/(app)/admin/register' as any)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="person-add-outline" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.menuText}>Register Accounts</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.logoutContainer, { top: screenHeight - 100 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  menuCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: SIZES.padding,
    alignItems: 'center',
    width: '80%',
    ...SHADOWS.medium,
  },
  iconContainer: {
    marginBottom: SIZES.small,
  },
  menuText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: '500',
  },
  logoutContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: SIZES.padding,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});
