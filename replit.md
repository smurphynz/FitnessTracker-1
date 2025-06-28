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
- Mobile-first responsive design with forest theme
- Semi-transparent panels with yellow accent colors (#FFEB3B)
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
- Tailwind CSS with custom forest theme
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
  - Identified issues for improvement: UI theme, save workflow, data integrity, multi-user support
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```