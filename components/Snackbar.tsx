import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

interface SnackbarProps {
  visible: boolean;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Snackbar({
  visible,
  message,
  actionText,
  onAction,
  onDismiss,
  duration = 5000
}: SnackbarProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(false);
  const backgroundColor = useThemeColor({ light: '#323232', dark: '#E0E0E0' }, 'text');
  const textColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const actionColor = useThemeColor({ light: '#03DAC6', dark: '#03DAC6' }, 'text');

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible, fadeAnim, onDismiss, duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor, opacity: fadeAnim }
      ]}
    >
      <ThemedText style={[styles.message, { color: textColor }]}>
        {message}
      </ThemedText>
      {actionText && onAction && (
        <TouchableOpacity onPress={onAction} style={styles.actionButton}>
          <ThemedText style={[styles.actionText, { color: actionColor }]}>
            {actionText}
          </ThemedText>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
}); 