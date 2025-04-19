import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './constants/theme';
import { UserRoleProvider } from './context/UserRoleContext';
import { useEffect } from 'react';

export default function RootLayout() {

  return (
    <UserRoleProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </UserRoleProvider>
  );
}
