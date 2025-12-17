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

## UI/UX Design: "Ink & Paper" 墨と紙

### Design Philosophy

The "Ink & Paper" design draws inspiration from Japanese minimalism, traditional calligraphy, and the tactile feel of quality stationery. It evokes the experience of writing in a beautiful notebook with a fine pen—intentional, focused, and serene.

**Core Principles:**
- **Ma (間) - Negative Space**: Generous whitespace creates breathing room and focus
- **Wabi-sabi**: Embrace subtle imperfection; not everything needs to be perfectly aligned
- **Single Accent**: One bold color (vermillion/shu 朱) used sparingly for emphasis
- **Texture & Depth**: Subtle paper textures and ink-like elements add warmth
- **Typography First**: Beautiful type does the heavy lifting

### Color Palette

```css
:root {
  /* === INK & PAPER PALETTE === */

  /* Paper Tones - warm, not sterile white */
  --paper:          #faf9f7;      /* Main background - warm off-white */
  --paper-aged:     #f5f3ef;      /* Slightly darker, like aged paper */
  --paper-shadow:   #ebe8e2;      /* Card shadows, borders */

  /* Ink Tones - rich blacks with warmth */
  --ink:            #1a1816;      /* Primary text - not pure black */
  --ink-muted:      #4a4744;      /* Secondary text */
  --ink-faded:      #8a8683;      /* Tertiary text, placeholders */
  --ink-wash:       #c4c1bc;      /* Borders, dividers */

  /* Vermillion (朱) - The accent */
  --shu:            #d64933;      /* Primary accent - traditional vermillion */
  --shu-light:      #e8725f;      /* Hover states */
  --shu-dark:       #b33d2a;      /* Active states */
  --shu-fade:       rgba(214, 73, 51, 0.1);  /* Subtle backgrounds */

  /* Indigo (藍) - Secondary accent for variety */
  --ai:             #2d4a6f;      /* Deep indigo blue */
  --ai-light:       #4a6a8f;      /* Lighter variant */

  /* Functional Colors */
  --success:        #4a7c59;      /* Muted green, like moss */
  --warning:        #c4923a;      /* Warm amber */
  --error:          #a63d2f;      /* Deep red */

  /* Category Colors - muted, sophisticated */
  --cat-writing:    #6b5c7a;      /* Dusty purple */
  --cat-coding:     #4a6670;      /* Steel blue */
  --cat-research:   #5c6b4a;      /* Olive */
  --cat-meeting:    #7a6b5c;      /* Warm brown */
  --cat-admin:      #6a6a6a;      /* Neutral gray */
  --cat-learning:   #5c5a70;      /* Slate */
}
```

### Typography

```css
:root {
  /* === TYPOGRAPHY === */

  /* Font Families */
  --font-serif:     'Newsreader', 'Georgia', 'Times New Roman', serif;
  --font-sans:      'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:      'JetBrains Mono', 'SF Mono', 'Consolas', monospace;

  /*
   * Newsreader: A refined serif for headings - has character without being stuffy
   * Inter: Clean sans-serif for body text and UI
   * JetBrains Mono: For timer display and stats
   */

  /* Type Scale - based on 1.25 ratio */
  --text-xs:        0.75rem;      /* 12px */
  --text-sm:        0.875rem;     /* 14px */
  --text-base:      1rem;         /* 16px */
  --text-lg:        1.125rem;     /* 18px */
  --text-xl:        1.25rem;      /* 20px */
  --text-2xl:       1.5rem;       /* 24px */
  --text-3xl:       1.875rem;     /* 30px */
  --text-4xl:       2.25rem;      /* 36px */
  --text-5xl:       3rem;         /* 48px */
  --text-timer:     5rem;         /* 80px - for the main timer */

  /* Line Heights */
  --leading-none:   1;
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide:  0.02em;
  --tracking-wider: 0.05em;

  /* Font Weights */
  --weight-normal:  400;
  --weight-medium:  500;
  --weight-semibold: 600;
  --weight-bold:    700;
}
```

### Spacing & Layout

```css
:root {
  /* === SPACING === */
  /* Based on 4px grid, with comfortable scaling */

  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */

  /* === LAYOUT === */
  --sidebar-width:     240px;
  --sidebar-collapsed: 72px;
  --max-content-width: 1200px;
  --card-radius:       12px;
  --button-radius:     8px;

  /* === SHADOWS === */
  /* Soft, paper-like shadows */
  --shadow-sm:   0 1px 2px rgba(26, 24, 22, 0.04);
  --shadow-md:   0 2px 8px rgba(26, 24, 22, 0.06),
                 0 1px 2px rgba(26, 24, 22, 0.04);
  --shadow-lg:   0 4px 16px rgba(26, 24, 22, 0.08),
                 0 2px 4px rgba(26, 24, 22, 0.04);
  --shadow-card: 0 1px 3px rgba(26, 24, 22, 0.05),
                 0 0 0 1px rgba(26, 24, 22, 0.03);
}
```

### Visual Elements

#### The Ensō (円相) - Circle Motif
Use incomplete circles as a recurring design element, inspired by the Zen ensō:
- Progress indicators use brush-stroke style circles
- Loading states feature an animated ensō being drawn
- The logo incorporates an ensō element

#### Brush Stroke Accents
- Section dividers use subtle brush-stroke textures
- Selected states have ink-wash backgrounds
- Progress bars have slightly irregular edges (not perfectly straight)

#### Paper Texture
- Subtle noise texture on backgrounds (very light, almost imperceptible)
- Cards appear to "float" slightly above the paper background
- Hover states add gentle lift effect

### Component Styling

#### Cards
```
┌─────────────────────────────────────┐
│                                     │  - Warm white background (#faf9f7)
│   Card Title                        │  - Very subtle border (1px ink-wash)
│   ─────────                         │  - Soft shadow (shadow-card)
│                                     │  - 24px padding
│   Content here with generous        │  - 12px border radius
│   spacing and breathing room        │  - No harsh corners
│                                     │
└─────────────────────────────────────┘
```

#### Buttons

**Primary (Vermillion)**
```
┌──────────────────┐
│   Start Focus    │  - Background: var(--shu)
└──────────────────┘  - Text: white
                      - Subtle shadow on hover
                      - Slight scale (1.02) on hover
```

**Secondary (Ghost)**
```
┌──────────────────┐
│     Cancel       │  - Background: transparent
└──────────────────┘  - Border: 1px ink-wash
                      - Text: var(--ink)
                      - Fill with paper-aged on hover
```

**Text Button**
```
  View all →          - No background or border
                      - Underline on hover
                      - Vermillion on hover
```

#### Timer Display
```
        ┌─────────────┐
        │             │
        │    25:00    │  - JetBrains Mono, 5rem
        │             │  - var(--ink) color
        │             │  - Tabular nums for stable width
        └─────────────┘  - Slight letter-spacing

  When running, subtle pulse animation on the colon
  When in break mode, use var(--ai) indigo color
```

#### Navigation (Sidebar)
```
┌────────────────────┐
│                    │
│   ◯ FOCUS          │  - Logo at top (ensō + wordmark)
│                    │
│ ─────────────────  │  - Divider line (brush stroke style)
│                    │
│   ○  Timer         │  - Nav items with subtle icons
│   ●  Dashboard     │  - Active item: vermillion dot
│   ○  Analytics     │  - Hover: ink-wash background
│   ○  Calendar      │  - Clean, minimal icons
│   ○  Goals         │
│                    │
│                    │
│ ─────────────────  │
│                    │
│   ⚙  Settings      │
│                    │
│   ┌────────────┐   │
│   │ 👤 Name    │   │  - User info at bottom
│   │ email@...  │   │
│   └────────────┘   │
│                    │
└────────────────────┘
```

### Page Layouts

#### Dashboard
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Today                                               December 17, 2025  │
│   ═══════                                                                │
│                                                                          │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│   │                 │  │                 │  │                 │         │
│   │   4h 32m        │  │      78         │  │   12 days       │         │
│   │   ─────────     │  │     ╭───╮       │  │   ||||||||||||| │         │
│   │   focus time    │  │    (  ●  )      │  │   current streak│         │
│   │                 │  │     ╰───╯       │  │                 │         │
│   │   ████████░░    │  │   focus score   │  │   best: 24      │         │
│   │   goal: 6h      │  │                 │  │                 │         │
│   │                 │  │                 │  │                 │         │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                                                                  │  │
│   │                          25:00                                   │  │
│   │                                                                  │  │
│   │                      [ Start Focus ]                             │  │
│   │                                                                  │  │
│   │            Writing  ▼              Add note...                   │  │
│   │                                                                  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│                                                                          │
│   Sessions                                                    View all → │
│   ────────                                                               │
│                                                                          │
│   09:00   Writing          Deep Work                            45m     │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│   10:15   Research         Shallow Work                         25m     │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│   11:00   Coding           Deep Work                           1h 15m   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Timer (Focused Mode - Full Screen)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                           ← Back to dash │
│                                                                          │
│                                                                          │
│                                                                          │
│                              Deep Work                                   │
│                              ─────────                                   │
│                                                                          │
│                                                                          │
│                               25:00                                      │
│                                                                          │
│                                                                          │
│                          [ Start Focus ]                                 │
│                                                                          │
│                       −5m              +5m                               │
│                                                                          │
│                                                                          │
│                                                                          │
│   ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│   Category    Writing              ▼                                     │
│                                                                          │
│   Note        Planning the Q1 roadmap document...                        │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Analytics
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Analytics                                                              │
│   ═════════                                                              │
│                                                                          │
│   ○ Today    ● This Week    ○ This Month    ○ Custom                    │
│                                                                          │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                                                                  │  │
│   │   Focus Time                                                     │  │
│   │                                                                  │  │
│   │    6h ┤                      ▓▓                                  │  │
│   │       │        ▓▓            ▓▓                                  │  │
│   │    4h ┤  ▓▓    ▓▓    ▓▓      ▓▓    ▓▓                            │  │
│   │       │  ▓▓    ▓▓    ▓▓      ▓▓    ▓▓    ░░                      │  │
│   │    2h ┤  ▓▓    ▓▓    ▓▓      ▓▓    ▓▓    ░░    ░░                │  │
│   │       │  ▓▓    ▓▓    ▓▓      ▓▓    ▓▓    ░░    ░░                │  │
│   │     0 └──Mon───Tue───Wed────Thu───Fri───Sat───Sun──              │  │
│   │                                                                  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   ┌────────────────────────────┐  ┌────────────────────────────────┐    │
│   │                            │  │                                │    │
│   │   By Category              │  │   Summary                      │    │
│   │                            │  │                                │    │
│   │    ████  Coding     42%    │  │   Total time      28h 45m     │    │
│   │    ████  Writing    28%    │  │   Sessions        34          │    │
│   │    ███   Research   18%    │  │   Avg / day       4h 6m       │    │
│   │    ██    Admin      12%    │  │   Avg session     50m         │    │
│   │                            │  │   Best day        Thursday    │    │
│   │                            │  │                                │    │
│   └────────────────────────────┘  └────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Calendar (Month View)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Calendar                                        ←  December 2025  →    │
│   ════════                                                               │
│                                                                          │
│   ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐                    │
│   │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │                    │
│   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│   │      │      │      │      │      │      │   1  │                    │
│   │      │      │      │      │      │      │   ░  │                    │
│   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│   │   2  │   3  │   4  │   5  │   6  │   7  │   8  │                    │
│   │  ░░  │  ▓▓  │  ▓▓  │  ▓▓▓ │  ▓▓  │   ░  │      │                    │
│   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│   │   9  │  10  │  11  │  12  │  13  │  14  │  15  │                    │
│   │  ▓▓  │  ▓▓▓ │  ▓▓  │  ▓▓  │  ▓▓▓ │   ░  │   ░  │                    │
│   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│   │  16  │ [17] │  18  │  19  │  20  │  21  │  22  │                    │
│   │  ▓▓  │  ●●  │      │      │      │      │      │  ← Today           │
│   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│   │  23  │  24  │  25  │  26  │  27  │  28  │  29  │                    │
│   │      │      │      │      │      │      │      │                    │
│   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│   │  30  │  31  │      │      │      │      │      │                    │
│   │      │      │      │      │      │      │      │                    │
│   └──────┴──────┴──────┴──────┴──────┴──────┴──────┘                    │
│                                                                          │
│   ░ = < 2h    ▓ = 2-4h    ▓▓ = 4-6h    ▓▓▓ = 6h+                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Legend uses vermillion intensity - lighter wash to full saturation
```

### Micro-interactions & Animation

```css
/* === TRANSITIONS === */
--transition-fast:   150ms ease;
--transition-base:   250ms ease;
--transition-slow:   400ms ease;
--transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* === ANIMATIONS === */

/* Gentle fade in for cards */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Ensō drawing animation for loading */
@keyframes drawEnso {
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: 20; }  /* Intentionally incomplete */
}

/* Subtle pulse for active timer */
@keyframes timerPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Ink drop for button clicks */
@keyframes inkDrop {
  from { transform: scale(0); opacity: 0.3; }
  to { transform: scale(2.5); opacity: 0; }
}
```

### Iconography

Use simple, hand-drawn style line icons. Suggestions:
- **Phosphor Icons** (light weight) - Has a softer, friendlier feel
- **Custom SVG icons** with slightly irregular strokes for key elements
- Consistent 24px size, 1.5px stroke weight

Key icons needed:
- Timer (hourglass or simple clock)
- Dashboard (grid or home)
- Analytics (simple bar chart)
- Calendar (calendar grid)
- Goals (target or flag)
- Settings (gear or sliders)
- Play/Pause/Stop (standard media controls)
- Categories (folder or tag)
- Check (for completions)
- Streak/Fire (for streaks)

### Responsive Considerations

**Desktop (1200px+)**
- Full sidebar visible
- 3-column stat cards
- Side-by-side charts

**Tablet (768px - 1199px)**
- Collapsible sidebar (icon-only)
- 2-column stat cards
- Stacked charts

**Mobile (< 768px)**
- Bottom navigation bar (no sidebar)
- Single column layout
- Full-width cards
- Timer as primary screen

### Accessibility

- **Contrast**: All text meets WCAG AA (4.5:1 for body, 3:1 for large)
- **Focus states**: Clear, visible focus rings (vermillion outline)
- **Motion**: Respect `prefers-reduced-motion`
- **Screen readers**: Proper ARIA labels, semantic HTML
- **Keyboard**: Full keyboard navigation support

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
