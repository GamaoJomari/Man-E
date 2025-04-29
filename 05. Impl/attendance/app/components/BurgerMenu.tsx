import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useUserRole, UserRole } from '../context/UserRoleContext';

const { width } = Dimensions.get('window');

export default function BurgerMenu() {
  const { currentRole, setCurrentRole } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-width)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const burgerFadeAnim = React.useRef(new Animated.Value(1)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? -width : 0;
    const fadeToValue = isOpen ? 0 : 0.5;
    const burgerFadeToValue = isOpen ? 1 : 0;

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: fadeToValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(burgerFadeAnim, {
        toValue: burgerFadeToValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  const getRoleOptions = (): UserRole[] => {
    switch (currentRole) {
      case 'student':
        return ['instructor', 'administrator'];
      case 'instructor':
        return ['student', 'administrator'];
      case 'administrator':
        return ['student', 'instructor'];
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    toggleMenu();
  };

  const renderBurgerIcon = () => (
    <Animated.View style={[styles.burgerIcon, { opacity: burgerFadeAnim }]}>
      <View style={[styles.burgerLine, styles.burgerLineTop]} />
      <View style={styles.burgerLine} />
      <View style={[styles.burgerLine, styles.burgerLineBottom]} />
    </Animated.View>
  );

  return (
    <>
      <TouchableOpacity
        style={[
          styles.burgerButton,
          { pointerEvents: isOpen ? 'none' : 'auto' }
        ]}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        {renderBurgerIcon()}
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            display: isOpen ? 'flex' : 'none',
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
        onTouchStart={toggleMenu}
      />

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Choose Role</Text>
        </View>
        <View style={styles.menuContent}>
          {getRoleOptions().map((role) => (
            <TouchableOpacity
              key={role}
              style={styles.menuItem}
              onPress={() => handleRoleChange(role)}
            >
              <Text style={styles.menuItemText}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  burgerButton: {
    position: 'absolute',
    top: SIZES.xxLarge * 2,
    left: SIZES.large,
    zIndex: 100,
    padding: SIZES.small,
  },
  burgerIcon: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
  },
  burgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.text,
    borderRadius: 2,
  },
  burgerLineTop: {
    width: '70%',
  },
  burgerLineBottom: {
    width: '85%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: COLORS.background,
    zIndex: 2,
    ...SHADOWS.medium,
  },
  menuHeader: {
    paddingTop: SIZES.xxLarge * 2,
    paddingBottom: SIZES.large,
    paddingHorizontal: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  menuTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  menuContent: {
    padding: SIZES.medium,
  },
  menuItem: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  menuItemText: {
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
});
