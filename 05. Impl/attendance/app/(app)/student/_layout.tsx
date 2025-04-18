import { Stack } from 'expo-router';
import { useUserRole } from '../../context/UserRoleContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function StudentLayout() {
  const { currentRole } = useUserRole();

  // Protect student routes
  useEffect(() => {
    if (currentRole !== 'student') {
      router.replace('/(auth)/login');
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
    </Stack>
  );
}
