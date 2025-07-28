import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  category: string;
}

type IconName = typeof PREDEFINED_ICONS[number];

interface CategoryList {
  category: string;
  tasks: Task[];
  color: string;
  icon: IconName;
}

interface NewListData {
  name: string;
  color: string;
  icon: IconName;
}

const PREDEFINED_COLORS = [
  '#FF9500', // Orange
  '#34C759', // Green
  '#FF3B30', // Red
  '#007AFF', // Blue
  '#AF52DE', // Purple
  '#FF2D92', // Pink
  '#5AC8FA', // Light Blue
  '#FFCC02', // Yellow
];

const PREDEFINED_ICONS = [
  'list.bullet',
  'folder.fill',
  'briefcase.fill',
  'house.fill',
  'heart.fill',
  'star.fill',
  'bookmark.fill',
  'flag.fill',
  'target',
  'calendar',
  'clock.fill',
  'checkmark.circle.fill',
] as const;

export default function ListsScreen() {
  const [categoryLists, setCategoryLists] = useState<CategoryList[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListData, setNewListData] = useState<NewListData>({
    name: '',
    color: PREDEFINED_COLORS[0],
    icon: PREDEFINED_ICONS[0],
  });
  
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const completedTextColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text');
  const modalBackground = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  const inputBackground = useThemeColor({ light: '#F2F2F7', dark: '#2C2C2E' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  
  // Animation refs for each category
  const animationRefs = useRef<Record<string, {
    chevron: Animated.Value;
    content: Animated.Value;
  }>>({});

  useEffect(() => {
    // Initialize with empty state - ready for actual task data
    setCategoryLists([]);
  }, []);

  const createNewList = () => {
    if (!newListData.name.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    const newList: CategoryList = {
      category: newListData.name.trim(),
      tasks: [],
      color: newListData.color,
      icon: newListData.icon,
    };

    setCategoryLists(prev => [...prev, newList]);
    
    // Initialize animation values for the new category
    animationRefs.current[newList.category] = {
      chevron: new Animated.Value(0),
      content: new Animated.Value(1)
    };

    // Reset modal state
    setNewListData({
      name: '',
      color: PREDEFINED_COLORS[0],
      icon: PREDEFINED_ICONS[0],
    });
    setShowCreateModal(false);
  };

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

  const toggleCategoryCollapse = (category: string) => {
    const isCurrentlyCollapsed = collapsedCategories.has(category);
    const animations = animationRefs.current[category];
    
    if (!animations) return;

    if (isCurrentlyCollapsed) {
      // Expanding: Show content first, then animate in
      setCollapsedCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(category);
        return newSet;
      });
      
      Animated.timing(animations.chevron, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(animations.content, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Collapsing: Animate out, then hide content
      Animated.timing(animations.chevron, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(animations.content, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Hide content after animation completes
        setCollapsedCategories(prev => {
          const newSet = new Set(prev);
          newSet.add(category);
          return newSet;
        });
      });
    }
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
    const isCollapsed = collapsedCategories.has(item.category);
    const animations = animationRefs.current[item.category];

    if (!animations) return null;

    const chevronRotation = animations.chevron.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '0deg']
    });

    const contentOpacity = animations.content;
    const contentScale = animations.content.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1]
    });

    return (
      <View style={styles.categorySection}>
        <TouchableOpacity 
          style={styles.categoryHeader}
          onPress={() => toggleCategoryCollapse(item.category)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryTitleRow}>
            <Animated.View
              style={{
                transform: [{ rotate: chevronRotation }],
                marginRight: 8
              }}
            >
              <IconSymbol
                name="chevron.right"
                size={16}
                color={borderColor}
              />
            </Animated.View>
            <IconSymbol
              name={item.icon}
              size={20}
              color={item.color}
              style={{ marginRight: 8 }}
            />
            <ThemedText type="subtitle" style={styles.categoryTitle}>
              {item.category}
            </ThemedText>
          </View>
          <ThemedText style={styles.categoryCount}>
            {completedCount}/{totalCount}
          </ThemedText>
        </TouchableOpacity>
        
        {!isCollapsed && (
          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ scale: contentScale }]
            }}
          >
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
          </Animated.View>
        )}
      </View>
    );
  };

  const renderColorOption = (color: string) => (
    <TouchableOpacity
      key={color}
      style={[
        styles.colorOption,
        { backgroundColor: color },
        newListData.color === color && styles.selectedColorOption
      ]}
      onPress={() => setNewListData(prev => ({ ...prev, color }))}
    />
  );

  const renderIconOption = (icon: IconName) => (
    <TouchableOpacity
      key={icon}
      style={[
        styles.iconOption,
        newListData.icon === icon && { backgroundColor: newListData.color }
      ]}
      onPress={() => setNewListData(prev => ({ ...prev, icon }))}
    >
      <IconSymbol
        name={icon}
        size={24}
        color={newListData.icon === icon ? '#FFFFFF' : borderColor}
      />
    </TouchableOpacity>
  );

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

        {/* Create New List Button */}
        <TouchableOpacity
          style={[styles.createButton, { borderColor }]}
          onPress={() => setShowCreateModal(true)}
        >
          <IconSymbol name="plus" size={20} color={borderColor} />
          <ThemedText style={styles.createButtonText}>Create New List</ThemedText>
        </TouchableOpacity>

        {/* Categories List */}
        <FlatList
          data={categoryLists}
          renderItem={renderCategorySection}
          keyExtractor={(item) => item.category}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Create List Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: modalBackground }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText type="subtitle">New List</ThemedText>
              <TouchableOpacity onPress={createNewList}>
                <ThemedText style={[styles.modalCreateText, { color: newListData.color }]}>
                  Create
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {/* List Name Input */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>List Name</ThemedText>
                <TextInput
                  style={[styles.textInput, { backgroundColor: inputBackground, borderColor, color: textColor }]}
                  value={newListData.name}
                  onChangeText={(text) => setNewListData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter list name"
                  placeholderTextColor={borderColor}
                />
              </View>

              {/* Color Selection */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>Color</ThemedText>
                <View style={styles.colorGrid}>
                  {PREDEFINED_COLORS.map(renderColorOption)}
                </View>
              </View>

              {/* Icon Selection */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>Icon</ThemedText>
                <View style={styles.iconGrid}>
                  {PREDEFINED_ICONS.map(renderIconOption)}
                </View>
              </View>

              {/* Preview */}
              <View style={styles.previewSection}>
                <ThemedText style={styles.sectionLabel}>Preview</ThemedText>
                <View style={[styles.previewCard, { borderColor }]}>
                  <IconSymbol
                    name={newListData.icon}
                    size={20}
                    color={newListData.color}
                    style={{ marginRight: 8 }}
                  />
                  <ThemedText type="subtitle">
                    {newListData.name || 'List Name'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalCreateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -8, // Adjust for spacing between options
  },
  colorOption: {
    width: '22%', // 4 options per row
    height: 60,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  selectedColorOption: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -8, // Adjust for spacing between options
  },
  iconOption: {
    width: '23%', // 4 options per row
    aspectRatio: 1.2,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSection: {
    marginTop: -72,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
}); 