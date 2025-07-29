/**
 * @fileoverview Color definitions for light and dark themes
 * Contains the core color palette used throughout the application.
 * 
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/** Primary tint color for light theme */
const tintColorLight = '#0a7ea4';

/** Primary tint color for dark theme */
const tintColorDark = '#fff';

/**
 * Color palette for both light and dark themes
 * Used by the useThemeColor hook to provide theme-aware styling
 */
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
