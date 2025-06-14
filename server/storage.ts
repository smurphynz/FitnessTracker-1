import { workouts, Workout, InsertWorkout, users, User, InsertUser, Exercise, workoutTemplates, WorkoutTemplateDB, InsertWorkoutTemplate, progressPhotos, ProgressPhotoDB, InsertProgressPhoto } from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

export interface IStorage {
  // User methods (keeping original methods)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: number, preferences: Partial<User>): Promise<User>;
  setPasswordResetToken(userId: number, token: string, expires: string): Promise<void>;
  resetPassword(userId: number, hashedPassword: string): Promise<void>;
  
  // Workout methods
  getWorkouts(userId: number): Promise<Workout[]>;
  getWorkout(id: number, userId: number): Promise<Workout | undefined>;
  createWorkout(workout: Workout, userId: number): Promise<Workout>;
  checkDuplicateWorkout(date: string, userId: number): Promise<boolean>;
  
  // Last day tracking methods
  getLastMobilityDay(userId: number): Promise<number | undefined>;
  getLastStrengthDay(userId: number): Promise<number | undefined>;
  getLastCalimoveStrengthDay(userId: number): Promise<{ day: number | null, isRecent: boolean }>;

  // Workout templates
  getWorkoutTemplates(userId: number): Promise<WorkoutTemplateDB[]>;
  getWorkoutTemplate(id: number, userId: number): Promise<WorkoutTemplateDB | undefined>;
  createWorkoutTemplate(template: InsertWorkoutTemplate, userId: number): Promise<WorkoutTemplateDB>;
  deleteWorkoutTemplate(id: number, userId: number): Promise<boolean>;

  // Progress photos
  getProgressPhotos(userId: number): Promise<ProgressPhotoDB[]>;
  createProgressPhoto(photo: InsertProgressPhoto, userId: number): Promise<ProgressPhotoDB>;
  deleteProgressPhoto(id: number, userId: number): Promise<boolean>;

  sessionStore: any;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPreferences(id: number, preferences: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(preferences)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.reset_token, token),
        // Token should not be expired (expires field should be in the future)
        // For simplicity, we'll just check if token exists
      ));
    
    if (!user || !user.reset_token_expires) return undefined;
    
    // Check if token is expired
    const expiresAt = new Date(user.reset_token_expires);
    if (expiresAt < new Date()) return undefined;
    
    return user;
  }

  async setPasswordResetToken(userId: number, token: string, expires: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        reset_token: token, 
        reset_token_expires: expires 
      })
      .where(eq(users.id, userId));
  }

  async resetPassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      })
      .where(eq(users.id, userId));
  }

  // Workout methods
  async getWorkouts(userId: number): Promise<Workout[]> {
    // Get workouts sorted by date in descending order (newest first)
    const workoutsFromDB = await db.select().from(workouts)
      .where(eq(workouts.user_id, userId))
      .orderBy(desc(workouts.date));
    
    // Convert database workout format to application workout format
    return workoutsFromDB.map(workout => this.mapDBWorkoutToWorkout(workout));
  }

  async getWorkout(id: number, userId: number): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.user_id, userId)));
    if (!workout) return undefined;
    
    return this.mapDBWorkoutToWorkout(workout);
  }

  async createWorkout(workout: Workout, userId: number): Promise<Workout> {
    // Map the workout to database format
    console.log("Saving workout:", JSON.stringify(workout, null, 2));
    
    // First check if we already have a workout with this date
    const isDuplicate = await this.checkDuplicateWorkout(workout.date, userId);
    if (isDuplicate) {
      // If it's a duplicate, we'll update the existing workout instead of creating a new one
      const existingWorkouts = await db
        .select()
        .from(workouts)
        .where(and(eq(workouts.date, workout.date), eq(workouts.user_id, userId)));
      
      const existingWorkout = existingWorkouts[0];
      
      // Prepare update data
      const updateData = {
        weight: workout.weight || '',
        mobility_day: workout.mobility.dayNumber || null,
        mobility_completion: workout.mobility.completion,
        handstand_exercises: workout.handstand.exercises,
        strength_day: workout.strength.dayNumber || null,
        strength_exercises: workout.strength.exercises
      };
      
      // Update the existing workout
      const [updatedWorkout] = await db
        .update(workouts)
        .set(updateData)
        .where(eq(workouts.id, existingWorkout.id))
        .returning();
      
      console.log("Updated existing workout instead of creating duplicate");
      return this.mapDBWorkoutToWorkout(updatedWorkout);
    }
    
    // If not a duplicate, proceed with regular insert
    const insertData = {
      user_id: userId,
      date: workout.date,
      weight: workout.weight || '',
      mobility_day: workout.mobility.dayNumber || null,
      mobility_completion: workout.mobility.completion,
      handstand_exercises: workout.handstand.exercises,
      strength_day: workout.strength.dayNumber || null,
      strength_exercises: workout.strength.exercises
    };
    
    // Insert workout into database
    const [createdWorkout] = await db
      .insert(workouts)
      .values(insertData)
      .returning();
    
    // Map back to application format and return
    return this.mapDBWorkoutToWorkout(createdWorkout);
  }

  // Last day tracking methods
  async getLastMobilityDay(userId: number): Promise<number | undefined> {
    // Get all workouts ordered by date
    const allWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.user_id, userId))
      .orderBy(desc(workouts.date));
    
    // Find the first one with a mobility day
    const workoutWithMobilityDay = allWorkouts.find(w => w.mobility_day !== null);
    return workoutWithMobilityDay?.mobility_day || undefined;
  }

  async getLastStrengthDay(userId: number): Promise<number | undefined> {
    // Get all workouts ordered by date
    const allWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.user_id, userId))
      .orderBy(desc(workouts.date));
    
    // Find the first one with a non-null strength day (program day, not freestyle)
    const workoutWithStrengthDay = allWorkouts.find(w => w.strength_day !== null);
    return workoutWithStrengthDay?.strength_day || undefined;
  }
  
  // Get the last strength day even if recent workouts were freestyle days
  async getLastCalimoveStrengthDay(userId: number): Promise<{ day: number | null, isRecent: boolean }> {
    // Get all workouts ordered by date, most recent first
    const allWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.user_id, userId))
      .orderBy(desc(workouts.date));
    
    // If there are no workouts, return null
    if (allWorkouts.length === 0) {
      return { day: null, isRecent: false };
    }
    
    // Find the most recent workout
    const mostRecentWorkout = allWorkouts[0];
    
    // If the most recent workout has a strength day, return it
    if (mostRecentWorkout.strength_day !== null) {
      return { 
        day: mostRecentWorkout.strength_day, 
        isRecent: true 
      };
    }
    
    // Otherwise, look for the most recent workout with a strength day
    const workoutWithStrengthDay = allWorkouts.find(w => w.strength_day !== null);
    
    if (workoutWithStrengthDay) {
      return { 
        day: workoutWithStrengthDay.strength_day, 
        isRecent: false // This means this was not the most recent workout
      };
    }
    
    // If no workout with a strength day is found, return null
    return { day: null, isRecent: false };
  }
  
  // Check if a workout already exists for the given date
  async checkDuplicateWorkout(date: string, userId: number): Promise<boolean> {
    const [existingWorkout] = await db
      .select({ id: workouts.id })
      .from(workouts)
      .where(and(eq(workouts.date, date), eq(workouts.user_id, userId)))
      .limit(1);
    
    return !!existingWorkout;
  }

  // Workout Templates methods
  async getWorkoutTemplates(userId: number): Promise<WorkoutTemplateDB[]> {
    return await db
      .select()
      .from(workoutTemplates)
      .where(eq(workoutTemplates.user_id, userId))
      .orderBy(desc(workoutTemplates.created_at));
  }

  async getWorkoutTemplate(id: number, userId: number): Promise<WorkoutTemplateDB | undefined> {
    const [template] = await db
      .select()
      .from(workoutTemplates)
      .where(and(eq(workoutTemplates.id, id), eq(workoutTemplates.user_id, userId)));
    return template || undefined;
  }

  async createWorkoutTemplate(template: InsertWorkoutTemplate, userId: number): Promise<WorkoutTemplateDB> {
    const [newTemplate] = await db
      .insert(workoutTemplates)
      .values({ ...template, user_id: userId })
      .returning();
    return newTemplate;
  }

  async deleteWorkoutTemplate(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(workoutTemplates)
      .where(and(eq(workoutTemplates.id, id), eq(workoutTemplates.user_id, userId)));
    return result.rowCount > 0;
  }

  // Progress Photos methods
  async getProgressPhotos(userId: number): Promise<ProgressPhotoDB[]> {
    return await db
      .select()
      .from(progressPhotos)
      .where(eq(progressPhotos.user_id, userId))
      .orderBy(desc(progressPhotos.taken_at));
  }

  async createProgressPhoto(photo: InsertProgressPhoto, userId: number): Promise<ProgressPhotoDB> {
    const [newPhoto] = await db
      .insert(progressPhotos)
      .values({ ...photo, user_id: userId })
      .returning();
    return newPhoto;
  }

  async deleteProgressPhoto(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(progressPhotos)
      .where(and(eq(progressPhotos.id, id), eq(progressPhotos.user_id, userId)));
    return result.rowCount > 0;
  }

  // Helper method to map database workout format to application workout format
  private mapDBWorkoutToWorkout(dbWorkout: any): Workout {
    return {
      id: dbWorkout.id,
      date: dbWorkout.date,
      weight: dbWorkout.weight || undefined,
      mobility: {
        dayNumber: dbWorkout.mobility_day || undefined,
        completion: dbWorkout.mobility_completion as 'not-completed' | 'half-session' | 'full-session'
      },
      handstand: {
        exercises: dbWorkout.handstand_exercises as string[]
      },
      strength: {
        dayNumber: dbWorkout.strength_day || undefined,
        exercises: dbWorkout.strength_exercises as Exercise[]
      }
    };
  }
}

export const storage = new DatabaseStorage();
