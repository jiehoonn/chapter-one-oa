import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { SwipeToDelete } from '@/components/SwipeToDelete';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/src/components/common/ThemedText';
import { Task } from '@/src/types';

interface TaskGestureHandlerProps {
  task: Task;
  categoryColor: string;
  onEdit: (task: Task) => void;
  onToggleCompletion: (taskId: string) => void;
  onDelete: (taskId: string, taskTitle: string) => void;
  showCategoryName?: boolean; // Optional prop to control category name visibility
}

/**
 * TaskGestureHandler component that wraps task items with gesture handling
 * 
 * Features:
 * - Tap on task content to edit
 * - Tap on checkbox to toggle completion
 * - Swipe left to delete
 * - Prevents accidental completion toggles
 * 
 * @param props - Task gesture handler configuration
 * @returns JSX.Element - Task with gesture handling
 */
export function TaskGestureHandler({
  task,
  categoryColor,
  onEdit,
  onToggleCompletion,
  onDelete,
  showCategoryName = false // Default to false (don't show category name)
}: TaskGestureHandlerProps) {
  // Theme-aware colors
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const completedTextColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text');

  /**
   * Handles task content tap to open edit modal
   */
  const handleTaskEdit = () => {
    onEdit(task);
  };

  /**
   * Handles checkbox tap to toggle completion
   */
  const handleToggleCompletion = () => {
    onToggleCompletion(task.id);
  };

  /**
   * Handles task deletion
   */
  const handleDelete = () => {
    onDelete(task.id, task.title);
  };

  return (
    <SwipeToDelete
      onDelete={handleDelete}
      disabled={task.completed} // Disable swipe for completed tasks
    >
      <View style={[
        styles.taskCard,
        { borderColor },
        task.completed && styles.completedTask
      ]}>
        <View style={styles.taskHeader}>
          {/* Category color indicator */}
          <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
          
          {/* Main task content - tappable for editing */}
          <TouchableOpacity
            style={styles.taskContent}
            onPress={handleTaskEdit}
            activeOpacity={0.7}
          >
            <View style={styles.taskInfo}>
              <View style={styles.taskTitleRow}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[
                    styles.taskTitle,
                    task.completed && { color: completedTextColor, textDecorationLine: 'line-through' }
                  ]}
                >
                  {task.title}
                </ThemedText>
                {/* Priority badge */}
                {task.priority && (
                  <ThemedText style={[styles.priorityBadge, { color: '#FF3B30' }]}>
                    {task.priority}
                  </ThemedText>
                )}
              </View>
              
              {/* Category tag - only show if showCategoryName is true */}
              {showCategoryName && (
                <ThemedText style={styles.categoryTag}>
                  {task.category}
                </ThemedText>
              )}
              
              {/* Task description */}
              {task.description && (
                <ThemedText
                  style={[
                    styles.taskDescription,
                    task.completed && { color: completedTextColor }
                  ]}
                >
                  {task.description}
                </ThemedText>
              )}
              
              {/* Subtasks list */}
              {task.subtasks && task.subtasks.length > 0 && (
                <View style={styles.subtasksContainer}>
                  {task.subtasks.map((subtask) => (
                    <ThemedText key={subtask.id} style={styles.subtaskText}>
                      • {subtask.name}
                    </ThemedText>
                  ))}
                </View>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Completion checkbox - separate touchable area */}
          <TouchableOpacity
            onPress={handleToggleCompletion}
            style={styles.checkboxTouchable}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
          >
            <View style={[
              styles.checkbox,
              { borderColor },
              task.completed && styles.checkedBox
            ]}>
              {task.completed && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SwipeToDelete>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden', // Ensure swipe animations don't overflow
  },
  completedTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    alignSelf: 'stretch',
  },
  taskContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 12, // Reduce left padding since category indicator provides spacing
  },
  taskInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, // Reduced from 4 to 2
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
  },
  priorityBadge: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  categoryTag: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
    marginBottom: 2, // Reduced from 4 to 2
  },
  taskDescription: {
    marginTop: 4, // Reduced from 8 to 4
    opacity: 0.8,
    lineHeight: 20,
  },
  subtasksContainer: {
    marginTop: 4, // Reduced from 8 to 4
  },
  subtaskText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2, // Reduced from 4 to 2
  },
  checkboxTouchable: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
