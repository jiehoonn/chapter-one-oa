import React, { ReactNode, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
}

export function SwipeToDelete({ children, onDelete }: SwipeToDeleteProps) {
  const [isDetectingSwipe, setIsDetectingSwipe] = useState(false);
  const deleteThreshold = -80; // Shorter threshold for easier triggering

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes that are clearly leftward
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
        const isLeftSwipe = gestureState.dx < -10;
        return isHorizontalSwipe && isLeftSwipe;
      },
      onPanResponderGrant: () => {
        setIsDetectingSwipe(true);
      },
      onPanResponderMove: () => {
        // Just track that we're moving, no complex animations
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDetectingSwipe(false);
        
        // If swiped far enough left, trigger delete
        if (gestureState.dx < deleteThreshold) {
          onDelete();
        }
      },
      onPanResponderTerminate: () => {
        setIsDetectingSwipe(false);
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 