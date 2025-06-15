# Sean's Cali Fitness Tracker - Complete Deployment Guide

## Overview
This is a comprehensive fitness tracking Progressive Web App built with Node.js, Express, PostgreSQL, and vanilla JavaScript. It features workout logging, progress tracking, and mobile optimization.

## Quick Setup Methods

### Method 1: Fork in Replit (Recommended)
1. Click "Fork" button in Replit interface
2. Rename to your preferred name
3. Provision new PostgreSQL database in Secrets
4. Run `npm install` and `npm run dev`
5. Deploy using Replit's deploy button

### Method 2: Manual Setup
1. Download all source files
2. Set up Node.js environment
3. Install dependencies: `npm install`
4. Configure PostgreSQL database
5. Set environment variables
6. Run: `npm run dev`

## Core Files Structure

```
├── server/
│   ├── public/
│   │   ├── index.html          # Main application
│   │   ├── admin.html          # Admin panel
│   │   └── css/theme-dark.css  # Styling
│   ├── db.ts                   # Database connection
│   ├── storage.ts              # Data layer
│   ├── routes.ts               # API endpoints
│   └── index.ts                # Server entry
├── shared/
│   └── schema.ts               # Database schema
├── package.json                # Dependencies
├── drizzle.config.ts          # Database config
└── tsconfig.json              # TypeScript config
```

## Environment Variables Required

```
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=host
PGPORT=port
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name
SESSION_SECRET=your_session_secret_key_here
```

## Key Features
- 38 handstand exercises with tracking
- CaliMove L2 strength exercises with weight support
- Mobility day tracking (120-day program)
- Progress charts and analytics
- Mobile-first PWA design
- Password protection (default: "calisthenics")
- Admin panel (password: "clearallworkouts")
- Bright electric blue theme

## Database Schema
- Uses Drizzle ORM with PostgreSQL
- Single workouts table with JSONB columns
- Automatic schema migration via `npm run db:push`

## API Endpoints
- GET /api/workouts - List all workouts
- POST /api/workouts - Create new workout
- GET /api/last-mobility-day - Get last mobility day
- GET /api/last-strength-day - Get last strength day
- POST /api/admin/clear-workouts - Admin data clearing

## Dependencies
Key packages include:
- Express.js for server
- PostgreSQL with Neon serverless
- Drizzle ORM for database
- Chart.js for progress visualization
- Service worker for PWA functionality

## Authentication
- Simple password protection
- Session-based authentication
- Admin panel with separate password

## Mobile Optimization
- iOS Safari optimized
- PWA manifest and service worker
- Touch-friendly interface
- Safe area handling for iPhone X+