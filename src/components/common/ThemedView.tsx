/**
 * @fileoverview Themed view component that adapts to light/dark mode
 * Provides consistent container styling with automatic theme adaptation
 */

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedProps } from '@/src/types';

/**
 * Props for ThemedView component extending standard ViewProps
 */
export interface ThemedViewProps extends ViewProps, ThemedProps {}

/**
 * Themed View component with automatic background color adaptation
 * 
 * Features:
 * - Automatic light/dark theme background color adaptation
 * - Customizable colors via lightColor/darkColor props
 * - Full compatibility with standard View props
 * - Consistent theming across the application
 * 
 * @param props - ThemedView configuration props
 * @returns JSX.Element - Styled view component
 * 
 * @example
 * // Basic usage with automatic theme colors
 * <ThemedView style={styles.container}>
 *   <ThemedText>Content</ThemedText>
 * </ThemedView>
 * 
 * // With custom colors
 * <ThemedView lightColor="#f0f0f0" darkColor="#1a1a1a">
 *   <ThemedText>Custom background</ThemedText>
 * </ThemedView>
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Get theme-appropriate background color
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
} 