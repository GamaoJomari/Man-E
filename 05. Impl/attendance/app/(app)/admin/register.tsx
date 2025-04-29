import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterOptions() {
  const options = [
    { title: 'Student', icon: 'school-outline', route: '/register-student' },
    { title: 'Instructor', icon: 'person-outline', route: '/register-instructor' },
    { title: 'Admin', icon: 'shield-outline', route: '/register-admin' },
  ];

  const handleOptionPress = (route: string) => {
    setTimeout(() => {
      router.push(route as any);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-outline" size={30} color={COLORS.white} />
      </TouchableOpacity>

      <View style={styles.content}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionCard}
            onPress={() => handleOptionPress(`/(app)/admin${option.route}`)}
          >
            <Ionicons name={option.icon as any} size={32} color={COLORS.white} />
            <Text style={styles.optionText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.padding,
    left: SIZES.padding,
    zIndex: 1,
    padding: SIZES.small,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
    marginTop: -SIZES.padding * 4, // Move content up
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: 10,
    marginBottom: SIZES.padding,
    ...SHADOWS.small,
  },
  optionText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    marginLeft: SIZES.padding,
    fontWeight: '500',
  },
});