import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTaskContext } from '@/contexts/TaskContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/src/components/common/ThemedText';
import { Priority, Task } from '@/src/types';

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

const PRIORITY_OPTIONS: Priority[] = ['!!!', '!!', '!'];

export function EditTaskModal({ visible, task, onClose }: EditTaskModalProps) {
  const { updateTask, deleteTask } = useTaskContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: undefined as Priority | undefined,
    subtasks: [] as string[],
  });

  // Theme colors
  const modalBackground = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  const inputBackground = useThemeColor({ light: '#F2F2F7', dark: '#2C2C2E' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        subtasks: task.subtasks?.map(st => st.name) || [],
      });
    }
  }, [task]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData(prev => ({ ...prev, dueDate: currentDate }));
  };

  const addSubtask = () => {
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, ''],
    }));
  };

  const updateSubtask = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => (i === index ? value : subtask)),
    }));
  };

  const removeSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!task || !formData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const updatedTask: Task = {
      ...task,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate,
      priority: formData.priority,
      subtasks: formData.subtasks
        .filter(subtask => subtask.trim())
        .map((subtask, index) => ({
          id: task.subtasks?.[index]?.id || `${Date.now()}-${index}`,
          name: subtask.trim(),
          completed: task.subtasks?.[index]?.completed || false,
        })),
    };

    updateTask(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            onClose();
          },
        },
      ]
    );
  };

  const renderPriorityOption = (priority: Priority) => (
    <TouchableOpacity
      key={priority}
      style={[
        styles.priorityOption,
        { borderColor },
        formData.priority === priority && { backgroundColor: '#FF3B30' }
      ]}
      onPress={() => setFormData(prev => ({ 
        ...prev, 
        priority: prev.priority === priority ? undefined : priority 
      }))}
    >
      <ThemedText
        style={[
          styles.priorityText,
          formData.priority === priority && { color: '#FFFFFF' }
        ]}
      >
        {priority}
      </ThemedText>
    </TouchableOpacity>
  );

  if (!task) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: modalBackground }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle">Edit Task</ThemedText>
          <TouchableOpacity onPress={handleSave}>
            <ThemedText style={styles.saveText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Task Title */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Task Name</ThemedText>
            <TextInput
              style={[styles.textInput, { backgroundColor: inputBackground, borderColor, color: textColor }]}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter task name"
              placeholderTextColor={borderColor}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.textArea, { backgroundColor: inputBackground, borderColor, color: textColor }]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter task description"
              placeholderTextColor={borderColor}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Due Date</ThemedText>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: inputBackground, borderColor }]}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={{ color: textColor }}>
                {formatDate(formData.dueDate)}
              </ThemedText>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={formData.dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Priority</ThemedText>
            <View style={styles.priorityGrid}>
              {PRIORITY_OPTIONS.map(renderPriorityOption)}
            </View>
          </View>

          {/* Subtasks */}
          <View style={styles.section}>
            <View style={styles.subtaskHeader}>
              <ThemedText style={styles.label}>Subtasks</ThemedText>
              <TouchableOpacity onPress={addSubtask} style={styles.addButton}>
                <IconSymbol name="plus" size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {formData.subtasks.map((subtask, index) => (
              <View key={index} style={styles.subtaskRow}>
                <TextInput
                  style={[styles.subtaskInput, { backgroundColor: inputBackground, borderColor, color: textColor }]}
                  value={subtask}
                  onChangeText={(text) => updateSubtask(index, text)}
                  placeholder="Enter subtask"
                  placeholderTextColor={borderColor}
                />
                {formData.subtasks.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeSubtask(index)}
                    style={styles.removeButton}
                  >
                    <ThemedText style={{ color: '#FF3B30' }}>✕</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <IconSymbol name="trash" size={16} color="#FF3B30" />
            <ThemedText style={styles.deleteText}>Delete Task</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
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
    alignItems: 'center',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
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
  addButton: {
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
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#FF3B3010',
  },
  deleteText: {
    marginLeft: 8,
    color: '#FF3B30',
    fontWeight: '600',
  },
});
