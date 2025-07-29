/**
 * @fileoverview Welcome modal component for first-time user onboarding
 * Displays comprehensive app instructions, gesture guides, and feature explanations
 * to help new users understand how to use the task manager effectively
 */

import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/src/components/common/ThemedText';
import { ThemedView } from '@/src/components/common/ThemedView';

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * WelcomeModal component that displays instructions for first-time users
 * 
 * Features:
 * - App overview and main functionality
 * - Gesture instructions with visual examples
 * - Navigation explanation
 * - Tips for efficient task management
 * 
 * @param props - Welcome modal configuration
 * @returns JSX.Element - Welcome modal with instructions
 */
export function WelcomeModal({ visible, onClose }: WelcomeModalProps) {
  // Theme-aware colors
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#E5E5E7', dark: '#2C2C2E' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#F2F2F7', dark: '#2C2C2E' }, 'background');

  const gestureInstructions = [
    {
      icon: 'hand.tap',
      title: 'Tap to Edit',
      description: 'Tap anywhere on a task to open the edit modal where you can modify title, description, due date, priority, and subtasks.'
    },
    {
      icon: 'checkmark.circle',
      title: 'Tap ✓ to Complete',
      description: 'Tap the checkbox on the right to mark tasks as complete. Completed tasks move to the bottom with a strikethrough effect.'
    },
    {
      icon: 'hand.point.left',
      title: 'Swipe Left to Delete',
      description: 'Swipe any task to the left to delete it. You\'ll get an undo option for 5 seconds to restore accidentally deleted tasks.'
    },
    {
      icon: 'hand.tap.fill',
      title: 'Hold to Delete List',
      description: 'Hold down on any task list header for a moment to delete the entire list and all its tasks. A confirmation dialog will appear first.'
    },
    {
      icon: 'plus.circle',
      title: 'Create & Organize',
      description: 'Use the Lists tab to create custom categories with colors and icons. Add tasks with priorities and subtasks for detailed planning.'
    }
  ];

  const features = [
    {
      icon: 'house.fill',
      title: 'Home Screen',
      description: 'View all tasks due today with progress tracking and animated reordering.'
    },
    {
      icon: 'list.bullet',
      title: 'Lists Screen',
      description: 'Organize tasks into custom categories. Create new lists and manage tasks by category.'
    },
    {
      icon: 'calendar',
      title: 'Smart Scheduling',
      description: 'Set due dates and priorities. Tasks automatically organize by completion status and priority level.'
    },
    {
      icon: 'star.fill',
      title: 'Priority System',
      description: 'Use !!!, !!, or ! to set task priorities. Higher priority tasks appear first in each section.'
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <IconSymbol name="sparkles" size={24} color="#007AFF" />
              <ThemedText type="title" style={styles.headerTitle}>
                Welcome to Task Manager
              </ThemedText>
            </View>
            <ThemedText style={styles.subtitle}>
              Your personal productivity companion
            </ThemedText>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Features Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Main Features
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Discover what makes Task Manager perfect for organizing your daily tasks and long-term projects.
            </ThemedText>
            
            {features.map((feature, index) => (
              <ThemedView key={index} style={[styles.featureCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
                <View style={styles.featureHeader}>
                  <IconSymbol name={feature.icon as any} size={20} color="#007AFF" />
                  <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                    {feature.title}
                  </ThemedText>
                </View>
                <ThemedText style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </ThemedView>
            ))}
          </View>

          {/* Gestures Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Essential Gestures
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Master these simple gestures to efficiently manage your tasks with intuitive touch interactions.
            </ThemedText>
            
            {gestureInstructions.map((gesture, index) => (
              <ThemedView key={index} style={[styles.gestureCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
                <View style={styles.gestureHeader}>
                  <View style={[styles.gestureIconContainer, { backgroundColor: '#007AFF15' }]}>
                    <IconSymbol name={gesture.icon as any} size={24} color="#007AFF" />
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.gestureTitle}>
                    {gesture.title}
                  </ThemedText>
                </View>
                <ThemedText style={styles.gestureDescription}>
                  {gesture.description}
                </ThemedText>
              </ThemedView>
            ))}
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Pro Tips
            </ThemedText>
            
            <ThemedView style={[styles.tipsCard, { backgroundColor: '#34C75915', borderColor: '#34C759' }]}>
              <View style={styles.tipHeader}>
                <IconSymbol name="lightbulb" size={20} color="#34C759" />
                <ThemedText type="defaultSemiBold" style={[styles.tipTitle, { color: '#34C759' }]}>
                  Maximize Your Productivity
                </ThemedText>
              </View>
              <View style={styles.tipsList}>
                <ThemedText style={styles.tipItem}>• Use priority levels to focus on what matters most</ThemedText>
                <ThemedText style={styles.tipItem}>• Break complex tasks into subtasks for better progress tracking</ThemedText>
                <ThemedText style={styles.tipItem}>• Create themed lists with colors and icons for visual organization</ThemedText>
                <ThemedText style={styles.tipItem}>• Check the Home screen daily to see your focused task list</ThemedText>
                <ThemedText style={styles.tipItem}>• Don&apos;t worry about accidental deletions - you can always undo!</ThemedText>
              </View>
            </ThemedView>
          </View>

          {/* Get Started Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.getStartedButton, { borderColor }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
              <ThemedText style={styles.getStartedText}>
                Get Started
              </ThemedText>
            </TouchableOpacity>
            
            <ThemedText style={styles.footerText}>
              You can always access these instructions later from the app settings.
            </ThemedText>
          </View>
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
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  closeButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 22,
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    marginLeft: 12,
    fontSize: 16,
  },
  featureDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  gestureCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  gestureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gestureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureTitle: {
    marginLeft: 12,
    fontSize: 16,
  },
  gestureDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    opacity: 0.8,
    lineHeight: 20,
  },
  actionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    minWidth: 200,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 14,
    lineHeight: 20,
  },
});
