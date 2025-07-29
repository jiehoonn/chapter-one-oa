/**
 * @fileoverview Custom hook for theme-aware color selection
 * Provides automatic color adaptation based on current color scheme (light/dark)
 * 
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Custom hook that returns theme-appropriate colors
 * 
 * Automatically selects colors based on the current color scheme (light/dark).
 * Allows override with custom colors via props.
 * 
 * @param props - Custom color overrides for light and dark themes
 * @param props.light - Custom color for light theme
 * @param props.dark - Custom color for dark theme
 * @param colorName - Color key from the Colors constant
 * @returns The appropriate color for the current theme
 * 
 * @example
 * // Use default theme colors
 * const textColor = useThemeColor({}, 'text');
 * 
 * // Use custom colors with fallback to theme
 * const customColor = useThemeColor(
 *   { light: '#000000', dark: '#FFFFFF' }, 
 *   'background'
 * );
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
