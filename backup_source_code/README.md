# Sean's Cali Fitness Tracker - Source Code Backup

This is a complete backup of the fitness tracking application source code as of June 15, 2025.

## Quick Start
1. Install Node.js (v18+)
2. Run `npm install`
3. Set up PostgreSQL database
4. Configure environment variables in `.env`
5. Run `npm run dev`

## Environment Variables (.env file)
```
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=fitness_tracker
SESSION_SECRET=your_random_session_secret_here
```

## Database Setup
1. Create PostgreSQL database
2. Run `npm run db:push` to create tables
3. Application will auto-create schema on first run

## Application Access
- Main app password: `calisthenics`
- Admin panel password: `clearallworkouts`
- Admin panel URL: `/admin`

## Features Included
- Complete workout tracking system
- 38 handstand exercises
- CaliMove L2 strength exercises with weight tracking
- Progress visualization with charts
- Mobile-optimized PWA
- Admin data management panel

## File Structure
- `server/` - Backend Express.js application
- `shared/` - Database schema and types
- `client/` - Frontend static assets (not React)
- Configuration files for TypeScript, Tailwind, etc.

See DEPLOYMENT_GUIDE.md for detailed setup instructions.