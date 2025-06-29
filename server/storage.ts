import { workouts, Workout, InsertWorkout, users, User, InsertUser, Exercise, bodyWeight, BodyWeight, InsertBodyWeight, Summary } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, isNotNull } from "drizzle-orm";

export interface IStorage {
  // User methods (keeping original methods)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workout methods
  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: Workout): Promise<Workout>;
  checkDuplicateWorkout(date: string): Promise<boolean>;
  
  // Last day tracking methods
  getLastMobilityDay(): Promise<number | undefined>;
  getLastStrengthDay(): Promise<number | undefined>;
  getLastCalimoveStrengthDay(): Promise<{ day: number | null, isRecent: boolean }>;
  
  // Body weight methods
  logWeight(weight: InsertBodyWeight): Promise<BodyWeight>;
  getCurrentWeight(userId: number): Promise<number | null>;
  getWeightSeries(userId: number, days?: number): Promise<Array<{ date: string; weight: number }>>;
  
  // Summary methods
  getSummary(userId: number): Promise<Summary>;
  getWeeklyFrequency(userId: number): Promise<Array<{ day: string; count: number }>>;
  getRecentWorkouts(userId: number, limit?: number): Promise<Workout[]>;
  getPRBadges(userId: number): Promise<Array<{ exercise: string; value: number; unit: string }>>;
  getWorkoutStreaks(userId: number): Promise<{ current: number; longest: number }>;
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

  // Workout methods
  async getWorkouts(): Promise<Workout[]> {
    // Get workouts sorted by date in descending order (newest first)
    const workoutsFromDB = await db.select().from(workouts).orderBy(desc(workouts.date));
    
    // Convert database workout format to application workout format
    return workoutsFromDB.map(workout => this.mapDBWorkoutToWorkout(workout));
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    if (!workout) return undefined;
    
    return this.mapDBWorkoutToWorkout(workout);
  }

  async createWorkout(workout: Workout): Promise<Workout> {
    // Map the workout to database format
    console.log("Saving workout:", JSON.stringify(workout, null, 2));
    
    // First check if we already have a workout with this date
    const isDuplicate = await this.checkDuplicateWorkout(workout.date);
    if (isDuplicate) {
      // If it's a duplicate, we'll update the existing workout instead of creating a new one
      const existingWorkouts = await db
        .select()
        .from(workouts)
        .where(eq(workouts.date, workout.date));
      
      const existingWorkout = existingWorkouts[0];
      
      // Prepare update data
      const updateData = {
        weight: workout.weight || '',
        weight_kg: workout.weight ? workout.weight.toString() : null,
        mobility_day: workout.mobility.dayNumber || null,
        mobility_completion: workout.mobility.completion,
        handstand_exercises: workout.handstand.exercises,
        strength_day: workout.strength.dayNumber ? workout.strength.dayNumber.toString() : null,
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
      date: workout.date,
      weight: workout.weight || '',
      weight_kg: workout.weight ? workout.weight.toString() : null,
      mobility_day: workout.mobility.dayNumber || null,
      mobility_completion: workout.mobility.completion,
      handstand_exercises: workout.handstand.exercises,
      strength_day: workout.strength.dayNumber ? workout.strength.dayNumber.toString() : null,
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
  async getLastMobilityDay(): Promise<number | undefined> {
    // Get all workouts ordered by date
    const allWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.date));
    
    // Find the first one with a mobility day
    const workoutWithMobilityDay = allWorkouts.find(w => w.mobility_day !== null);
    return workoutWithMobilityDay?.mobility_day || undefined;
  }

  async getLastStrengthDay(): Promise<number | undefined> {
    // Get all workouts ordered by date
    const allWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.date));
    
    // Find the first one with a numeric strength day (program day, not freestyle)
    const workoutWithStrengthDay = allWorkouts.find(w => 
      w.strength_day !== null && w.strength_day !== "freestyle" && !isNaN(Number(w.strength_day))
    );
    return workoutWithStrengthDay?.strength_day ? Number(workoutWithStrengthDay.strength_day) : undefined;
  }
  
  // Get the last strength day even if recent workouts were freestyle days
  async getLastCalimoveStrengthDay(): Promise<{ day: number | null, isRecent: boolean }> {
    // Get all workouts ordered by date, most recent first
    const allWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.date));
    
    // If there are no workouts, return null
    if (allWorkouts.length === 0) {
      return { day: null, isRecent: false };
    }
    
    // Find the most recent workout
    const mostRecentWorkout = allWorkouts[0];
    
    // If the most recent workout has a numeric strength day, return it
    if (mostRecentWorkout.strength_day !== null && mostRecentWorkout.strength_day !== "freestyle" && !isNaN(Number(mostRecentWorkout.strength_day))) {
      return { 
        day: Number(mostRecentWorkout.strength_day), 
        isRecent: true 
      };
    }
    
    // Otherwise, look for the most recent workout with a numeric strength day
    const workoutWithStrengthDay = allWorkouts.find(w => 
      w.strength_day !== null && w.strength_day !== "freestyle" && !isNaN(Number(w.strength_day))
    );
    
    if (workoutWithStrengthDay) {
      return { 
        day: Number(workoutWithStrengthDay.strength_day), 
        isRecent: false // This means this was not the most recent workout
      };
    }
    
    // If no workout with a strength day is found, return null
    return { day: null, isRecent: false };
  }
  
  // Check if a workout already exists for the given date
  async checkDuplicateWorkout(date: string): Promise<boolean> {
    const existingWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.date, date));
    
    // Return true if we found any workouts with the same date
    return existingWorkouts.length > 0;
  }

  // Body weight methods
  async logWeight(weight: InsertBodyWeight): Promise<BodyWeight> {
    const [result] = await db
      .insert(bodyWeight)
      .values(weight)
      .onConflictDoUpdate({
        target: [bodyWeight.userId, bodyWeight.date],
        set: {
          weightKg: weight.weightKg,
        }
      })
      .returning();
    
    return {
      id: result.id,
      userId: Number(result.userId),
      date: result.date,
      weightKg: Number(result.weightKg),
    };
  }

  async getCurrentWeight(userId: number): Promise<number | null> {
    // First try to get from body_weight table
    const [bodyWeightResult] = await db
      .select()
      .from(bodyWeight)
      .where(eq(bodyWeight.userId, userId))
      .orderBy(desc(bodyWeight.date))
      .limit(1);
    
    if (bodyWeightResult) {
      return Number(bodyWeightResult.weightKg);
    }
    
    // If no body weight entries, get from most recent workout
    const allWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.date));
    
    // Find the most recent workout with weight data
    for (const workout of allWorkouts) {
      if (workout.weight_kg !== null && workout.weight_kg !== undefined) {
        return Number(workout.weight_kg);
      }
    }
    
    return null;
  }

  async getWeightSeries(userId: number, days: number = 30): Promise<Array<{ date: string; weight: number }>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    // Get ALL weight data from workouts table first
    const allWorkouts = await db
      .select({
        date: workouts.date,
        weight_kg: workouts.weight_kg
      })
      .from(workouts)
      .orderBy(workouts.date);
    
    // Filter for entries with valid weight data
    const workoutWeights = allWorkouts.filter(w => w.weight_kg !== null && w.weight_kg !== undefined);

    // Also get from body_weight table for manual entries
    const bodyWeights = await db
      .select()
      .from(bodyWeight)
      .where(eq(bodyWeight.userId, userId))
      .orderBy(bodyWeight.date);

    // Create a comprehensive map of all weights
    const allWeights = new Map<string, number>();
    
    // Add workout weights
    workoutWeights.forEach(w => {
      if (w.weight_kg !== null && w.weight_kg !== undefined) {
        allWeights.set(w.date, Number(w.weight_kg));
      }
    });
    
    // Add body weight entries (these override workout weights if same date)
    bodyWeights.forEach(w => {
      allWeights.set(w.date, Number(w.weightKg));
    });

    // Generate gap-filled series for the requested date range
    const series: Array<{ date: string; weight: number }> = [];
    let lastWeight: number | null = null;

    // Sort all weight entries and use them to build the series
    const sortedWeightEntries = Array.from(allWeights.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    // If we have any weight data, build the series
    if (sortedWeightEntries.length > 0) {
      // Start with the most recent weight available (even if before our date range)
      lastWeight = sortedWeightEntries[sortedWeightEntries.length - 1][1];

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        // Check if we have a weight entry for this date
        const weight = allWeights.get(dateStr);
        
        if (weight) {
          lastWeight = weight;
        }
        
        if (lastWeight !== null) {
          series.push({ date: dateStr, weight: lastWeight });
        }
      }
    }

    return series;
  }

  // Summary methods
  async getSummary(userId: number): Promise<Summary> {
    const [
      weeklyFrequency,
      recentWorkouts,
      prBadges,
      streaks,
      currentWeight,
      weightTrend
    ] = await Promise.all([
      this.getWeeklyFrequency(userId),
      this.getRecentWorkouts(userId, 10),
      this.getPRBadges(userId),
      this.getWorkoutStreaks(userId),
      this.getCurrentWeight(userId),
      this.getWeightSeries(userId, 30)
    ]);

    return {
      weeklyFrequency,
      recentWorkouts,
      prBadges,
      streaks,
      currentWeight,
      weightTrend
    };
  }

  async getWeeklyFrequency(userId: number): Promise<Array<{ day: string; count: number }>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days

    const workoutCounts = await db
      .select({
        date: workouts.date,
      })
      .from(workouts)
      .where(
        gte(workouts.date, startDate.toISOString().split('T')[0])
      );

    // Count workouts by day
    const dailyCounts: Record<string, number> = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize all days to 0
    days.forEach(day => {
      dailyCounts[day] = 0;
    });

    // Count actual workouts
    workoutCounts.forEach(workout => {
      const date = new Date(workout.date);
      const dayName = days[date.getDay()];
      dailyCounts[dayName]++;
    });

    return days.map(day => ({
      day,
      count: dailyCounts[day]
    }));
  }

  async getRecentWorkouts(userId: number, limit: number = 10): Promise<Workout[]> {
    const recentWorkouts = await db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.date))
      .limit(limit);

    return recentWorkouts.map(workout => this.mapDBWorkoutToWorkout(workout));
  }

  async getPRBadges(userId: number): Promise<Array<{ exercise: string; value: number; unit: string }>> {
    const allWorkouts = await db.select().from(workouts);
    
    const exerciseRecords: Record<string, { value: number; unit: string }> = {};

    allWorkouts.forEach(workout => {
      const strengthExercises = workout.strength_exercises as Exercise[];
      strengthExercises?.forEach(exercise => {
        const maxSet = exercise.sets.reduce((max, set) => 
          set.value > max.value ? set : max, { value: 0 });
        
        const unit = exercise.isTimeBased ? 'seconds' : 'reps';
        const key = exercise.name;
        
        if (!exerciseRecords[key] || maxSet.value > exerciseRecords[key].value) {
          exerciseRecords[key] = { value: maxSet.value, unit };
        }
      });
    });

    return Object.entries(exerciseRecords)
      .sort(([,a], [,b]) => b.value - a.value)
      .slice(0, 3)
      .map(([exercise, record]) => ({
        exercise,
        value: record.value,
        unit: record.unit
      }));
  }

  async getWorkoutStreaks(userId: number): Promise<{ current: number; longest: number }> {
    const allWorkouts = await db
      .select({ date: workouts.date })
      .from(workouts)
      .orderBy(desc(workouts.date));

    if (allWorkouts.length === 0) {
      return { current: 0, longest: 0 };
    }

    const dates = allWorkouts.map(w => new Date(w.date));
    dates.sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check current streak from today backwards
    let checkDate = new Date(today);
    for (const workoutDate of dates) {
      const workout = new Date(workoutDate);
      workout.setHours(0, 0, 0, 0);

      if (workout.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (workout.getTime() < checkDate.getTime()) {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const nextDate = i + 1 < dates.length ? new Date(dates[i + 1]) : null;

      tempStreak = 1;

      if (nextDate) {
        const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day found, continue counting
          let j = i + 1;
          while (j < dates.length) {
            const checkCurrent = new Date(dates[j - 1]);
            const checkNext = new Date(dates[j]);
            const diff = Math.floor((checkCurrent.getTime() - checkNext.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diff === 1) {
              tempStreak++;
              j++;
            } else {
              break;
            }
          }
          i = j - 1; // Skip ahead
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { current: currentStreak, longest: longestStreak };
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
        dayNumber: dbWorkout.strength_day === "freestyle" ? "freestyle" : 
                   (dbWorkout.strength_day && !isNaN(Number(dbWorkout.strength_day)) ? Number(dbWorkout.strength_day) : undefined),
        exercises: dbWorkout.strength_exercises as Exercise[]
      }
    };
  }
}

export const storage = new DatabaseStorage();
