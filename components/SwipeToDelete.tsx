import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { ReactNode, useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DELETE_THRESHOLD = -100; // Distance to trigger delete
const REVEAL_THRESHOLD = -50;  // Distance to start revealing delete button

export function SwipeToDelete({ children, onDelete, disabled = false }: SwipeToDeleteProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteBackgroundOpacity = useRef(new Animated.Value(0)).current;
  const deleteIconScale = useRef(new Animated.Value(0.8)).current;
  
  // Theme-aware colors
  const deleteColor = useThemeColor({ light: '#FF3B30', dark: '#FF453A' }, 'text');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (disabled) return false;
        // Only respond to horizontal swipes that are clearly leftward
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
        const isLeftSwipe = gestureState.dx < -10;
        return isHorizontalSwipe && isLeftSwipe;
      },
      onPanResponderGrant: () => {
        // Haptic feedback when starting gesture
        if (!disabled) {
          // Could add haptic feedback here if needed
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabled) return;

        // Only allow leftward movement
        const newTranslateX = Math.min(0, gestureState.dx);
        translateX.setValue(newTranslateX);

        // Calculate delete button visibility based on swipe distance
        const progress = Math.min(1, Math.abs(newTranslateX) / Math.abs(REVEAL_THRESHOLD));
        deleteBackgroundOpacity.setValue(progress);
        
        // Scale animation for delete icon
        const iconScale = 0.8 + (0.4 * progress); // Scale from 0.8 to 1.2
        deleteIconScale.setValue(iconScale);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (disabled) return;

        const finalTranslateX = gestureState.dx;
        
        if (finalTranslateX < DELETE_THRESHOLD) {
          // Delete triggered - animate out and call delete
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(deleteBackgroundOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDelete();
          });
        } else {
          // Snap back to original position
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              tension: 300,
              friction: 20,
              useNativeDriver: true,
            }),
            Animated.timing(deleteBackgroundOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(deleteIconScale, {
              toValue: 0.8,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        if (disabled) return;
        
        // Reset to original position if gesture is terminated
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            tension: 300,
            friction: 20,
            useNativeDriver: true,
          }),
          Animated.timing(deleteBackgroundOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(deleteIconScale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Delete background that appears behind the item */}
      <Animated.View 
        style={[
          styles.deleteBackground,
          {
            opacity: deleteBackgroundOpacity,
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.deleteIconContainer,
            {
              transform: [{ scale: deleteIconScale }]
            }
          ]}
        >
          <IconSymbol 
            name="trash" 
            size={24} 
            color={deleteColor}
          />
        </Animated.View>
      </Animated.View>
      
      {/* Main content that slides */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  deleteIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'transparent',
  },
}); 