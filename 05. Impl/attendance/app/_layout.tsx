import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './constants/theme';
import { UserRoleProvider } from './context/UserRoleContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
    <UserRoleProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        </UserRoleProvider>
      </AuthProvider>
      </GestureHandlerRootView>
  );
}
