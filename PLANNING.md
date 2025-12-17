# Rize-Like Productivity Tracker - Planning Document

## Table of Contents
1. [Rize Analysis](#rize-analysis)
2. [Project Scope](#project-scope)
3. [Feature Specification](#feature-specification)
4. [Technical Architecture](#technical-architecture)
5. [Data Models](#data-models)
6. [UI/UX Design](#uiux-design)
7. [Implementation Plan](#implementation-plan)

---

## Rize Analysis

### What is Rize?
Rize is an AI-powered time tracking and productivity application designed for knowledge workers. It helps users understand how they spend their time, maintain focus, and build better work habits.

### Core Rize Features

| Feature | Description | Include in Our App? |
|---------|-------------|---------------------|
| **Automatic Time Tracking** | Tracks time spent in apps/websites/documents automatically | No (excluded per requirements) |
| **Activity Data** | Records which websites/apps were used | No (excluded per requirements) |
| **Focus Sessions** | Timed deep work sessions with distraction blocking | Yes |
| **Focus Timer** | Pomodoro-style timer with customizable durations | Yes |
| **Break Reminders** | Notifications to take breaks | Yes |
| **Daily Dashboard** | Overview of daily productivity metrics | Yes |
| **Weekly Reports** | Summary of weekly productivity patterns | Yes |
| **Focus Score** | Numerical score rating productivity/focus quality | Yes |
| **Categories/Projects** | Organize work into categories and projects | Yes |
| **Goals** | Set daily/weekly focus time goals | Yes |
| **Session Notes** | Add notes to work sessions | Yes |
| **Calendar View** | View sessions on a calendar | Yes |
| **Analytics & Charts** | Visual representation of productivity data | Yes |
| **Streaks** | Track consecutive days of meeting goals | Yes |
| **Meeting Detection** | Auto-detect calendar meetings | No (requires integration) |

### Rize UI/UX Characteristics
- **Clean, minimal design** with lots of white space
- **Blue accent color** (#4475f3 similar to existing)
- **Card-based layouts** for different sections
- **Sidebar navigation** for main sections
- **Dark mode support**
- **Smooth animations and transitions**
- **Data visualizations** using charts and graphs

---

## Project Scope

### What We're Building
A **manual time tracking productivity app** inspired by Rize that allows users to:
1. Track focused work sessions manually (start/stop timer)
2. Categorize work into projects/categories
3. View productivity analytics and insights
4. Set and track daily/weekly goals
5. Review historical data via dashboard and reports

### What We're NOT Building
- Automatic time tracking (no background monitoring)
- App/website activity detection
- Screen capture or activity screenshots
- Meeting auto-detection
- Browser extensions or desktop agents

### Target Users
- Remote workers who want to track their productivity
- Freelancers tracking billable hours
- Students managing study sessions
- Anyone wanting to improve their focus habits

---

## Feature Specification

### 1. Focus Timer (Enhanced from Current)
- **Customizable timer durations** (15, 25, 45, 60+ minutes)
- **Focus session modes**: Deep Work, Shallow Work, Meeting, Break
- **Session completion animations**
- **Audio notifications** (optional)
- **Session notes** - add context to what you worked on
- **Category/Project tagging** for sessions

### 2. Dashboard
- **Today's Summary Card**
  - Total focus time today
  - Sessions completed
  - Current streak
  - Daily goal progress (circular progress)
- **Focus Score Card**
  - Score 0-100 based on:
    - Sessions completed vs planned
    - Average session length
    - Goal achievement
    - Streak maintenance
- **Recent Sessions List**
  - Last 5-10 sessions with quick stats
- **Quick Start Buttons**
  - Start common session types quickly

### 3. Analytics/Reports Page
- **Time Period Selector**: Today, This Week, This Month, Custom Range
- **Charts**:
  - Daily focus time (bar chart)
  - Category breakdown (pie/donut chart)
  - Weekly trends (line chart)
  - Hour-by-hour heatmap (when you're most productive)
- **Statistics**:
  - Total focus time
  - Average session length
  - Longest session
  - Most productive day
  - Category distribution

### 4. Projects/Categories
- **Create custom categories** (e.g., "Coding", "Writing", "Research", "Admin")
- **Color coding** for categories
- **Default categories** provided
- **Category-specific stats**
- **Archive/delete categories**

### 5. Goals System
- **Daily focus time goal** (e.g., 4 hours/day)
- **Weekly focus time goal** (e.g., 20 hours/week)
- **Session count goals** (e.g., 8 pomodoros/day)
- **Goal progress visualization**
- **Goal achievement history**

### 6. Calendar View
- **Monthly calendar** showing sessions per day
- **Day detail view** with session list
- **Color intensity** based on focus time (heatmap style)
- **Navigate between months**

### 7. Settings
- **Timer defaults** (work duration, break duration)
- **Notification preferences**
- **Theme** (light/dark mode)
- **Goal configurations**
- **Category management**
- **Data export** (CSV/JSON)
- **Account management**

### 8. Streaks & Achievements
- **Daily streak counter** (consecutive days meeting goal)
- **Milestone achievements** (10 hours, 100 hours, etc.)
- **Weekly perfect score badges**

---

## Technical Architecture

### Stack
- **Frontend**: Vanilla JavaScript (existing) → Could migrate to React/Vue later
- **Styling**: CSS with CSS Variables for theming
- **Build Tool**: Vite (existing)
- **Backend/Database**: Firebase
  - Authentication (existing Google Auth)
  - Firestore for data storage
  - Cloud Functions (optional for analytics calculations)
- **Charts**: Chart.js or lightweight alternative

### File Structure (Proposed)
```
src/
├── index.html              # Main HTML (SPA shell)
├── styles/
│   ├── main.css           # Global styles, variables
│   ├── components.css     # Reusable component styles
│   ├── dashboard.css      # Dashboard specific
│   ├── timer.css          # Timer specific
│   ├── analytics.css      # Analytics specific
│   └── calendar.css       # Calendar specific
├── js/
│   ├── app.js             # Main app entry, routing
│   ├── auth.js            # Authentication logic
│   ├── firebase.js        # Firebase config (existing)
│   ├── store.js           # State management
│   ├── router.js          # Simple client-side routing
│   ├── components/
│   │   ├── timer.js       # Focus timer component
│   │   ├── dashboard.js   # Dashboard component
│   │   ├── analytics.js   # Analytics/reports component
│   │   ├── calendar.js    # Calendar view component
│   │   ├── settings.js    # Settings component
│   │   ├── sidebar.js     # Navigation sidebar
│   │   └── charts.js      # Chart utilities
│   ├── services/
│   │   ├── sessions.js    # Session CRUD operations
│   │   ├── categories.js  # Category management
│   │   ├── goals.js       # Goals management
│   │   └── analytics.js   # Analytics calculations
│   └── utils/
│       ├── date.js        # Date formatting utilities
│       ├── format.js      # Number/time formatting
│       └── notifications.js # Browser notifications
├── assets/
│   ├── icons/             # SVG icons
│   └── sounds/            # Notification sounds
└── service-worker.js      # PWA support (existing)
```

### State Management
Simple store pattern for managing:
- Current user
- Active session
- Categories
- Goals
- UI state (current view, theme, etc.)

---

## Data Models

### Firestore Collections

#### `users/{userId}`
```javascript
{
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  settings: {
    defaultWorkDuration: number,    // minutes
    defaultBreakDuration: number,   // minutes
    dailyGoalMinutes: number,
    weeklyGoalMinutes: number,
    theme: 'light' | 'dark' | 'system',
    notifications: boolean,
    soundEnabled: boolean
  },
  streak: {
    current: number,
    longest: number,
    lastActiveDate: string         // YYYY-MM-DD
  }
}
```

#### `users/{userId}/sessions/{sessionId}`
```javascript
{
  startTime: timestamp,
  endTime: timestamp,
  duration: number,               // seconds
  plannedDuration: number,        // seconds
  type: 'focus' | 'break',
  mode: 'deep-work' | 'shallow-work' | 'meeting' | 'break',
  categoryId: string | null,
  projectId: string | null,
  notes: string,
  completed: boolean,             // finished vs abandoned
  createdAt: timestamp
}
```

#### `users/{userId}/categories/{categoryId}`
```javascript
{
  name: string,
  color: string,                  // hex color
  icon: string,                   // icon identifier
  isDefault: boolean,
  isArchived: boolean,
  createdAt: timestamp,
  order: number                   // for sorting
}
```

#### `users/{userId}/goals/{goalId}`
```javascript
{
  type: 'daily' | 'weekly',
  targetMinutes: number,
  isActive: boolean,
  createdAt: timestamp
}
```

#### `users/{userId}/dailyStats/{date}` (YYYY-MM-DD)
```javascript
{
  date: string,
  totalFocusTime: number,         // seconds
  sessionCount: number,
  goalMet: boolean,
  focusScore: number,             // 0-100
  categoryBreakdown: {
    [categoryId]: number          // seconds per category
  }
}
```

---

## UI/UX Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo, Search, Profile Avatar, Settings Icon        │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │  Main Content Area                               │
│          │                                                  │
│ - Timer  │  (Dashboard / Analytics / Calendar / Settings)   │
│ - Dash   │                                                  │
│ - Stats  │                                                  │
│ - Cal    │                                                  │
│ - Goals  │                                                  │
│          │                                                  │
│          │                                                  │
│          │                                                  │
│──────────│                                                  │
│ User     │                                                  │
│ Info     │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Page Wireframes

#### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Good morning, [Name]! 👋                    [Quick Start ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Focus Time   │  │ Focus Score  │  │ Streak       │      │
│  │    4h 32m    │  │     78       │  │  🔥 12 days  │      │
│  │ ████████░░   │  │   ◯◯◯◯       │  │              │      │
│  │ Goal: 6h     │  │  Good!       │  │ Best: 24     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Active Timer                              [Expand]  │   │
│  │         25:00          Category: Coding             │   │
│  │     [Start Focus]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Today's Sessions                                    │   │
│  │ ├─ 09:00 - 09:45  Coding        Deep Work    45m   │   │
│  │ ├─ 10:00 - 10:25  Research      Shallow      25m   │   │
│  │ └─ 11:30 - 12:15  Writing       Deep Work    45m   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Timer (Full Screen Mode)
```
┌─────────────────────────────────────────────────────────────┐
│                                              [Minimize]  ✕  │
│                                                             │
│                        Deep Work                            │
│                                                             │
│                        25:00                                │
│                                                             │
│              [-5m]            [+5m]                         │
│                                                             │
│                    [  Start  ]                              │
│                                                             │
│         [Reset]    [Break Mode]    [Finish]                 │
│                                                             │
│  Category: [Coding ▼]     Project: [Website Redesign ▼]    │
│                                                             │
│  Notes: ________________________________________________   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Analytics
```
┌─────────────────────────────────────────────────────────────┐
│ Analytics         [Today] [Week] [Month] [Custom]           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Focus Time This Week                                │   │
│  │  8h│     ██                                         │   │
│  │  6h│ ██  ██      ██                                 │   │
│  │  4h│ ██  ██  ██  ██  ██                             │   │
│  │  2h│ ██  ██  ██  ██  ██  ██                         │   │
│  │    └─Mon─Tue─Wed─Thu─Fri─Sat─Sun─                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │ Category Breakdown   │  │ Key Stats               │   │
│  │      ┌───┐           │  │                         │   │
│  │     /     \          │  │ Total: 32h 15m          │   │
│  │    │Coding │         │  │ Avg/day: 4h 36m         │   │
│  │     \ 45% /          │  │ Sessions: 42            │   │
│  │      └───┘           │  │ Avg session: 46m        │   │
│  │ ■ Coding  ■ Writing  │  │ Best day: Tuesday       │   │
│  │ ■ Research ■ Admin   │  │                         │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Color Palette
```css
/* Primary */
--color-primary: #4475f3;
--color-primary-dark: #3461d9;
--color-primary-light: #6b93f7;

/* Backgrounds */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f8fafc;
--color-bg-tertiary: #f1f5f9;

/* Text */
--color-text-primary: #1e293b;
--color-text-secondary: #64748b;
--color-text-muted: #94a3b8;

/* Status */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* Categories (defaults) */
--color-category-coding: #6366f1;
--color-category-writing: #8b5cf6;
--color-category-research: #06b6d4;
--color-category-meeting: #f59e0b;
--color-category-admin: #64748b;
```

---

## Implementation Plan

### Phase 1: Foundation & Core Timer (Priority: High)
1. **Restructure project files** - Organize into proper folder structure
2. **Create app shell** - Sidebar navigation, routing, layout
3. **Enhanced timer component** - Add session modes, notes, category selection
4. **Basic category system** - Default categories, selection UI
5. **Update session data model** - Include new fields (category, notes, mode)

### Phase 2: Dashboard (Priority: High)
1. **Dashboard layout** - Cards, stats display
2. **Today's summary** - Total time, sessions, goal progress
3. **Recent sessions list** - Show today's sessions
4. **Quick start buttons** - Start common session types
5. **Focus score calculation** - Basic scoring algorithm

### Phase 3: Goals & Streaks (Priority: Medium)
1. **Goal setting UI** - Daily/weekly goal configuration
2. **Goal progress tracking** - Store and display progress
3. **Streak system** - Track consecutive days
4. **Goal achievement notifications**

### Phase 4: Analytics (Priority: Medium)
1. **Add Chart.js** - Install and configure
2. **Time period selector** - Today/week/month/custom
3. **Bar chart** - Daily focus time
4. **Pie chart** - Category breakdown
5. **Stats calculations** - Averages, totals, trends
6. **Daily stats aggregation** - Store computed daily stats

### Phase 5: Calendar View (Priority: Medium)
1. **Monthly calendar grid** - Display sessions per day
2. **Day detail modal** - Show sessions for selected day
3. **Heatmap coloring** - Intensity based on focus time
4. **Month navigation**

### Phase 6: Settings & Polish (Priority: Lower)
1. **Settings page** - All user preferences
2. **Dark mode** - Theme toggle
3. **Notifications** - Browser notification API
4. **Sound effects** - Timer completion sounds
5. **Data export** - CSV/JSON export
6. **Mobile responsiveness** - Full mobile support
7. **PWA enhancements** - Offline support, install prompt

### Phase 7: Advanced Features (Priority: Lower)
1. **Projects** - Nested under categories
2. **Tags** - Flexible session tagging
3. **Achievements/badges** - Gamification elements
4. **Weekly email reports** - Firebase Functions (optional)

---

## Migration Strategy (From Current Code)

### Files to Keep/Modify
- `firebase.js` - Keep as-is
- `vite.config.js` - Keep as-is
- `package.json` - Add new dependencies

### Files to Replace
- `index.html` - New SPA shell with sidebar
- `script.js` - Split into modular components
- `styles.css` - Replace with organized CSS files

### Data Migration
- Existing `sessions` collection is compatible
- Add new fields with defaults for existing sessions
- Create `users` document on first load with defaults

---

## Dependencies to Add

```json
{
  "dependencies": {
    "chart.js": "^4.4.0"
  }
}
```

---

## Success Metrics

1. **Functionality**: All core features working
2. **Performance**: < 2s initial load, smooth 60fps animations
3. **Usability**: Intuitive navigation, clear data visualization
4. **Reliability**: No data loss, proper error handling
5. **Visual Quality**: Clean, professional appearance matching Rize aesthetic

---

## Notes & Considerations

1. **Privacy First**: No automatic tracking means users have full control
2. **Offline Support**: Consider offline-first architecture for timer
3. **Data Portability**: Allow users to export their data
4. **Accessibility**: Follow WCAG guidelines for color contrast, keyboard nav
5. **Mobile**: Ensure touch-friendly interface for mobile use
