/**
 * @fileoverview Snackbar component for displaying temporary notifications
 * A material design inspired notification component with fade in/out animations
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/src/components/common/ThemedText';
import { SnackbarProps } from '@/src/types';

/**
 * Snackbar component for displaying temporary notifications with optional actions
 * 
 * Features:
 * - Fade in/out animations
 * - Auto-dismiss after specified duration
 * - Optional action button
 * - Theme-aware styling
 * - Manual dismiss capability
 * 
 * @param props - Snackbar configuration props
 * @returns JSX.Element - Animated snackbar component
 * 
 * @example
 * <Snackbar
 *   visible={isVisible}
 *   message="Task deleted"
 *   actionText="UNDO"
 *   onAction={handleUndo}
 *   onDismiss={handleDismiss}
 *   duration={5000}
 * />
 */
export function Snackbar({
  visible,
  message,
  actionText,
  onAction,
  onDismiss,
  duration = 5000
}: SnackbarProps) {
  // Animation value for fade in/out effect
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Internal visibility state to handle animation timing
  const [isVisible, setIsVisible] = useState(false);
  
  // Theme-aware colors
  const backgroundColor = useThemeColor({ light: '#323232', dark: '#E0E0E0' }, 'text');
  const textColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const actionColor = useThemeColor({ light: '#03DAC6', dark: '#03DAC6' }, 'text');

  /**
   * Handles snackbar dismissal with fade out animation
   * Calls onDismiss callback after animation completes
   */
  const handleDismiss = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onDismiss();
    });
  }, [fadeAnim, onDismiss]);

  /**
   * Handle visibility changes and animations
   * Shows snackbar with fade in animation and sets auto-dismiss timer
   */
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss timer
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      // Cleanup timer on unmount or visibility change
      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible, duration, fadeAnim, handleDismiss]);

  /**
   * Handles action button press
   * Dismisses snackbar and calls action callback
   */
  const handleAction = () => {
    handleDismiss();
    onAction?.();
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0], // Slide up effect
              }),
            },
          ],
        },
      ]}
    >
      {/* Message text */}
      <ThemedText style={[styles.message, { color: textColor }]}>
        {message}
      </ThemedText>
      
      {/* Action button (if provided) */}
      {actionText && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAction}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.actionText, { color: actionColor }]}>
            {actionText}
          </ThemedText>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

/**
 * Styles for the Snackbar component
 * Following Material Design specifications for snackbars
 */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Above tab bar
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 4,
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 1000, // Ensure it appears above other components
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.25,
    textTransform: 'uppercase',
  },
}); 