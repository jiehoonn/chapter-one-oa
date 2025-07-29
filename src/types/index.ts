/**
 * @fileoverview Type definitions for the Task Manager application
 * Contains all interfaces, types, and enums used throughout the app
 */

/**
 * Priority levels for tasks
 * - '!!!': Highest priority (urgent)
 * - '!!': High priority  
 * - '!': Medium priority
 */
export type Priority = '!!!' | '!!' | '!';

/**
 * Subtask interface representing a sub-item within a main task
 */
export interface Subtask {
  /** Unique identifier for the subtask */
  id: string;
  /** Display name of the subtask */
  name: string;
  /** Whether the subtask has been completed */
  completed: boolean;
}

/**
 * Main Task interface representing a single task in the application
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Task title/name */
  title: string;
  /** Optional detailed description of the task */
  description?: string;
  /** Date when the task is due */
  dueDate: Date;
  /** Whether the task has been completed */
  completed: boolean;
  /** Category/list that this task belongs to */
  category: string;
  /** Optional priority level */
  priority?: Priority;
  /** Optional array of subtasks */
  subtasks?: Subtask[];
}

/**
 * Category list interface representing a collection of tasks with visual styling
 */
export interface CategoryList {
  /** Name of the category */
  category: string;
  /** Array of tasks in this category */
  tasks: Task[];
  /** Hex color code for visual identification */
  color: string;
  /** Icon name for visual identification (SF Symbols/Material Icons) */
  icon: string;
}

/**
 * Temporarily deleted task interface for undo functionality
 */
export interface DeletedTask {
  /** The task that was deleted */
  task: Task;
  /** Name of the category the task belonged to */
  categoryName: string;
  /** Timeout ID for auto-permanent deletion */
  timeoutId: number;
}

/**
 * Task Context interface defining all available task management operations
 */
export interface TaskContextType {
  /** Array of all category lists with their tasks */
  categoryLists: CategoryList[];
  /** Function to add a new category list */
  addCategoryList: (categoryList: CategoryList) => void;
  /** Function to add a new task to a category */
  addTask: (task: Task) => void;
  /** Function to toggle task completion status */
  toggleTaskCompletion: (taskId: string) => void;
  /** Function to update an existing task */
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  /** Function to delete a task (returns true if permanent, false if temporary) */
  deleteTask: (taskId: string) => Promise<boolean>;
  /** Function to restore a temporarily deleted task */
  restoreTask: (taskId: string) => void;
  /** Function to get all tasks due today */
  getTasksDueToday: () => Task[];
}

/**
 * Props for components that need theme color support
 */
export interface ThemedProps {
  /** Light and dark theme color options */
  lightColor?: string;
  darkColor?: string;
}

/**
 * Snackbar component props interface
 */
export interface SnackbarProps {
  /** Whether the snackbar is visible */
  visible: boolean;
  /** Message to display in the snackbar */
  message: string;
  /** Optional action button text */
  actionText?: string;
  /** Optional action button callback */
  onAction?: () => void;
  /** Callback when snackbar is dismissed */
  onDismiss: () => void;
  /** Duration in milliseconds before auto-dismiss (default: 5000) */
  duration?: number;
}

/**
 * Color scheme type for theme support
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Navigation route names for type-safe navigation
 */
export type RouteNames = 'index' | 'lists'; 