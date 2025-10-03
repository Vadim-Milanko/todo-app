# Task Board - React Todo Application

A modern, responsive todo list application built with React, TypeScript, and Vite. Features a kanban-style board with drag-and-drop functionality, task management, and advanced filtering capabilities.

## 🚀 Live Demo

**[View Live Application](https://todo-app-lac-phi.vercel.app/)**

Experience the full functionality of the Task Board application deployed on Vercel.

## ✨ Features

### Core Functionality
- ✅ **Add/Remove Tasks** - Create and delete tasks with ease
- ✅ **Mark Complete/Incomplete** - Toggle task completion status
- ✅ **Task Filtering** - Filter by all, completed, or incomplete tasks
- ✅ **Search Tasks** - Search tasks by name with highlighting
- ✅ **Persistent Storage** - Data saved to localStorage

### Column Management
- ✅ **Add/Delete Columns** - Create custom columns and remove them
- ✅ **Edit Column Titles** - Click column titles to rename them
- ✅ **Drag & Drop Tasks** - Move tasks between columns with drag and drop

### Task Operations
- ✅ **Inline Task Editing** - Double-click tasks to edit text
- ✅ **Multi-Select Tasks** - Select multiple tasks for bulk operations
- ✅ **Select All** - Select/deselect all tasks in a column
- ✅ **Bulk Operations** - Delete, complete, or move multiple tasks at once

### UI/UX
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Modern Interface** - Clean, beige color scheme with intuitive design
- ✅ **Search Highlighting** - Highlights matching text in search results
- ✅ **Visual Feedback** - Hover states, animations, and drag indicators

## 🛠 Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Scoped styling
- **@atlaskit/pragmatic-drag-and-drop** - Drag and drop functionality

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Vadim-Milanko/todo-app>
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The application will hot-reload as you make changes

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎯 Usage Guide

### Basic Operations

1. **Adding Tasks**
   - Click "+ Add Task" in any column
   - Type your task and press Enter or click "Add Task"

2. **Managing Tasks**
   - **Complete**: Use the "Complete" toggle in each task
   - **Edit**: Double-click task text to edit inline
   - **Delete**: Click the × button
   - **Select**: Use the "Select" checkbox for multi-select
   - **Move**: Drag and drop tasks between columns

3. **Column Management**
   - **Add Column**: Click "+ Add Column" button
   - **Edit Title**: Click column title to rename
   - **Delete Column**: Click × in column header (confirms before deletion)

4. **Bulk Operations**
   - Select multiple tasks using checkboxes
   - Use "Select All" to select all tasks in a column
   - Bulk actions appear when tasks are selected:
     - Mark as Complete/Incomplete
     - Delete selected tasks
     - Move to another column

5. **Search & Filter**
   - Use search bar to find tasks by name
   - Filter by All, Active, or Completed tasks
   - Search terms are highlighted in results

### Keyboard Shortcuts

- **Enter**: Confirm task/column creation or editing
- **Escape**: Cancel task/column editing
- **Double-click**: Edit task text
- **Drag & Drop**: Click and drag tasks to move between columns

## 🏗 Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── AddColumnForm/   # Column creation form
│   ├── AddTaskForm/     # Task creation form
│   ├── Board/           # Main board container
│   ├── Column/          # Column with tasks and drop zones
│   ├── SearchAndFilter/ # Search and filter controls
│   └── TaskCard/        # Individual draggable task component
├── hooks/               # Custom React hooks
│   └── useDragAndDrop.ts # Drag and drop functionality hooks
├── pages/               # Page components
│   └── BoardPage/       # Main application page
├── services/            # Business logic
│   └── StorageService.ts # localStorage operations with documentation
├── types/               # TypeScript definitions
│   └── index.ts         # Application type definitions
└── utils/               # Utility functions
    └── date.ts          # Date formatting utilities
```

### Key Design Patterns

- **Component Composition** - Small, focused components with single responsibilities
- **Custom Hooks** - Reusable logic for drag & drop functionality
- **Props Drilling** - Simple state management appropriate for application scope
- **CSS Modules** - Scoped styling to prevent conflicts
- **TypeScript Interfaces** - Strong typing for better developer experience
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Drag & Drop Integration** - Pragmatic drag-and-drop for intuitive interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Built with ❤️ using React, TypeScript, and modern web technologies**
