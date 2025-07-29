import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = '@TaskManager:firstLaunch';

/**
 * Utility functions for managing first launch state
 */
export class FirstLaunchManager {
  /**
   * Check if this is the user's first time launching the app
   * @returns Promise<boolean> - true if first launch, false otherwise
   */
  static async isFirstLaunch(): Promise<boolean> {
    try {
      const hasLaunchedBefore = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      return hasLaunchedBefore === null;
    } catch (error) {
      console.error('Error checking first launch status:', error);
      // Default to showing welcome modal if we can't determine status
      return true;
    }
  }

  /**
   * Mark that the user has completed their first launch
   */
  static async markFirstLaunchComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
    } catch (error) {
      console.error('Error marking first launch complete:', error);
    }
  }

  /**
   * Reset first launch status (useful for testing or user request)
   */
  static async resetFirstLaunchStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
    } catch (error) {
      console.error('Error resetting first launch status:', error);
    }
  }
}
