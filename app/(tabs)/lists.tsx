import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  category: string;
}

interface CategoryList {
  category: string;
  tasks: Task[];
  color: string;
}

// Mock data with more tasks for demonstration
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
  },
  {
    id: '5',
    title: 'Team standup meeting',
    description: 'Daily sync with the development team',
    dueDate: new Date(),
    completed: true,
    category: 'Work'
  },
  {
    id: '6',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodations',
    dueDate: new Date(),
    completed: false,
    category: 'Personal'
  },
  {
    id: '7',
    title: 'Code review session',
    description: 'Review pull requests from team members',
    dueDate: new Date(),
    completed: false,
    category: 'Professional'
  }
];

const CATEGORY_COLORS = {
  Work: '#FF9500',
  Personal: '#34C759',
  Health: '#FF3B30',
  Professional: '#007AFF',
  Default: '#8E8E93'
};

export default function ListsScreen() {
  const [categoryLists, setCategoryLists] = useState<CategoryList[]>([]);
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const completedTextColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text');

  useEffect(() => {
    // Group tasks by category
    const grouped = MOCK_TASKS.reduce((acc, task) => {
      const category = task.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    // Convert to array of CategoryList objects
    const categoryListsArray = Object.entries(grouped).map(([category, tasks]) => ({
      category,
      tasks,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Default
    }));

    setCategoryLists(categoryListsArray);
  }, []);

  const toggleTaskCompletion = (taskId: string) => {
    setCategoryLists(prevLists =>
      prevLists.map(categoryList => ({
        ...categoryList,
        tasks: categoryList.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    );
  };

  const renderTaskItem = ({ item, categoryColor }: { item: Task; categoryColor: string }) => (
    <TouchableOpacity
      style={[
        styles.taskCard,
        { borderColor },
        item.completed && styles.completedTask
      ]}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <View style={styles.taskHeader}>
        <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
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

  const renderCategorySection = ({ item }: { item: CategoryList }) => {
    const completedCount = item.tasks.filter(task => task.completed).length;
    const totalCount = item.tasks.length;

    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleRow}>
            <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
            <ThemedText type="subtitle" style={styles.categoryTitle}>
              {item.category}
            </ThemedText>
          </View>
          <ThemedText style={styles.categoryCount}>
            {completedCount}/{totalCount}
          </ThemedText>
        </View>
        
        <View style={styles.categoryProgress}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { 
                  backgroundColor: item.color,
                  width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%'
                }
              ]}
            />
          </View>
        </View>

        {item.tasks.map((task) => (
          <View key={task.id}>
            {renderTaskItem({ item: task, categoryColor: item.color })}
          </View>
        ))}
      </View>
    );
  };

  const totalTasks = categoryLists.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const totalCompleted = categoryLists.reduce((acc, cat) => 
    acc + cat.tasks.filter(task => task.completed).length, 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            My Lists
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {totalCompleted}/{totalTasks} tasks completed
          </ThemedText>
        </View>

        {/* Categories List */}
        <FlatList
          data={categoryLists}
          renderItem={renderCategorySection}
          keyExtractor={(item) => item.category}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: '500',
  },
  categoryProgress: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
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
    marginRight: 12,
    alignSelf: 'stretch',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    marginBottom: 4,
  },
  taskDescription: {
    opacity: 0.8,
    lineHeight: 20,
    fontSize: 14,
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