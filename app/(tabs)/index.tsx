/**
 * @fileoverview Home screen displaying today's tasks with completion tracking
 * Features animated task reordering and progress visualization
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { FlatList, LayoutAnimation, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskGestureHandler } from '@/components/TaskGestureHandler';
import { WelcomeModal } from '@/components/WelcomeModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTaskContext } from '@/contexts/TaskContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/src/components/common/ThemedText';
import { ThemedView } from '@/src/components/common/ThemedView';
import { Snackbar } from '@/src/components/ui/Snackbar';
import { Priority, Task } from '@/src/types';
import { formatDate } from '@/src/utils';

/**
 * Home Screen Component
 * 
 * Displays today's tasks with the following features:
 * - Animated task reordering (completed tasks move to bottom)
 * - Progress tracking with visual indicators
 * - Task completion toggle functionality
 * - Task deletion with undo capability
 * - Responsive design for different screen sizes
 * 
 * @returns JSX.Element - The home screen component
 */
export default function HomeScreen() {
  // Task context for accessing global task state and operations
  const { getTasksDueToday, toggleTaskCompletion, updateTask, deleteTask, restoreTask, categoryLists } = useTaskContext();
  
  // Local state for screen-specific functionality
  const [tasks, setTasks] = useState<Task[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null);
  const [deletedTaskTitle, setDeletedTaskTitle] = useState<string>('');
  
  // Edit task modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Theme-aware colors
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const inputBackgroundColor = useThemeColor({ light: '#F2F2F7', dark: '#2C2C2E' }, 'background');
  const textColor = useThemeColor({}, 'text');

  /**
   * Configure layout animations for Android compatibility
   * Enables smooth task reordering animations on Android devices
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  /**
   * Update tasks when category lists change
   * Sorts tasks to show incomplete ones first, completed ones at bottom
   * Within each group, sorts by priority (highest first)
   */
  useEffect(() => {
    // Get tasks due today whenever categoryLists changes
    const todayTasks = getTasksDueToday();
    
    // Sort tasks: incomplete first, then by priority within each group
    const sortedTasks = todayTasks.sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Completed tasks go to bottom
      }
      
      // Then sort by priority within the same completion group
      const priorityOrder = { '!!!': 0, '!!': 1, '!': 2 };
      const aPriority = a.priority ? priorityOrder[a.priority] : 999; // No priority goes last
      const bPriority = b.priority ? priorityOrder[b.priority] : 999;
      
      return aPriority - bPriority; // Higher priority (lower number) comes first
    });
    
    setTasks(sortedTasks);
  }, [categoryLists, getTasksDueToday]);

  /**
   * Handles task completion toggle with smooth animation
   * Configures layout animation before state change for smooth reordering
   * 
   * @param taskId - Unique identifier of the task to toggle
   */
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

  /**
   * Handles task deletion with undo functionality
   * Since swipe-to-delete is an intentional gesture, no confirmation is needed
   * 
   * @param taskId - Unique identifier of the task to delete
   * @param taskTitle - Title of the task for display in snackbar
   */
  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    const isPermanent = await deleteTask(taskId);
    if (!isPermanent) {
      // Show snackbar for undo
      setDeletedTaskId(taskId);
      setDeletedTaskTitle(taskTitle);
      setSnackbarVisible(true);
    }
  };

  /**
   * Handles undo action from snackbar
   * Restores the temporarily deleted task
   */
  const handleUndoDelete = () => {
    if (deletedTaskId) {
      restoreTask(deletedTaskId);
      setSnackbarVisible(false);
      setDeletedTaskId(null);
      setDeletedTaskTitle('');
    }
  };

  /**
   * Handles snackbar dismissal
   * Cleans up temporary delete state
   */
  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    setDeletedTaskId(null);
    setDeletedTaskTitle('');
  };

  /**
   * Handles opening the edit modal for a task
   * 
   * @param task - Task to edit
   */
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
    setShowDatePicker(false);
  };

  /**
   * Handles date change in edit modal
   */
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || editingTask?.dueDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    if (editingTask) {
      setEditingTask({ ...editingTask, dueDate: currentDate });
    }
  };

  /**
   * Gets the color for a task's category indicator
   * 
   * @param categoryName - Name of the category
   * @returns Hex color string for the category
   */
  const getTaskCategoryColor = (categoryName: string) => {
    const categoryList = categoryLists.find(cat => cat.category === categoryName);
    return categoryList?.color || '#8E8E93';
  };

  /**
   * Renders a single task item with gesture handling
   * 
   * @param item - Task object to render
   * @returns JSX.Element - Rendered task item with edit, completion, and delete functionality
   */
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskGestureHandler
      task={item}
      categoryColor={getTaskCategoryColor(item.category)}
      onEdit={handleEditTask}
      onToggleCompletion={handleToggleTaskCompletion}
      onDelete={handleDeleteTask}
      showCategoryName={true} // Show category name on home page
    />
  );

  // Calculate completion statistics
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>
              Task Manager
            </ThemedText>
            <ThemedText style={styles.dateText}>
              {formatDate(new Date())}
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
              Tap to edit • Tap ✓ to complete • Swipe left to delete
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

        {/* Snackbar for undo functionality */}
        <Snackbar
          visible={snackbarVisible}
          message={`"${deletedTaskTitle}" deleted`}
          actionText="UNDO"
          onAction={handleUndoDelete}
          onDismiss={handleSnackbarDismiss}
        />

        {/* Edit Task Modal */}
        {showEditModal && editingTask && (
          <Modal
            visible={showEditModal}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <SafeAreaView style={[styles.modalContainer, { backgroundColor }]}>
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
                      backgroundColor: inputBackgroundColor,
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
                      backgroundColor: inputBackgroundColor,
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
                      backgroundColor: inputBackgroundColor,
                      borderColor 
                    }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <ThemedText>
                      {formatDate(editingTask.dueDate)}
                    </ThemedText>
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={editingTask.dueDate}
                      mode="date"
                      is24Hour={true}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
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
                              backgroundColor: inputBackgroundColor,
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
                            style={styles.removeSubtaskButton}
                            onPress={() => {
                              const updatedSubtasks = (editingTask.subtasks || []).filter((_, i) => i !== index);
                              setEditingTask({ ...editingTask, subtasks: updatedSubtasks });
                            }}
                          >
                            <ThemedText style={{ color: '#FF3B30', fontSize: 16 }}>✕</ThemedText>
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
  
  // Modal styles for edit task functionality
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
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  textArea: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Subtask editing styles
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
    fontSize: 14,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  removeSubtaskButton: {
    padding: 8,
  },
}); 