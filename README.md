# Task Manager App 📱

A comprehensive task management application built with React Native and Expo, featuring animated interactions, categorized tasks, gesture-based controls, and an intuitive user interface with dark/light theme support.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Expo CLI** (optional but recommended): `npm install -g expo-cli`
- **Development Environment**:
  - iOS Simulator (Xcode required for macOS)
  - Android Emulator (Android Studio required)
  - Or use Expo Go app on your physical device

### Installation & Setup

1. **Clone the repository**

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
   npm start
   # or
   npx expo start
   ```

4. **Run the app**

   After starting the development server, you'll see a QR code and options:

   - **iOS Simulator**: Press `i` (requires Xcode on macOS)
   - **Android Emulator**: Press `a` (requires Android Studio)
   - **Web Browser**: Press `w` for web development
   - **Physical Device**: Scan QR code with Expo Go app
   - **Development Build**: Press `d` to open developer menu

### Quick Start Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run ios        # iOS Simulator
npm run android    # Android Emulator
npm run web        # Web browser

# Code quality
npm run lint       # Run ESLint
```

## 📋 App Features

### 🎯 Core Task Management

- ✅ **Create Tasks**: Add tasks with titles, descriptions, due dates, priority levels, and subtasks
- ✅ **Task Completion**: Tap checkboxes to toggle completion with smooth animations
- ✅ **Smart Deletion**: Swipe left on tasks to delete with 5-second undo functionality
- ✅ **Category Organization**: Group tasks into color-coded categories with custom icons
- ✅ **Progress Tracking**: Visual progress bars and completion counters per category

### 🎨 Interactive Features & Gestures

- **👆 Tap to Edit**: Tap anywhere on a task to open detailed edit modal
- **✅ Checkbox Toggle**: Tap checkboxes to mark tasks complete/incomplete
- **👆 Long Press Delete**: Long-press task lists for deletion with confirmation
- **↩️ Swipe to Delete**: Swipe left on tasks for quick deletion
- **🔄 Undo Actions**: 5-second window to restore accidentally deleted tasks
- **� Haptic Feedback**: Tactile feedback for all interactions (iOS/Android)

### 🎨 Visual & User Experience

- **🌓 Adaptive Themes**: Automatic dark/light mode based on system preferences
- **✨ Smooth Animations**: Completed tasks smoothly animate to bottom of list
- **📊 Progress Visualization**: Real-time progress bars and completion statistics
- **🎯 Today's Focus**: Dedicated home screen for today's due tasks
- **📱 Responsive Design**: Optimized for phones, tablets, and web browsers
- **� Material Design**: Clean, modern interface following platform guidelines

### 🗂️ Advanced Organization

- **📂 Custom Categories**: Create unlimited categories with colors and icons
- **⭐ Priority Levels**: Set task priority (!, !!, !!!) with visual indicators
- **📅 Due Date Management**: Calendar integration for deadline tracking
- **📝 Subtasks**: Break down complex tasks into manageable subtasks
- **🔍 Smart Filtering**: Filter tasks by category, completion status, and due dates

## 📖 How to Use

### 🆕 First Launch Experience

- **Welcome Modal**: Interactive information modal explaining all app features and gestures
- **Guided Tour**: Step-by-step instructions for creating your first tasks and categories
- **Gesture Examples**: Visual demonstrations of tap, long-press, and swipe interactions

### 🏠 Home Screen - Today's Tasks

- **Today's Focus**: View all tasks due today in one place
- **Progress Overview**: See completion percentage and task statistics
- **Quick Actions**:
  - Tap task content → Edit task details
  - Tap checkbox → Toggle completion
  - Long-press → Delete with undo option
- **Smart Sorting**: Incomplete tasks at top, completed tasks move to bottom

### 📋 Lists Screen - Full Task Management

- **Category Creation**: Add new lists with custom colors and icons
- **Task Management**: Create, edit, and organize tasks within categories
- **Category Actions**:
  - Tap category header → Expand/collapse tasks
  - Long-press category → Delete entire category
- **Batch Operations**: Manage multiple tasks efficiently

### ➕ Adding Tasks (Step-by-Step)

1. **Navigate** to the **Lists** tab
2. **Create or Select** a category:
   - Tap "+ Create new List" to create new category
   - Choose color and icon
   - Or select existing category
3. **Add Task** by tapping the "Add Task" button
4. **Fill Task Details**:
   - **Title** (required): Brief task description
   - **Description** (optional): Detailed notes
   - **Due Date**: Calendar picker for deadlines
   - **Priority**: Choose !, !!, or !!! urgency level
   - **Subtasks** (optional): Break down complex tasks
5. **Save** by tapping "Create Task"

### 🎯 Task Interaction Guide

| Action                  | Gesture                | Result                            |
| ----------------------- | ---------------------- | --------------------------------- |
| **Edit Task**           | Tap task content       | Opens edit modal with all details |
| **Complete/Uncomplete** | Tap checkbox (✓)       | Toggles completion with animation |
| **Quick Delete**        | Long-press task list   | Shows delete confirmation         |
| **Swipe Delete**        | Swipe left on task     | Immediate deletion with undo      |
| **Undo Delete**         | Tap "Undo" in snackbar | Restores task within 5 seconds    |

### 💡 Pro Tips

- **Bulk Task Creation**: Use subtasks to quickly add related items
- **Priority System**: Use !!! for urgent, !! for important, ! for normal tasks
- **Due Date Strategy**: Set realistic deadlines to maintain motivation
- **Category Colors**: Use consistent color schemes for different life areas
- **Daily Review**: Check Home screen each morning for today's due tasks

## 🛠 Third-Party Libraries

### 🏗️ Core Framework & Development

- **React Native** (0.79.5): Cross-platform mobile development framework for iOS/Android
- **Expo SDK** (~53.0.20): Complete development platform with build tools, API access, and deployment
- **TypeScript** (~5.8.3): Type-safe JavaScript providing better code quality and developer experience
- **ESLint** (^9.25.0): Code linting and formatting for consistent code style

### 🧭 Navigation & Routing

- **Expo Router** (~5.1.4): File-based routing system providing seamless navigation
- **@react-navigation/native** (^7.1.6): Core navigation library for screen transitions
- **@react-navigation/bottom-tabs** (^7.3.10): Bottom tab navigation component for main app structure

### 🎨 UI Components & Styling

- **react-native-paper** (^5.14.5): Material Design component library for consistent UI
- **expo-symbols** (~0.4.5): System symbol icons providing native iOS/Android icons
- **@expo/vector-icons** (^14.1.0): Comprehensive icon library (Ionicons, MaterialIcons, etc.)
- **react-native-safe-area-context** (5.4.0): Safe area handling for notches and rounded screens

### ✨ Animations & Gestures

- **react-native-reanimated** (~3.17.4): High-performance 60fps animations for smooth transitions
- **react-native-gesture-handler** (~2.24.0): Native gesture recognition for swipe/pan interactions
- **expo-haptics** (~14.1.4): Tactile feedback providing natural interaction feel

### 📱 Platform Integration

- **@react-native-community/datetimepicker** (^8.4.3): Native date/time picker with platform-specific UI
- **expo-constants** (~17.1.7): Access to device/app constants and configuration
- **expo-font** (~13.3.2): Custom font loading for typography consistency
- **expo-status-bar** (~2.2.3): Status bar customization for immersive experience

### 🔧 Development & Build Tools

- **expo-splash-screen** (~0.30.10): Customizable splash screen during app loading
- **expo-system-ui** (~5.0.10): System UI controls for navigation bars and status bars
- **@babel/core** (^7.25.2): JavaScript transpiler for modern syntax support

### 📦 Data & Storage

- **@react-native-async-storage/async-storage** (^2.2.0): Persistent local storage for app data
- **react-native-screens** (~4.11.1): Native screen components for performance optimization

### 🎯 Purpose in Project

- **Navigation**: Expo Router provides seamless tab navigation between Home and Lists screens
- **Gestures**: Enable swipe-to-delete, long-press interactions, and smooth task animations
- **UI Consistency**: Material Design components ensure polished, platform-appropriate interface
- **Performance**: Reanimated and native gestures provide 60fps smooth interactions
- **Accessibility**: Safe area context and haptic feedback improve user experience
- **Development**: TypeScript and ESLint maintain code quality and catch errors early

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

## ⚠️ Important Notes & Special Instructions

### 💾 Data Persistence

- **In-Memory Storage**: All tasks and categories are stored in React state (memory only)
- **App Restart**: Data resets when the app is closed and reopened
- **Development Feature**: This is intentional for demonstration - no permanent data storage
- **Future Enhancement**: Consider adding AsyncStorage or database integration for persistence

### 📱 Platform-Specific Features

- **iOS**:
  - Haptic feedback on supported devices
  - Native iOS date picker interface
  - SF Symbols icons for system consistency
- **Android**:
  - Material Design haptic patterns
  - Android-native date picker
  - Material Icons for platform consistency
- **Web**:
  - Touch/click interactions
  - Responsive layout for desktop/tablet
  - Limited haptic feedback (browser dependent)

### 🔧 Development Considerations

- **Hot Reload**: Changes to code trigger automatic app refresh
- **State Reset**: App state resets on every hot reload during development
- **Expo Go**: Use for quick testing; some features may differ from production builds
- **Testing Data**: Create sample tasks/categories to test features during development

### 🎯 Performance Notes

- **Smooth Animations**: All animations run at 60fps using native threads
- **Memory Management**: Large task lists are efficiently rendered using FlatList
- **Gesture Responsiveness**: Native gesture handling provides immediate feedback

## 🔧 Development

### 📱 Available Scripts

```bash
npm start          # Start Expo development server with QR code
npm run android    # Launch on Android emulator/device
npm run ios        # Launch on iOS simulator (macOS only)
npm run web        # Launch in web browser
npm run lint       # Run ESLint for code quality checks
npm run reset-project  # Reset to clean Expo template (development tool)
```

### 🛠️ Development Features

- **🔥 Hot Reloading**: Instant code changes without losing app state
- **🔍 TypeScript**: Full type safety with IntelliSense and error detection
- **🗂️ File-Based Routing**: Automatic route generation from file structure
- **🎨 Theme System**: Automatic dark/light mode with custom color schemes
- **📱 Cross-Platform**: Single codebase for iOS, Android, and Web
- **🎯 Component Architecture**: Modular, reusable components with props validation

### 🏗️ Architecture Overview

```
Architecture Pattern: Feature-Based + Atomic Design
├── State Management: React Context + Hooks
├── UI System: Theme-aware components
├── Gesture System: Native gesture handlers
├── Navigation: File-based routing (Expo Router)
└── Type Safety: Full TypeScript coverage
```

### 🎯 State Management

- **TaskContext**: Centralized task state with CRUD operations
- **Theme Context**: Automatic light/dark mode management
- **Local State**: Component-specific state using React hooks
- **No External Storage**: Memory-only storage (intentional for demo)

### 🧪 Testing & Quality

- **ESLint**: Automatic code linting with Expo configuration
- **TypeScript**: Compile-time type checking and validation
- **React DevTools**: Component inspection and state debugging
- **Expo DevTools**: Network inspection and performance monitoring

## 🧪 Testing & Quality

- **ESLint**: Automatic code linting with Expo configuration
- **TypeScript**: Compile-time type checking and validation
- **React DevTools**: Component inspection and state debugging
- **Expo DevTools**: Network inspection and performance monitoring

## � Troubleshooting

### Common Issues

**App won't start:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start --clear
```

**iOS Simulator issues:**

- Ensure Xcode is installed and updated
- Check iOS Simulator is running
- Try: `npm run ios --reset-cache`

**Android Emulator issues:**

- Verify Android Studio and emulator setup
- Enable Developer Options on device
- Try: `npm run android --reset-cache`

**TypeScript errors:**

- Run: `npm run lint` to check for issues
- Ensure all dependencies are installed
- Check `tsconfig.json` paths configuration

### Performance Tips

- Use physical device for best performance testing
- Avoid deeply nested component structures
- Implement proper key props for list items
- Use React.memo() for expensive components

## �📚 Code Quality & Documentation

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

- **Material Design**: Using React Native Paper components for consistent UI
- **Platform Adaptive**: Automatically adapts to iOS/Android design guidelines
- **Accessibility**: Proper labeling and interaction patterns for screen readers
- **Performance**: Optimized animations and list rendering for 60fps experience
- **Responsive**: Works seamlessly across phones, tablets, and web browsers
- **User-Centric**: Intuitive gestures and visual feedback for natural interactions

## 🚀 Future Enhancements

### Potential Features

- **🗄️ Data Persistence**: AsyncStorage or SQLite integration
- **☁️ Cloud Sync**: Firebase or custom backend synchronization
- **📊 Analytics**: Task completion tracking and productivity insights
- **🔔 Notifications**: Due date reminders and task alerts
- **👥 Collaboration**: Shared lists and team task management
- **📱 Widgets**: Home screen widgets for quick task overview
- **🎨 Customization**: More themes, colors, and layout options

---

Built with ❤️ using React Native and Expo

**Version**: 1.0.0  
**Platform Support**: iOS 11+, Android 6+, Web Browsers  
**Development**: React Native 0.79.5, Expo SDK 53
