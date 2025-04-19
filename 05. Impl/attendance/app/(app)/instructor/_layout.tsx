import { Stack } from 'expo-router';
import { useUserRole } from '../../context/UserRoleContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function InstructorLayout() {
  const { currentRole } = useUserRole();

  // Protect instructor routes
  useEffect(() => {
    if (currentRole !== 'instructor') {
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
