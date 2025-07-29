import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, LayoutAnimation, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskGestureHandler } from '@/components/TaskGestureHandler';
import { WelcomeModal } from '@/components/WelcomeModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTaskContext } from '@/contexts/TaskContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/src/components/common/ThemedText';
import { ThemedView } from '@/src/components/common/ThemedView';
import { Snackbar } from '@/src/components/ui/Snackbar';
import { CategoryList, Priority, Task } from '@/src/types';

interface NewListData {
  name: string;
  color: string;
  icon: IconName;
}

interface NewTaskData {
  title: string;
  description: string;
  dueDate: Date;
  priority?: Priority;
  subtasks: string[];
  categoryName: string;
}

type IconName = typeof PREDEFINED_ICONS[number];

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

const PRIORITY_OPTIONS: Priority[] = ['!!!', '!!', '!'];

export default function ListsScreen() {
  const { categoryLists, addCategoryList, addTask, toggleTaskCompletion, updateTask, deleteTask, restoreTask, deleteCategoryList } = useTaskContext();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null);
  const [deletedTaskTitle, setDeletedTaskTitle] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newListData, setNewListData] = useState<NewListData>({
    name: '',
    color: PREDEFINED_COLORS[0],
    icon: PREDEFINED_ICONS[0],
  });
  const [newTaskData, setNewTaskData] = useState<NewTaskData>({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: undefined,
    subtasks: [''],
    categoryName: '',
  });
  
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const modalBackground = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  const inputBackground = useThemeColor({ light: '#F2F2F7', dark: '#2C2C2E' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  
  // Animation refs for each category
  const animationRefs = useRef<Record<string, {
    chevron: Animated.Value;
    content: Animated.Value;
  }>>({});

  // Configure layout animations for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  useEffect(() => {
    // Initialize animation values for existing categories
    categoryLists.forEach(({ category }) => {
      if (!animationRefs.current[category]) {
        animationRefs.current[category] = {
          chevron: new Animated.Value(0),
          content: new Animated.Value(1)
        };
      }
    });
  }, [categoryLists]);

  const createNewList = () => {
    if (!newListData.name.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    const newList = {
      category: newListData.name.trim(),
      tasks: [],
      color: newListData.color,
      icon: newListData.icon,
    };

    addCategoryList(newList);
    
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

  const openTaskModal = (categoryName: string) => {
    setNewTaskData(prev => ({
      ...prev,
      categoryName,
      title: '',
      description: '',
      dueDate: new Date(),
      priority: undefined,
      subtasks: [''],
    }));
    setShowDatePicker(false);
    setShowTaskModal(true);
  };

  const createNewTask = () => {
    if (!newTaskData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim() || undefined,
      dueDate: newTaskData.dueDate,
      completed: false,
      category: newTaskData.categoryName,
      priority: newTaskData.priority,
      subtasks: newTaskData.subtasks
        .filter(subtask => subtask.trim())
        .map((subtask, index) => ({
          id: `${Date.now()}-${index}`,
          name: subtask.trim(),
          completed: false,
        })),
    };

    addTask(newTask);
    setShowDatePicker(false);
    setShowTaskModal(false);
  };

  const closeTaskModal = () => {
    setShowDatePicker(false);
    setShowTaskModal(false);
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

  // Simple edit handler for TaskGestureHandler compatibility
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  /**
   * Handles saving edited task
   */
  const handleSaveEdit = () => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        subtasks: editingTask.subtasks,
      });
      setShowEditModal(false);
      setEditingTask(null);
    }
  };

  /**
   * Handles canceling edit
   */
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingTask(null);
    setShowEditDatePicker(false);
  };

  /**
   * Handles date change in edit modal
   */
  const handleEditDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || editingTask?.dueDate || new Date();
    setShowEditDatePicker(Platform.OS === 'ios');
    if (editingTask) {
      setEditingTask({ ...editingTask, dueDate: currentDate });
    }
  };

  /**
   * Handles long press on category header to delete entire list
   * Shows confirmation dialog before deletion
   * 
   * @param categoryName - Name of the category to delete
   * @param taskCount - Number of tasks in the category
   */
  const handleDeleteCategoryList = (categoryName: string, taskCount: number) => {
    // Provide haptic feedback for long press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const taskText = taskCount === 1 ? 'task' : 'tasks';
    const message = taskCount > 0 
      ? `This will permanently delete "${categoryName}" and all ${taskCount} ${taskText} in it.`
      : `This will permanently delete the "${categoryName}" list.`;

    Alert.alert(
      'Delete List',
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategoryList(categoryName),
        },
      ]
    );
  };

  const addSubtask = () => {
    setNewTaskData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, ''],
    }));
  };

  const updateSubtask = (index: number, value: string) => {
    setNewTaskData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => (i === index ? value : subtask)),
    }));
  };

  const removeSubtask = (index: number) => {
    setNewTaskData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || newTaskData.dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNewTaskData(prev => ({ ...prev, dueDate: currentDate }));
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
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
    <TaskGestureHandler
      task={item}
      categoryColor={categoryColor}
      onDelete={(taskId, taskTitle) => handleDeleteTask(taskId, taskTitle)}
      onEdit={handleEditTask}
      onToggleCompletion={(taskId) => {
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
      }}
      showCategoryName={false} // Don't show category name on lists page (tasks are already grouped by category)
    />
  );

  const renderCategorySection = ({ item }: { item: CategoryList }) => {
    const completedCount = item.tasks.filter((task: Task) => task.completed).length;
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

    // Sort tasks within this category: incomplete first, completed at bottom
    const sortedTasks = [...item.tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1; // Completed tasks go to bottom
    });

    return (
      <View style={styles.categorySection}>
        <TouchableOpacity 
          style={styles.categoryHeader}
          onPress={() => toggleCategoryCollapse(item.category)}
          onLongPress={() => handleDeleteCategoryList(item.category, item.tasks.length)}
          delayLongPress={800}
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
              name={item.icon as any}
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

            {sortedTasks.map((task) => (
              <View key={task.id}>
                {renderTaskItem({ item: task, categoryColor: item.color })}
              </View>
            ))}

            {/* Help text when tasks are present */}
            {item.tasks.length > 0 && (
              <ThemedText style={styles.helpText}>
                Tap to edit • Tap ✓ to complete • Swipe to delete
              </ThemedText>
            )}

            {/* Add Task Button - Smaller and more subtle */}
            <TouchableOpacity
              style={[styles.addTaskButton, { borderColor: borderColor + '50' }]} // 50% opacity for subtlety
              onPress={() => openTaskModal(item.category)}
            >
              <IconSymbol name="plus" size={14} color={borderColor} />
              <ThemedText style={styles.addTaskButtonText}>Add Task</ThemedText>
            </TouchableOpacity>
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

  const renderPriorityOption = (priority: Priority) => (
    <TouchableOpacity
      key={priority}
      style={[
        styles.priorityOption,
        { borderColor },
        newTaskData.priority === priority && { backgroundColor: '#FF3B30' }
      ]}
      onPress={() => setNewTaskData(prev => ({ 
        ...prev, 
        priority: prev.priority === priority ? undefined : priority 
      }))}
    >
      <ThemedText
        style={[
          styles.priorityText,
          newTaskData.priority === priority && { color: '#FFFFFF' }
        ]}
      >
        {priority}
      </ThemedText>
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
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>
              My Lists
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {totalCompleted}/{totalTasks} tasks completed
            </ThemedText>
          </View>
          
          {/* Help Button */}
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => setShowWelcomeModal(true)}
            activeOpacity={0.7}
          >
            <IconSymbol name="questionmark.circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        <FlatList
          data={categoryLists}
          renderItem={renderCategorySection}
          keyExtractor={(item) => item.category}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Create New List Button - Moved to bottom */}
        <TouchableOpacity
          style={[styles.createListButton, { borderColor }]}
          onPress={() => setShowCreateModal(true)}
        >
          <View style={styles.createListButtonContent}>
            <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
            <ThemedText style={styles.createListButtonText}>Create New List</ThemedText>
          </View>
        </TouchableOpacity>

        {/* Help text for list management */}
        {categoryLists.length > 0 && (
          <ThemedText style={styles.helpText}>
            Tap to expand/collapse • Hold to delete list
          </ThemedText>
        )}

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          message={`"${deletedTaskTitle}" deleted`}
          actionText="UNDO"
          onAction={handleUndoDelete}
          onDismiss={handleSnackbarDismiss}
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

        {/* Create Task Modal */}
        <Modal
          visible={showTaskModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: modalBackground }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeTaskModal}>
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText type="subtitle">New Task</ThemedText>
              <TouchableOpacity onPress={createNewTask}>
                <ThemedText style={[styles.modalCreateText, { color: '#007AFF' }]}>
                  Create
                </ThemedText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Task Title */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>Task Name</ThemedText>
                <TextInput
                  style={[styles.textInput, { backgroundColor: inputBackground, borderColor, color: textColor }]}
                  value={newTaskData.title}
                  onChangeText={(text) => setNewTaskData(prev => ({ ...prev, title: text }))}
                  placeholder="Enter task name"
                  placeholderTextColor={borderColor}
                />
              </View>

              {/* Task Description */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>Description (Optional)</ThemedText>
                <TextInput
                  style={[styles.textArea, { backgroundColor: inputBackground, borderColor, color: textColor }]}
                  value={newTaskData.description}
                  onChangeText={(text) => setNewTaskData(prev => ({ ...prev, description: text }))}
                  placeholder="Enter task description"
                  placeholderTextColor={borderColor}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Due Date */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>Due Date</ThemedText>
                <TouchableOpacity
                  style={[styles.dateButton, { backgroundColor: inputBackground, borderColor }]}
                  onPress={showDatePickerModal}
                >
                  <ThemedText style={{ color: textColor }}>
                    {formatDate(newTaskData.dueDate)}
                  </ThemedText>
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={newTaskData.dueDate}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              {/* Priority */}
              <View style={styles.inputSection}>
                <ThemedText style={styles.sectionLabel}>Priority (Optional)</ThemedText>
                <View style={styles.priorityGrid}>
                  {PRIORITY_OPTIONS.map(renderPriorityOption)}
                </View>
              </View>

              {/* Subtasks */}
              <View style={styles.inputSection}>
                <View style={styles.subtaskHeader}>
                  <ThemedText style={styles.sectionLabel}>Subtasks (Optional)</ThemedText>
                  <TouchableOpacity onPress={addSubtask} style={styles.addSubtaskButton}>
                    <IconSymbol name="plus" size={16} color="#007AFF" />
                  </TouchableOpacity>
                </View>
                {newTaskData.subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskRow}>
                    <TextInput
                      style={[styles.subtaskInput, { backgroundColor: inputBackground, borderColor, color: textColor }]}
                      value={subtask}
                      onChangeText={(text) => updateSubtask(index, text)}
                      placeholder="Enter subtask"
                      placeholderTextColor={borderColor}
                    />
                    {newTaskData.subtasks.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeSubtask(index)}
                        style={styles.removeSubtaskButton}
                      >
                        <ThemedText style={{ color: '#FF3B30' }}>✕</ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Edit Task Modal */}
        {showEditModal && editingTask && (
          <Modal
            visible={showEditModal}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <SafeAreaView style={[styles.modalContainer, { backgroundColor: modalBackground }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
                </TouchableOpacity>
                <ThemedText type="subtitle">Edit Task</ThemedText>
                <TouchableOpacity onPress={handleSaveEdit}>
                  <ThemedText style={[styles.modalSaveText, { color: '#007AFF' }]}>
                    Save
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {/* Task Title */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.sectionLabel}>Task Name</ThemedText>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: inputBackground,
                      borderColor,
                      color: textColor
                    }]}
                    value={editingTask.title}
                    onChangeText={(text) => setEditingTask({ ...editingTask, title: text })}
                    placeholder="Enter task name"
                    placeholderTextColor={borderColor}
                  />
                </View>

                {/* Task Description */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.sectionLabel}>Description (Optional)</ThemedText>
                  <TextInput
                    style={[styles.textArea, { 
                      backgroundColor: inputBackground,
                      borderColor,
                      color: textColor
                    }]}
                    value={editingTask.description || ''}
                    onChangeText={(text) => setEditingTask({ ...editingTask, description: text })}
                    placeholder="Enter task description"
                    placeholderTextColor={borderColor}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Due Date */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.sectionLabel}>Due Date</ThemedText>
                  <TouchableOpacity
                    style={[styles.dateButton, { 
                      backgroundColor: inputBackground,
                      borderColor 
                    }]}
                    onPress={() => setShowEditDatePicker(true)}
                  >
                    <ThemedText>
                      {formatDate(editingTask.dueDate)}
                    </ThemedText>
                  </TouchableOpacity>
                  
                  {showEditDatePicker && (
                    <DateTimePicker
                      testID="editDateTimePicker"
                      value={editingTask.dueDate}
                      mode="date"
                      is24Hour={true}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleEditDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                {/* Priority */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.sectionLabel}>Priority (Optional)</ThemedText>
                  <View style={styles.priorityGrid}>
                    {(['!!!', '!!', '!'] as Priority[]).map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.priorityOption,
                          { borderColor },
                          editingTask.priority === priority && { backgroundColor: '#FF3B30' }
                        ]}
                        onPress={() => setEditingTask({ 
                          ...editingTask, 
                          priority: editingTask.priority === priority ? undefined : priority 
                        })}
                      >
                        <ThemedText
                          style={[
                            styles.priorityText,
                            editingTask.priority === priority && { color: '#FFFFFF' }
                          ]}
                        >
                          {priority}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Subtasks */}
                <View style={styles.inputSection}>
                  <View style={styles.subtaskHeader}>
                    <ThemedText style={styles.sectionLabel}>Subtasks (Optional)</ThemedText>
                    <TouchableOpacity
                      style={styles.addSubtaskButton}
                      onPress={() => {
                        const currentSubtasks = editingTask.subtasks || [];
                        setEditingTask({
                          ...editingTask,
                          subtasks: [...currentSubtasks, { id: Date.now().toString(), name: '', completed: false }]
                        });
                      }}
                    >
                      <ThemedText style={{ color: '#007AFF', fontSize: 16 }}>+ Add</ThemedText>
                    </TouchableOpacity>
                  </View>
                  {editingTask.subtasks && editingTask.subtasks.length > 0 && (
                    <View>
                      {editingTask.subtasks.map((subtask, index) => (
                        <View key={subtask.id} style={styles.subtaskRow}>
                          <TextInput
                            style={[styles.subtaskInput, {
                              backgroundColor: inputBackground,
                              borderColor,
                              color: textColor
                            }]}
                            value={subtask.name}
                            onChangeText={(text) => {
                              const updatedSubtasks = [...(editingTask.subtasks || [])];
                              updatedSubtasks[index] = { ...updatedSubtasks[index], name: text };
                              setEditingTask({ ...editingTask, subtasks: updatedSubtasks });
                            }}
                            placeholder={`Subtask ${index + 1}`}
                            placeholderTextColor={borderColor}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              const updatedSubtasks = (editingTask.subtasks || []).filter((_, i) => i !== index);
                              setEditingTask({ ...editingTask, subtasks: updatedSubtasks });
                            }}
                          >
                            <ThemedText style={{ color: '#FF3B30', fontSize: 16, padding: 8 }}>✕</ThemedText>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        )}

        {/* Welcome Modal for help */}
        <WelcomeModal
          visible={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  helpButton: {
    padding: 8,
    marginTop: -8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  categoriesList: {
    paddingBottom: 10, // Reduced since Create New List button is now below
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
  taskDescription: {
    opacity: 0.8,
    lineHeight: 20,
    fontSize: 14,
  },
  dueDateText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
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
  createListButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createListButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createListButtonText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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
  modalSaveText: {
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
  textArea: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 80,
  },
  dateButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    alignItems: 'center',
    justifyContent: 'center',
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
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -8, // Adjust for spacing between options
  },
  priorityOption: {
    width: '30%', // 3 options per row
    height: 40,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addSubtaskButton: {
    padding: 8,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    marginRight: 8,
  },
  removeSubtaskButton: {
    padding: 4,
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
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  addTaskButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  helpText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 12,
    textAlign: 'center',
  },
}); 