# Setup Guide

## Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd fitness-tracker
   ```

2. **Install Node.js 20+** if not already installed

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up PostgreSQL database**:
   - Create a PostgreSQL database
   - Copy the connection string

5. **Configure environment variables**:
   ```bash
   # Create .env file
   echo "DATABASE_URL=postgresql://username:password@host:port/database" > .env
   echo "SESSION_SECRET=your-random-secret-key" >> .env
   ```

6. **Initialize database schema**:
   ```bash
   npm run db:push
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

## Production Deployment

### Option 1: Replit (Recommended)
1. Import project to Replit
2. Configure PostgreSQL addon
3. Set environment variables in Replit secrets
4. Deploy using Replit's deployment feature

### Option 2: Vercel/Netlify
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set environment variables in deployment platform
4. Deploy

### Option 3: Self-hosted
1. Build the project: `npm run build`
2. Set up PostgreSQL database
3. Configure reverse proxy (nginx/apache)
4. Run with PM2 or similar process manager

## Database Migration

If you have existing data:
1. Export current data: `pg_dump > backup.sql`
2. Set up new database
3. Run migrations: `npm run db:push`
4. Import data if needed

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Verify DATABASE_URL is correct
   - Check network connectivity
   - Ensure PostgreSQL is running

2. **Build failures**:
   - Clear node_modules and reinstall
   - Check Node.js version (requires 20+)

3. **Authentication issues**:
   - Verify SESSION_SECRET is set
   - Clear browser cookies/localStorage

4. **Missing dependencies**:
   - Run `npm install` to ensure all packages are installed