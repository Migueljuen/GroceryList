import { GroceryListProvider } from '@/context/GroceryListContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/AuthContext';
import { InviteProvider } from '../context/InviteContext';
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loaded] = useFonts({
    "DMSans-Black": require("../assets/fonts/DMSans-Black.ttf"),
    "DMSans-BlackItalic": require("../assets/fonts/DMSans-BlackItalic.ttf"),
    "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
    "DMSans-BoldItalic": require("../assets/fonts/DMSans-BoldItalic.ttf"),
    "DMSans-ExtraBold": require("../assets/fonts/DMSans-ExtraBold.ttf"),
    "DMSans-ExtraBoldItalic": require("../assets/fonts/DMSans-ExtraBoldItalic.ttf"),
    "DMSans-ExtraLight": require("../assets/fonts/DMSans-ExtraLight.ttf"),
    "DMSans-ExtraLightItalic": require("../assets/fonts/DMSans-ExtraLightItalic.ttf"),
    "DMSans-Light": require("../assets/fonts/DMSans-Light.ttf"),
    "DMSans-LightItalic": require("../assets/fonts/DMSans-LightItalic.ttf"),
    "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-MediumItalic": require("../assets/fonts/DMSans-MediumItalic.ttf"),
    "DMSans-Regular": require("../assets/fonts/DMSans-Regular.ttf"),
    "DMSans-SemiBold": require("../assets/fonts/DMSans-SemiBold.ttf"),
    "DMSans-SemiBoldItalic": require("../assets/fonts/DMSans-SemiBoldItalic.ttf"),
    "DMSans-Thin": require("../assets/fonts/DMSans-Thin.ttf"),
    "DMSans-ThinItalic": require("../assets/fonts/DMSans-ThinItalic.ttf"),
  });

  const handleAuthStateChanged = useCallback((user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  }, [initializing]);

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, [handleAuthStateChanged]);

  // Redirect based on auth state
  useEffect(() => {
    if (initializing || !loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // User not logged in, redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // User logged in but on auth screen, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, segments, initializing, loaded, router]);

  if (!loaded || initializing) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GroceryListProvider>
        <AuthProvider>
          <InviteProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(createGrocery)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <Toast />
              <StatusBar style="auto" />
            </ThemeProvider>
          </InviteProvider>
        </AuthProvider>
      </GroceryListProvider>
    </GestureHandlerRootView>
  );
}