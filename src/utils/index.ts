/**
 * @fileoverview Utility functions for the Task Manager application
 * Contains common helper functions used throughout the app
 */

/**
 * Formats a date object into a readable string for display
 * @param date - The date to format
 * @param options - Formatting options (defaults to long format)
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "Friday, December 15, 2023"
 * formatDate(new Date(), { format: 'short' }) // "Dec 15, 2023"
 */
export const formatDate = (
  date: Date, 
  options: { format?: 'long' | 'short' } = { format: 'long' }
): string => {
  if (options.format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generates a unique ID for tasks and subtasks
 * @returns A unique string identifier based on timestamp
 * 
 * @example
 * generateId() // "1703520000000"
 */
export const generateId = (): string => {
  return Date.now().toString();
};

/**
 * Checks if a given date is today
 * @param date - The date to check
 * @returns True if the date is today, false otherwise
 * 
 * @example
 * isToday(new Date()) // true
 * isToday(new Date('2023-01-01')) // false
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Sorts tasks by completion status (incomplete first, completed last)
 * @param tasks - Array of tasks to sort
 * @returns Sorted array with incomplete tasks first
 * 
 * @example
 * const sorted = sortTasksByCompletion([completedTask, incompleteTask])
 * // Returns [incompleteTask, completedTask]
 */
export const sortTasksByCompletion = <T extends { completed: boolean }>(tasks: T[]): T[] => {
  return [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1; // Completed tasks go to bottom
  });
};

/**
 * Calculates the completion percentage for a list of tasks
 * @param tasks - Array of tasks to calculate percentage for
 * @returns Completion percentage as a number between 0 and 100
 * 
 * @example
 * calculateCompletionPercentage([{completed: true}, {completed: false}]) // 50
 */
export const calculateCompletionPercentage = (tasks: { completed: boolean }[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * truncateText("This is a long text", 10) // "This is a..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Validates if a hex color code is valid
 * @param color - The hex color string to validate
 * @returns True if valid hex color, false otherwise
 * 
 * @example
 * isValidHexColor("#FF0000") // true
 * isValidHexColor("invalid") // false
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Debounces a function call
 * @param func - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}; 