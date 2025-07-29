import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { WelcomeModal } from '@/components/WelcomeModal';
import { TaskProvider } from '@/contexts/TaskContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FirstLaunchManager } from '@/src/utils/firstLaunch';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  // Welcome modal state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      
      // Check if this is the first launch and show welcome modal
      FirstLaunchManager.isFirstLaunch().then((isFirst) => {
        if (isFirst) {
          setShowWelcomeModal(true);
        }
      });
    }
  }, [loaded]);

  /**
   * Handles closing the welcome modal and marking first launch as complete
   */
  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    FirstLaunchManager.markFirstLaunchComplete();
  };

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          
          {/* Welcome Modal for first-time users */}
          <WelcomeModal
            visible={showWelcomeModal}
            onClose={handleWelcomeClose}
          />
        </ThemeProvider>
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
