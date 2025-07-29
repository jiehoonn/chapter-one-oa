/**
 * @fileoverview Themed text component that adapts to light/dark mode
 * Provides consistent typography with automatic theme adaptation
 */

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedProps } from '@/src/types';

/**
 * Text style variants for consistent typography across the app
 */
export type ThemedTextType = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';

/**
 * Props for ThemedText component
 */
export interface ThemedTextProps extends TextProps, ThemedProps {
  /** Typography variant to apply */
  type?: ThemedTextType;
}

/**
 * Themed Text component with automatic color adaptation
 * 
 * Features:
 * - Automatic light/dark theme color adaptation
 * - Predefined typography variants (title, subtitle, etc.)
 * - Customizable colors via lightColor/darkColor props
 * - Full compatibility with standard Text props
 * 
 * @param props - ThemedText configuration props
 * @returns JSX.Element - Styled text component
 * 
 * @example
 * // Basic usage
 * <ThemedText>Hello World</ThemedText>
 * 
 * // With typography variant
 * <ThemedText type="title">Page Title</ThemedText>
 * 
 * // With custom colors
 * <ThemedText lightColor="#000" darkColor="#fff">
 *   Custom colored text
 * </ThemedText>
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Get theme-appropriate color
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

/**
 * Typography styles for different text variants
 * Following iOS Human Interface Guidelines and Material Design principles
 */
const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
}); 