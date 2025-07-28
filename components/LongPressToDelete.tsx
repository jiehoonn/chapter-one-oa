import React, { ReactNode } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

interface LongPressToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  taskTitle: string;
}

export function LongPressToDelete({ children, onDelete, taskTitle }: LongPressToDeleteProps) {
  const handleLongPress = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={800}
      activeOpacity={1}
    >
      {children}
    </TouchableOpacity>
  );
} 