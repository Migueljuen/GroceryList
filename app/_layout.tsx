import { useColorScheme } from '@/hooks/useColorScheme';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
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

  // Redirect if user is not logged in
  useEffect(() => {
    if (!initializing && !user) {
      router.replace('/(auth)/login');
    }
  }, [initializing, user, router]);

  if (!loaded || initializing) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}