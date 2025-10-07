# Employee Absence Tracking Application

## Overview

A Vue.js/Nuxt 3 application for managing employee absences with a full-year calendar view, featuring virtual scrolling and real-time updates.


<br />
<img
  width="1920"
  height="932"
  alt="Screenshot From 2025-10-07 21-11-53"
  src="https://github.com/user-attachments/assets/d71d56f2-3aee-4526-88a7-32b09818d5ce"
  style="margin: 40px 0;"
/>
<br />


## Completed Requirements

### Core Technical Stack

- **Vue.js with Nuxt 3** - Modern Vue framework with SSR support
- **Vuetify 3** - Material Design component library
- **TypeScript** - Full type safety throughout the application
- **Single File Components** - Modular component architecture

### Features Implemented

#### Table Display

- Full year calendar view (365 days)
- Employee information columns (Personnel #, First Name, Last Name)
- **Dual virtual scrolling** - Both horizontal (days) and vertical (employees)
- Vertical: `v-virtual-scroll` for employee rows
- Horizontal: `RecycleScroller` for calendar days

#### Visual Indicators

- **Color-coded cells**:
- 🔴 Red: Employee absent
- 🟢 Green: Employee present
- ⬜ Grey: Weekends (Saturday/Sunday)
- 🔵 Blue outline: Today's date

#### Absence Management

- **Click-to-edit dialog** for any calendar cell
- **Create new absences** with type, reason, and date range
- **Edit existing absences** with all details pre-filled
- **Multi-day absence support** with date range picker
- **Delete functionality** for existing absences

#### State Management

- **Nuxt Composition API** with `useState` for global state
- **Live updates** - Changes immediately reflect in the calendar
- **Persistent state** during session
- **GraphQL-ready structure** - Data models ready for backend integration

#### Additional Features

- **TODAY button** - Quick navigation to current date with smooth scrolling
- **Loading screen** with animated logo
- **Responsive design** using Vuetify's grid system
- **60 sample employees** with mock data
- **Performance optimized** for large datasets

## Tech Stack

- **Framework**: Nuxt 3.15.0
- **UI Library**: Vuetify 3.7.6
- **Language**: TypeScript 5.7.2
- **Virtual Scrolling**: vue-virtual-scroller of Vuetify for the vertical and RecycleScroller for the horizontal
- **Build Tool**: Vite 5.4.14

## Project Structure

```
/
├── components/
│   └── attendance/       # Attendance table and cell components
├── composables/
│   ├── stores/           # State management (employees, attendance)
│   └── ui/               # UI utilities (dialogs, loading)
├── pages/                # Application routes
├── types/                # TypeScript type definitions
└── utils/                # Date utilities and helpers
```

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Performance Notes

- Efficiently handles 60+ employees × 365 days (21,900+ cells)
- Virtual scrolling ensures smooth performance regardless of dataset size
- Optimized re-rendering with Vue's reactivity system

