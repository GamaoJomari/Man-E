import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const [showQRCode, setShowQRCode] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (showQRCode) {
      refreshUser();
    }
  }, [showQRCode]);

  const generateQRData = () => {
    if (!user) return '';
    // Create a unique string combining student ID and timestamp
    const timestamp = new Date().getTime();
    return JSON.stringify({
      studentId: user.studentId,
      fullName: user.fullName,
      timestamp: timestamp,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Main content area - can be used for future content */}
      </View>

      <Modal
        visible={showQRCode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Your Attendance QR Code</Text>
            {user?.studentId ? (
              <QRCode
                value={generateQRData()}
                size={200}
                backgroundColor="white"
                color="black"
              />
            ) : (
              <Text style={styles.errorText}>No student ID found. Please contact your administrator.</Text>
            )}
            <Text style={styles.qrSubtitle}>Show this to your instructor</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRCode(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.navigationBar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setShowQRCode(true)}
        >
          <Ionicons name="qr-code-outline" size={24} color={COLORS.primary} />
          <Text style={styles.navButtonText}>QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
          <Text style={styles.navButtonText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/student/profile')}
        >
          <Ionicons name="person-outline" size={24} color={COLORS.primary} />
          <Text style={styles.navButtonText}>Profile</Text>
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
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    ...SHADOWS.medium,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  qrTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  qrSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: 20,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginVertical: 20,
  },
});
