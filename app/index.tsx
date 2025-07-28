import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// Task interface for type safety
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  category?: string; // for future category implementation
}

// Mock data for demonstration - replace with actual data source later
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review project proposals',
    description: 'Go through the Q4 project proposals and provide feedback',
    dueDate: new Date(),
    completed: false,
    category: 'Work'
  },
  {
    id: '2',
    title: 'Grocery shopping',
    description: 'Buy ingredients for weekend meal prep',
    dueDate: new Date(),
    completed: false,
    category: 'Personal'
  },
  {
    id: '3',
    title: 'Call dentist',
    description: 'Schedule regular checkup appointment',
    dueDate: new Date(),
    completed: true,
    category: 'Health'
  },
  {
    id: '4',
    title: 'Update portfolio website',
    description: 'Add recent projects and update resume',
    dueDate: new Date(),
    completed: false,
    category: 'Professional'
  }
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const cardBackground = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const completedTextColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text');

  useEffect(() => {
    // Filter tasks for today - in real app, this would be an API call
    const today = new Date();
    const todayTasks = MOCK_TASKS.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString();
    });
    setTasks(todayTasks);
  }, []);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskCard,
        { borderColor },
        item.completed && styles.completedTask
      ]}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.taskTitle,
              item.completed && { color: completedTextColor, textDecorationLine: 'line-through' }
            ]}
          >
            {item.title}
          </ThemedText>
          {item.category && (
            <ThemedText style={styles.categoryTag}>
              {item.category}
            </ThemedText>
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

        {/* Future Categories Section (placeholder) */}
        <View style={styles.categoriesPlaceholder}>
          <ThemedText style={styles.placeholderText}>
            📁 Categories coming soon...
          </ThemedText>
        </View>
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
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
  },
  taskDescription: {
    marginTop: 8,
    opacity: 0.8,
    lineHeight: 20,
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
  categoriesPlaceholder: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.5,
    fontSize: 14,
  },
}); 