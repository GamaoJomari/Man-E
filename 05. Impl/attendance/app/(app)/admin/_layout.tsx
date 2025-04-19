import { Stack } from 'expo-router';
import { useUserRole } from '../../context/UserRoleContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AdminLayout() {
  const { currentRole } = useUserRole();

  // Protect admin routes
  useEffect(() => {
    if (currentRole !== 'administrator') {
      // Use setTimeout to ensure navigation happens after mount
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 0);
    }
  }, [currentRole]);

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
