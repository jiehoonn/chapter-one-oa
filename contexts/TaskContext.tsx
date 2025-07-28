import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Priority = '!!!' | '!!' | '!';

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  category: string;
  priority?: Priority;
  subtasks?: Subtask[];
}

export interface CategoryList {
  category: string;
  tasks: Task[];
  color: string;
  icon: string;
}

interface DeletedTask {
  task: Task;
  categoryName: string;
  timeoutId: number;
}

interface TaskContextType {
  categoryLists: CategoryList[];
  addCategoryList: (categoryList: CategoryList) => void;
  addTask: (task: Task) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => Promise<boolean>;
  restoreTask: (taskId: string) => void;
  getTasksDueToday: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [categoryLists, setCategoryLists] = useState<CategoryList[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Map<string, DeletedTask>>(new Map());

  const addCategoryList = (categoryList: CategoryList) => {
    setCategoryLists(prev => [...prev, categoryList]);
  };

  const addTask = (task: Task) => {
    setCategoryLists(prev =>
      prev.map(categoryList =>
        categoryList.category === task.category
          ? { ...categoryList, tasks: [...categoryList.tasks, task] }
          : categoryList
      )
    );
  };

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

  const deleteTask = (taskId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let deletedTask: Task | null = null;
      let categoryName = '';

      // Remove task from categoryLists and store it temporarily
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
        // Set up auto-delete after 5 seconds
        const timeoutId = setTimeout(() => {
          setDeletedTasks(prev => {
            const newMap = new Map(prev);
            newMap.delete(taskId);
            return newMap;
          });
          resolve(true); // Task permanently deleted
        }, 5000);

        // Store in deleted tasks for potential restoration
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

      // Remove from deleted tasks
      setDeletedTasks(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });
    }
  };

  const getTasksDueToday = () => {
    const today = new Date();
    const todayString = today.toDateString();
    
    const allTasks = categoryLists.flatMap(categoryList => categoryList.tasks);
    return allTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === todayString;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        categoryLists,
        addCategoryList,
        addTask,
        toggleTaskCompletion,
        deleteTask,
        restoreTask,
        getTasksDueToday,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
} 