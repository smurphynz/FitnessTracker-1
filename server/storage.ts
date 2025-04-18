import { workouts, Workout, InsertWorkout, users, User, InsertUser, Exercise } from "@shared/schema";

export interface IStorage {
  // User methods (keeping original methods)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workout methods
  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  
  // Last day tracking methods
  getLastMobilityDay(): Promise<number | undefined>;
  getLastStrengthDay(): Promise<number | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workoutsMap: Map<number, Workout>;
  private currentUserId: number;
  private currentWorkoutId: number;

  constructor() {
    this.users = new Map();
    this.workoutsMap = new Map();
    this.currentUserId = 1;
    this.currentWorkoutId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Workout methods
  async getWorkouts(): Promise<Workout[]> {
    // Sort workouts by date in descending order (newest first)
    return Array.from(this.workoutsMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workoutsMap.get(id);
  }

  async createWorkout(workout: Workout): Promise<Workout> {
    const id = this.currentWorkoutId++;
    const newWorkout: Workout = { ...workout, id };
    this.workoutsMap.set(id, newWorkout);
    return newWorkout;
  }

  // Last day tracking methods
  async getLastMobilityDay(): Promise<number | undefined> {
    const workouts = await this.getWorkouts();
    for (const workout of workouts) {
      if (workout.mobility.dayNumber) {
        return workout.mobility.dayNumber;
      }
    }
    return undefined;
  }

  async getLastStrengthDay(): Promise<number | undefined> {
    const workouts = await this.getWorkouts();
    for (const workout of workouts) {
      if (workout.strength.dayNumber) {
        return workout.strength.dayNumber;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
