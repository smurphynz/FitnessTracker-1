# Sean's Cali Fitness Tracker

A comprehensive Progressive Web App for tracking calisthenics workouts, built with Node.js, Express, and PostgreSQL.

## Features

- **Workout Tracking**: Log mobility, handstand, and strength training sessions
- **Exercise Library**: 38 handstand exercises and complete CaliMove L2 strength program
- **Weight Tracking**: Support for gym equipment with weight logging
- **Progress Visualization**: Charts showing workout frequency and weight progression
- **Mobile Optimized**: PWA with offline capabilities and iOS Safari optimization
- **Secure**: Password protection and admin panel for data management

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/seans-cali-fitness-tracker.git
cd seans-cali-fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your_random_session_secret_here
```

4. Initialize database:
```bash
npm run db:push
```

5. Start the application:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Usage

### Authentication
- **App Password**: `calisthenics`
- **Admin Panel**: Visit `/admin` with password `clearallworkouts`

### Workout Logging
1. Enter date and weight
2. Set mobility day (1-120) and completion level
3. Add handstand exercises from the dropdown
4. Add strength exercises with sets/reps or time
5. Save workout

### Progress Tracking
- View workout history and statistics
- Analyze weight trends and workout frequency
- See most frequently used exercises

## Project Structure

```
├── server/              # Express.js backend
│   ├── public/         # Static files (HTML, CSS)
│   ├── db.ts          # Database connection
│   ├── storage.ts     # Data access layer
│   ├── routes.ts      # API endpoints
│   └── index.ts       # Server entry point
├── shared/             # Shared types and schemas
│   └── schema.ts      # Database schema definitions
├── client/            # Frontend assets
└── package.json       # Dependencies and scripts
```

## API Endpoints

- `GET /api/workouts` - Retrieve all workouts
- `POST /api/workouts` - Create new workout
- `GET /api/last-mobility-day` - Get last logged mobility day
- `GET /api/last-strength-day` - Get last logged strength day
- `POST /api/admin/clear-workouts` - Admin: Clear all data

## Database Schema

Uses Drizzle ORM with PostgreSQL. Single `workouts` table with JSONB columns for flexible exercise storage.

## Deployment

### Replit
The app is optimized for Replit deployment with automatic configuration.

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables
3. Run: `npm start`

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: Vanilla JavaScript, Chart.js
- **Styling**: Tailwind CSS
- **Authentication**: Session-based with Passport.js

## Contributing

This is a personal fitness tracker. For similar implementations:
1. Fork the repository
2. Customize exercise lists and tracking requirements
3. Update authentication and styling as needed

## License

MIT License - See LICENSE file for details