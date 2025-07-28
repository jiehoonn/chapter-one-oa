import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return 44 + insets.bottom;
}

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  return (
    <BlurView
      tint={colorScheme === 'dark' ? 'dark' : 'light'}
      intensity={95}
      style={StyleSheet.absoluteFillObject}
    />
  );
} 