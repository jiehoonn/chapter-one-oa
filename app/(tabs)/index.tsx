import React, { useEffect, useState } from 'react';
import { Alert, FlatList, LayoutAnimation, Platform, StyleSheet, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Snackbar } from '@/components/Snackbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Task, useTaskContext } from '@/contexts/TaskContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const { getTasksDueToday, toggleTaskCompletion, deleteTask, restoreTask, categoryLists } = useTaskContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null);
  const [deletedTaskTitle, setDeletedTaskTitle] = useState<string>('');
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const completedTextColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text');

  // Configure layout animations for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  useEffect(() => {
    // Get tasks due today whenever categoryLists changes
    const todayTasks = getTasksDueToday();
    // Sort tasks: incomplete tasks first, completed tasks at the bottom
    const sortedTasks = todayTasks.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1; // Completed tasks go to bottom
    });
    setTasks(sortedTasks);
  }, [categoryLists, getTasksDueToday]);

  const handleToggleTaskCompletion = (taskId: string) => {
    // Configure the layout animation for smooth reordering
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    });
    
    toggleTaskCompletion(taskId);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    const isPermanent = await deleteTask(taskId);
    if (!isPermanent) {
      // Show snackbar for undo
      setDeletedTaskId(taskId);
      setDeletedTaskTitle(taskTitle);
      setSnackbarVisible(true);
    }
  };

  const handleLongPress = (taskId: string, taskTitle: string) => {
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
          onPress: () => handleDeleteTask(taskId, taskTitle),
        },
      ]
    );
  };

  const handleUndoDelete = () => {
    if (deletedTaskId) {
      restoreTask(deletedTaskId);
      setSnackbarVisible(false);
      setDeletedTaskId(null);
      setDeletedTaskTitle('');
    }
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    setDeletedTaskId(null);
    setDeletedTaskTitle('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTaskCategoryColor = (categoryName: string) => {
    const categoryList = categoryLists.find(cat => cat.category === categoryName);
    return categoryList?.color || '#8E8E93';
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskCard,
        { borderColor },
        item.completed && styles.completedTask
      ]}
      onPress={() => handleToggleTaskCompletion(item.id)}
      onLongPress={() => handleLongPress(item.id, item.title)}
      delayLongPress={600}
    >
      <View style={styles.taskHeader}>
        <View style={[styles.categoryIndicator, { backgroundColor: getTaskCategoryColor(item.category) }]} />
        <View style={styles.taskInfo}>
          <View style={styles.taskTitleRow}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.taskTitle,
                item.completed && { color: completedTextColor, textDecorationLine: 'line-through' }
              ]}
            >
              {item.title}
            </ThemedText>
            {item.priority && (
              <ThemedText style={[styles.priorityBadge, { color: '#FF3B30' }]}>
                {item.priority}
              </ThemedText>
            )}
          </View>
          <ThemedText style={styles.categoryTag}>
            {item.category}
          </ThemedText>
          {item.description && (
            <ThemedText
              style={[
                styles.taskDescription,
                item.completed && { color: completedTextColor }
              ]}
            >
              {item.description}
            </ThemedText>
          )}
          {item.subtasks && item.subtasks.length > 0 && (
            <View style={styles.subtasksContainer}>
              {item.subtasks.map((subtask) => (
                <ThemedText key={subtask.id} style={styles.subtaskText}>
                  • {subtask.name}
                </ThemedText>
              ))}
            </View>
          )}
        </View>
        <View style={[
          styles.checkbox,
          { borderColor },
          item.completed && styles.checkedBox
        ]}>
          {item.completed && (
            <ThemedText style={styles.checkmark}>✓</ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Task Manager
          </ThemedText>
          <ThemedText style={styles.dateText}>
            {formatDate(new Date())}
          </ThemedText>
        </View>

        {/* Progress Section */}
        <ThemedView style={[styles.progressCard, { borderColor }]}>
          <ThemedText type="subtitle" style={styles.progressTitle}>
            Today&apos;s Progress
          </ThemedText>
          <ThemedText style={styles.progressText}>
            {completedCount} of {totalCount} tasks completed
          </ThemedText>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }
              ]}
            />
          </View>
        </ThemedView>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Today&apos;s Tasks
          </ThemedText>
          {tasks.length > 0 && (
            <ThemedText style={styles.helpText}>
              Tap to complete • Long press to delete
            </ThemedText>
          )}
          
          {tasks.length === 0 ? (
            <ThemedView style={[styles.emptyState, { borderColor }]}>
              <ThemedText style={styles.emptyStateText}>
                No tasks for today! 🎉
              </ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                Enjoy your free time or add some tasks to stay productive.
              </ThemedText>
            </ThemedView>
          ) : (
            <FlatList
              data={tasks}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
            />
          )}
        </View>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          message={`"${deletedTaskTitle}" deleted`}
          actionText="UNDO"
          onAction={handleUndoDelete}
          onDismiss={handleSnackbarDismiss}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    opacity: 0.7,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  progressTitle: {
    marginBottom: 8,
  },
  progressText: {
    marginBottom: 12,
    opacity: 0.8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  tasksSection: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  tasksList: {
    paddingBottom: 20,
  },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
    alignSelf: 'stretch',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
    marginBottom: 4,
  },
  taskDescription: {
    marginTop: 8,
    opacity: 0.8,
    lineHeight: 20,
  },
  subtasksContainer: {
    marginTop: 8,
  },
  subtaskText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
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
  emptyState: {
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
    textAlign: 'center',
  },
}); 