# Sean's Cali Fitness Tracker

## Overview

This is a comprehensive fitness tracking Progressive Web App designed for logging and tracking calisthenics workouts. The application is built for daily workout logging during exercise sessions, featuring mobility training, handstand practice, and strength training with weight tracking. It's optimized for mobile use with a forest-themed interface.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main user interface
- **Vite** as the build tool and development server
- **Tailwind CSS** with custom forest theme styling
- **Progressive Web App (PWA)** with offline capabilities and iOS Safari optimization
- **Vanilla HTML fallback pages** for emergency workout saving when React fails

### Backend Architecture
- **Node.js** with Express.js server framework
- **TypeScript** throughout the entire stack
- **RESTful API** design for workout data operations
- **Session-based authentication** with password protection

### Database Layer
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Neon Database** adapter for serverless PostgreSQL connections

## Key Components

### Workout Management
- Three main workout types: Mobility, Handstand, and Strength training
- Support for both time-based (seconds) and rep-based exercises
- Weight tracking for gym equipment exercises
- Day progression tracking for CaliMove program integration

### User Interface
- Mobile-first responsive design with comprehensive blue theme
- Semi-transparent panels with primary blue color system (primary-50 backgrounds, primary-600 accents)
- Emergency fallback HTML pages for critical workout saving functionality
- Admin panel for data management and workout clearing

### Authentication System
- Simple password-based authentication (`calisthenics` for main app)
- Admin access with separate password (`clearallworkouts`)
- Session persistence using localStorage and server-side validation

## Data Flow

1. **Workout Creation**: User inputs workout data through React forms
2. **API Processing**: Express server validates data using Zod schemas
3. **Database Storage**: Drizzle ORM stores structured workout data in PostgreSQL
4. **Progress Tracking**: System tracks last completed days for mobility and strength programs
5. **Data Visualization**: Charts display workout frequency and weight progression over time

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript support
- Express.js server framework
- Drizzle ORM with PostgreSQL driver
- Neon Database serverless adapter

### UI and Styling
- Tailwind CSS with comprehensive blue color system
- Radix UI components for enhanced UX
- Chart.js for progress visualization
- PWA manifest and service worker for offline support

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- Replit-specific plugins for development environment

## Deployment Strategy

### Replit Deployment (Recommended)
- Fork repository in Replit interface
- Provision PostgreSQL database through Replit Secrets
- Environment variables automatically configured
- One-click deployment using Replit's deploy button

### Manual Deployment
- Node.js 18+ runtime environment
- PostgreSQL database setup with connection string
- Environment variables: `DATABASE_URL`, database credentials
- Build process: `npm run build` followed by `npm start`

### Database Setup
- Automatic schema creation using `npm run db:push`
- Drizzle migrations stored in `./migrations` directory
- Database connection through environment variable configuration

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Migration from Replit Agent to Replit environment completed
  - Database provisioned and connected
  - All dependencies installed and working
  - Server running successfully on port 5000
  - Major improvements implemented:
    * Complete UI theme overhaul: replaced forest green/yellow with consistent blue palette
    * Improved save workflow: single button with loading states and duplicate prevention
    * Updated app title from "Sean's Cali Fitness Tracker" to "Calisthenics Fitness Tracker"
    * Added toast notifications for better user feedback
    * Cleaned up redundant save buttons and emergency fallbacks
    * Fixed TypeScript errors and component integration
    * Resolved JavaScript errors preventing React app from loading
    * Implemented aggressive cache-busting to ensure theme updates display
- June 28, 2025. Fixed critical caching issue preventing blue theme from displaying
  - Identified and removed conflicting static HTML files in server/public and client/public
  - These old files were overriding the React app and serving forest green theme
  - React app with blue theme now loads correctly on port 5002
  - Development servers running properly with Express (5002) and Vite (5173)
  - Verified blue gradient background and updated app title are active
- June 28, 2025. Implemented comprehensive blue color system following design specifications
  - Established primary blue scale: primary-50 through primary-900 for consistent hierarchy
  - Updated all components to use new color tokens instead of hardcoded values
  - Replaced all forest- classes and #FFEB3B yellow colors with proper blue palette
  - Applied accessibility-focused contrast ratios for text and backgrounds
  - Success/error states now use semantic green (#10B981) and red (#EF4444) colors
  - Maintained yellow accent (#FFC107) sparingly for high-priority highlights only
- June 28, 2025. Sprint 2: Summary Tab with Body-Weight Tracking Implementation
  - Added body_weight table with unique constraints on user_id and date
  - Extended workouts table with weight_kg snapshot column for historical data
  - Implemented comprehensive storage layer with gap-filled weight series algorithm
  - Created API endpoints: /api/weight (POST/GET), /api/summary, /api/summary/* routes
  - Built Summary tab components: WeightTrendCard, PRBadges, StreakPanel, RecentWorkoutsList
  - Integrated Recharts for data visualization with 30-day spark lines
  - Added React Query cache invalidation for real-time updates after workout saves
- June 29, 2025. Tab Consolidation and Weight Tracking Fixes
  - Removed Progress tab and consolidated into Summary tab for simplified navigation
  - Fixed weight data flow: workout weights now properly save to weight_kg column
  - Removed confusing Weekly Activity chart with 0.25 increments
  - Removed redundant weight input banner from Summary tab
  - Weight inputs from workout form now carry through to Weight Trend visualization
  - Updated TabNavigation to show only Log Workout and Summary tabs
- June 29, 2025. Weight Tracking API Fix Completed
  - Fixed critical weight tracking issue: API now correctly retrieves weight data from workouts table
  - Updated getCurrentWeight() to return most recent weight from workouts (77.4kg)
  - Updated getWeightSeries() to return proper chronological weight progression
  - Database contains weight progression: 70.77kg → 72.4kg → 75.2kg → 77.4kg
  - Weight Trend visualization in Summary tab now displays actual workout weight data
  - Resolved mobility section button cycling issue and added freestyle strength training option
- June 29, 2025. Strength Training Exercise Expansion Completed
  - Added 13 new gym equipment exercises to rep-based exercises list in alphabetical order
  - New exercises: Biceps, Bulgarian Split Squats, Chest Press, Jefferson Curls, Lat Pull Down, Leg Curl, Leg Extension, Leg Press, Seated Rows, Shoulder Press, Side to Side Push Up, Squats, Triceps, Walking Lunges
  - Implemented weight tracking for 12 exercises (excluding Side to Side Push Up per user request)
  - Created weightTrackingExercises.ts utility for managing gym equipment vs bodyweight exercises
  - Enhanced ExerciseCard component with weight input fields (kg) for gym equipment exercises
  - Updated StrengthSection component with handleUpdateSetWeight functionality
  - Weight data from all exercises contributes to overall weight trend visualization
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```