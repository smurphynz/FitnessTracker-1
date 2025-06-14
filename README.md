# Sean's Cali Fitness Tracker

A multi-user Progressive Web App (PWA) for tracking calisthenics workouts with personalized features for each user.

## Features

- **Multi-User Support**: Separate accounts for family members with individual progress tracking
- **Workout Tracking**: Log mobility, handstand, and strength exercises
- **Personalized Titles**: Custom app titles for each user
- **Progress Photos**: Upload and track visual progress
- **Workout Templates**: Save and reuse workout configurations
- **Mobile-First Design**: Optimized for mobile Safari with PWA capabilities

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **UI Components**: Shadcn/ui, Radix UI
- **State Management**: TanStack Query

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up database**:
   ```bash
   npm run db:push
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**: Visit `http://localhost:5000`

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
```

## User Accounts

The app supports multiple users with individual workout tracking:

- Each user has personalized settings (mobility/handstand visibility)
- Custom app titles per user
- Separate workout histories
- Individual progress photos

## API Endpoints

- `POST /api/register` - Create new user account
- `POST /api/login` - User authentication
- `POST /api/logout` - End user session
- `GET /api/user` - Get current user info
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Save new workout

## Deployment

The project is configured for deployment on Replit with PostgreSQL database support.

## License

Private project for personal use.