import { workouts, Workout, InsertWorkout, users, User, InsertUser, Exercise } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods (keeping original methods)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: number, preferences: Partial<User>): Promise<User>;
  
  // Workout methods
  getWorkouts(userId: number): Promise<Workout[]>;
  getWorkout(id: number, userId: number): Promise<Workout | undefined>;
  createWorkout(workout: Workout, userId: number): Promise<Workout>;
  checkDuplicateWorkout(date: string, userId: number): Promise<boolean>;
  
  // Last day tracking methods
  getLastMobilityDay(userId: number): Promise<number | undefined>;
  getLastStrengthDay(userId: number): Promise<number | undefined>;
  getLastCalimoveStrengthDay(userId: number): Promise<{ day: number | null, isRecent: boolean }>;
}

export class DatabaseStorage implements IStorage {
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
    const existingWorkouts = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.date, date), eq(workouts.user_id, userId)));
    
    // Return true if we found any workouts with the same date
    return existingWorkouts.length > 0;
  }

  // Helper method to map database workout format to application workout format
  private mapDBWorkoutToWorkout(dbWorkout: any): Workout {
    console.log("DB Workout:", dbWorkout);
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
