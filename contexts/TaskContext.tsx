/**
 * @fileoverview Task Context Provider for global task state management
 * Provides task CRUD operations, category management, and undo functionality
 */

import React, { createContext, ReactNode, useContext, useState } from 'react';

import {
    CategoryList,
    DeletedTask,
    Task,
    TaskContextType
} from '@/src/types';

/**
 * React Context for task management state
 * Undefined when used outside of TaskProvider
 */
const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Props for the TaskProvider component
 */
interface TaskProviderProps {
  /** Child components that will have access to task context */
  children: ReactNode;
}

/**
 * Task Context Provider component
 * 
 * Manages all task-related state and operations including:
 * - Task CRUD operations (Create, Read, Update, Delete)
 * - Category list management
 * - Temporary deletion with undo functionality
 * - Today's tasks filtering
 * 
 * @param props - Provider props containing children
 * @returns JSX.Element - Context provider wrapping children
 * 
 * @example
 * <TaskProvider>
 *   <App />
 * </TaskProvider>
 */
export function TaskProvider({ children }: TaskProviderProps) {
  // Main state: Array of category lists, each containing tasks
  const [categoryLists, setCategoryLists] = useState<CategoryList[]>([]);
  
  // Temporary storage for deleted tasks (enables undo functionality)
  const [deletedTasks, setDeletedTasks] = useState<Map<string, DeletedTask>>(new Map());

  /**
   * Adds a new category list to the application
   * 
   * @param categoryList - The new category list to add
   * 
   * @example
   * addCategoryList({
   *   category: "Work",
   *   tasks: [],
   *   color: "#FF0000",
   *   icon: "briefcase.fill"
   * });
   */
  const addCategoryList = (categoryList: CategoryList) => {
    setCategoryLists(prev => [...prev, categoryList]);
  };

  /**
   * Adds a new task to the specified category
   * 
   * @param task - The task to add (must have valid category)
   * 
   * @example
   * addTask({
   *   id: "123",
   *   title: "Complete project",
   *   category: "Work",
   *   completed: false,
   *   dueDate: new Date()
   * });
   */
  const addTask = (task: Task) => {
    setCategoryLists(prev =>
      prev.map(categoryList =>
        categoryList.category === task.category
          ? { ...categoryList, tasks: [...categoryList.tasks, task] }
          : categoryList
      )
    );
  };

  /**
   * Toggles the completion status of a task
   * 
   * @param taskId - Unique identifier of the task to toggle
   * 
   * @example
   * toggleTaskCompletion("task-123");
   */
  const toggleTaskCompletion = (taskId: string) => {
    setCategoryLists(prev =>
      prev.map(categoryList => ({
        ...categoryList,
        tasks: categoryList.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    );
  };

  /**
   * Deletes a task with undo functionality
   * 
   * Implements soft delete pattern:
   * 1. Removes task from UI immediately
   * 2. Stores task temporarily for undo capability
   * 3. Auto-deletes permanently after 5 seconds
   * 
   * @param taskId - Unique identifier of the task to delete
   * @returns Promise<boolean> - true if permanently deleted, false if temporary
   * 
   * @example
   * const isPermanent = await deleteTask("task-123");
   * if (!isPermanent) {
   *   // Show undo option to user
   * }
   */
  const deleteTask = (taskId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let deletedTask: Task | null = null;
      let categoryName = '';

      // Remove task from categoryLists and capture it for potential restoration
      setCategoryLists(prev =>
        prev.map(categoryList => {
          const taskIndex = categoryList.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            deletedTask = categoryList.tasks[taskIndex];
            categoryName = categoryList.category;
            return {
              ...categoryList,
              tasks: categoryList.tasks.filter(task => task.id !== taskId)
            };
          }
          return categoryList;
        })
      );

      if (deletedTask) {
        // Set up auto-delete timer (5 seconds)
        const timeoutId = setTimeout(() => {
          // Permanently delete: remove from temporary storage
          setDeletedTasks(prev => {
            const newMap = new Map(prev);
            newMap.delete(taskId);
            return newMap;
          });
          resolve(true); // Task permanently deleted
        }, 5000);

        // Store in temporary deleted tasks for potential restoration
        setDeletedTasks(prev => {
          const newMap = new Map(prev);
          newMap.set(taskId, {
            task: deletedTask!,
            categoryName,
            timeoutId
          });
          return newMap;
        });

        resolve(false); // Task temporarily deleted (can be undone)
      } else {
        resolve(true); // Task not found, consider it deleted
      }
    });
  };

  /**
   * Restores a temporarily deleted task
   * 
   * @param taskId - Unique identifier of the task to restore
   * 
   * @example
   * restoreTask("task-123"); // Brings back deleted task
   */
  const restoreTask = (taskId: string) => {
    const deletedTaskData = deletedTasks.get(taskId);
    if (deletedTaskData) {
      // Clear the auto-delete timeout
      clearTimeout(deletedTaskData.timeoutId);

      // Restore task to its original category
      setCategoryLists(prev =>
        prev.map(categoryList =>
          categoryList.category === deletedTaskData.categoryName
            ? { ...categoryList, tasks: [...categoryList.tasks, deletedTaskData.task] }
            : categoryList
        )
      );

      // Remove from deleted tasks storage
      setDeletedTasks(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });
    }
  };

  /**
   * Deletes an entire category list and all its tasks
   * 
   * @param categoryName - Name of the category to delete
   * 
   * @example
   * deleteCategoryList("Work"); // Removes entire Work category and all its tasks
   */
  const deleteCategoryList = (categoryName: string) => {
    setCategoryLists(prev =>
      prev.filter(categoryList => categoryList.category !== categoryName)
    );
  };

  /**
   * Retrieves all tasks that are due today
   * 
   * @returns Array of tasks with due date matching today's date
   * 
   * @example
   * const todayTasks = getTasksDueToday();
   * console.log(`You have ${todayTasks.length} tasks due today`);
   */
  const getTasksDueToday = (): Task[] => {
    const today = new Date();
    const todayString = today.toDateString();
    
    // Flatten all tasks from all categories
    const allTasks = categoryLists.flatMap(categoryList => categoryList.tasks);
    
    // Filter tasks due today
    return allTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === todayString;
    });
  };

  // Context value object containing all task operations
  const contextValue: TaskContextType = {
    categoryLists,
    addCategoryList,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    restoreTask,
    getTasksDueToday,
    deleteCategoryList,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Custom hook to access the task context
 * 
 * @throws Error if used outside of TaskProvider
 * @returns TaskContextType - All task management operations and state
 * 
 * @example
 * const { tasks, addTask, deleteTask } = useTaskContext();
 */
export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
} 