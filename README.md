# Task Manager App 📱

A comprehensive task management application built with React Native and Expo, featuring animated interactions, categorized tasks, and an intuitive user interface.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional but recommended)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation & Setup

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd chapter-one-oa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run the app**

   In the terminal output, you'll see options to open the app:

   - Press `i` to open in iOS Simulator
   - Press `a` to open in Android Emulator
   - Press `w` to open in web browser
   - Scan the QR code with Expo Go app on your device

## 📋 App Features

### Core Functionality

- ✅ **Add Tasks**: Create new tasks with titles, descriptions, due dates, and priorities
- ✅ **Mark Complete**: Tap tasks to toggle completion status with visual feedback
- ✅ **Delete Tasks**: Long-press tasks to delete with confirmation and undo option
- ✅ **Task Lists**: View all tasks organized by categories with progress tracking

### Advanced Features

- 🎨 **Animated Interactions**: Smooth animations when completing tasks (they move to bottom)
- 📂 **Category Management**: Organize tasks into custom colored categories with icons
- 📊 **Progress Tracking**: Visual progress bars and completion counters
- 🌓 **Theme Support**: Automatic dark/light mode support
- ⏰ **Due Date Management**: Set and track task due dates
- 🔄 **Undo Functionality**: 5-second window to undo task deletions
- 📱 **Responsive Design**: Works on phones, tablets, and web

## 📖 How to Use

### Home Screen

- View today's tasks in chronological order
- See overall progress with visual indicators
- Tap any task to mark it complete/incomplete
- Long-press any task to delete it

### Lists Screen

- Create new category lists with custom colors and icons
- Add tasks to specific categories
- Collapse/expand categories for better organization
- Track progress within each category

### Adding Tasks

1. Go to the **Lists** tab
2. Create a new list or select an existing category
3. Tap the **"Add Task"** button
4. Fill in task details:
   - Task name (required)
   - Description (optional)
   - Due date
   - Priority level (!, !!, !!!)
   - Subtasks (optional)
5. Tap **"Create"** to save

### Task Interactions

- **Tap**: Toggle completion status
- **Long Press**: Delete task (with confirmation)
- **Undo**: Use the snackbar that appears after deletion

## 🛠 Third-Party Libraries

### Core Framework

- **React Native** (0.79.5): Cross-platform mobile development framework
- **Expo SDK** (~53.0.20): Development platform and tools for React Native

### Navigation & Routing

- **@react-navigation/native** (^7.1.6): Navigation library for screen transitions
- **@react-navigation/bottom-tabs** (^7.3.10): Bottom tab navigation component
- **expo-router** (~5.1.4): File-based routing system for Expo apps

### UI Components & Styling

- **react-native-paper** (^5.14.5): Material Design component library
- **expo-symbols** (~0.4.5): System symbol icons for iOS and Android
- **@expo/vector-icons** (^14.1.0): Icon library with multiple icon sets
- **react-native-safe-area-context** (5.4.0): Safe area handling for different devices

### Animations

- **react-native-reanimated** (~3.17.4): High-performance animations and gestures
- **react-native-gesture-handler** (~2.24.0): Native gesture recognition

### Form Components

- **@react-native-community/datetimepicker** (^8.4.3): Native date and time picker

### Development Tools

- **TypeScript** (~5.8.3): Type-safe JavaScript development
- **ESLint** (^9.25.0): Code linting and formatting

### Platform Integration

- **expo-haptics** (~14.1.4): Haptic feedback for user interactions
- **expo-font** (~13.3.2): Custom font loading
- **expo-constants** (~17.1.7): Access to system constants and app config

## 🏗 Project Structure

```
chapter-one-oa/
├── app/                         # Expo Router screens (main navigation)
│   ├── (tabs)/                 # Tab-based navigation screens
│   │   ├── index.tsx           # Home screen (today's tasks)
│   │   ├── lists.tsx           # Lists screen (categories & task creation)
│   │   └── _layout.tsx         # Tab layout configuration
│   └── _layout.tsx             # Root layout with providers
├── src/                        # Source code (organized by feature/type)
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Pure UI components (buttons, modals, etc.)
│   │   │   └── Snackbar.tsx    # Notification component
│   │   ├── common/             # Common components used across features
│   │   │   ├── ThemedText.tsx  # Theme-aware text component
│   │   │   └── ThemedView.tsx  # Theme-aware view component
│   │   └── features/           # Feature-specific components
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # All app interfaces and types
│   └── utils/                  # Utility functions and helpers
│       └── index.ts            # Common utility functions
├── components/                 # Legacy UI components (being phased out)
│   ├── ui/                     # UI-specific components
│   └── *.tsx                   # Various utility components
├── contexts/                   # React Context providers
│   └── TaskContext.tsx         # Global task state management
├── hooks/                      # Custom React hooks
│   ├── useColorScheme.ts       # Color scheme detection
│   ├── useColorScheme.web.ts   # Web-specific color scheme
│   └── useThemeColor.ts        # Theme color utilities
├── constants/                  # App constants and themes
│   └── Colors.ts               # Color definitions
├── assets/                     # Static assets
│   ├── images/                 # App images and icons
│   └── fonts/                  # Custom fonts
└── scripts/                    # Build and utility scripts
    └── reset-project.js        # Project reset utility
```

### Code Organization Principles

- **Feature-based organization**: Components are grouped by feature or functionality
- **Type safety**: All TypeScript interfaces centralized in `src/types/`
- **Utility functions**: Common helpers extracted to `src/utils/`
- **Theme consistency**: Themed components in `src/components/common/`
- **Clear separation**: UI components separate from business logic
- **Documentation**: Comprehensive JSDoc comments throughout codebase

## 🎯 State Management

The app uses React Context for state management:

- **TaskContext**: Manages all task-related state and operations
- **Local State**: Component-specific state using React hooks
- **No External Storage**: All data is stored in memory (resets on app restart)

## 🔧 Development

### Available Scripts

- `npm start`: Start Expo development server
- `npm run android`: Start on Android emulator
- `npm run ios`: Start on iOS simulator
- `npm run web`: Start on web browser
- `npm run lint`: Run ESLint for code quality

### Key Development Features

- Hot reloading for instant feedback
- TypeScript for type safety
- File-based routing with Expo Router
- Custom themed components for consistent styling
- Haptic feedback for enhanced user experience

## 📚 Code Quality & Documentation

### Documentation Standards

- **JSDoc Comments**: All functions, components, and interfaces have comprehensive JSDoc documentation
- **Inline Comments**: Complex logic explained with clear inline comments
- **Type Definitions**: Centralized TypeScript interfaces with detailed property descriptions
- **Usage Examples**: Code examples provided in JSDoc comments for better understanding

### Code Organization Standards

- **Industry Best Practices**: Follows React Native and mobile development industry standards
- **Separation of Concerns**: Clear separation between UI, business logic, and utilities
- **Consistent Naming**: Descriptive function and variable names following camelCase convention
- **Error Handling**: Proper error handling with user-friendly feedback
- **Performance**: Optimized components with proper memoization and lazy loading

### File Structure Benefits

- **Scalability**: Easy to add new features without restructuring
- **Maintainability**: Clear organization makes code easy to find and modify
- **Team Collaboration**: Standardized structure helps multiple developers work together
- **Code Reusability**: Components and utilities designed for maximum reuse

## 🎨 Design Principles

- **Material Design**: Using React Native Paper components
- **Platform Adaptive**: Automatically adapts to iOS/Android design guidelines
- **Accessibility**: Proper labeling and interaction patterns
- **Performance**: Optimized animations and list rendering
- **Responsive**: Works across different screen sizes

---

Built with ❤️ using React Native and Expo
