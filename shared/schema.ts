import { pgTable, text, serial, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core types needed for the fitness app
export const exerciseSetSchema = z.object({
  value: z.number().positive(),
  weight: z.number().optional(), // Optional weight for gym exercises
});

export type ExerciseSet = z.infer<typeof exerciseSetSchema>;

export const exerciseSchema = z.object({
  name: z.string(),
  isTimeBased: z.boolean(),
  sets: z.array(exerciseSetSchema),
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const mobilitySchema = z.object({
  dayNumber: z.number().optional(),
  completion: z.enum(['not-completed', 'half-session', 'full-session']),
});

export type Mobility = z.infer<typeof mobilitySchema>;

export const handstandSchema = z.object({
  exercises: z.array(z.string()),
});

export type Handstand = z.infer<typeof handstandSchema>;

export const strengthSchema = z.object({
  dayNumber: z.number().nullable().optional(),
  exercises: z.array(exerciseSchema),
});

export type Strength = z.infer<typeof strengthSchema>;

export const workoutSchema = z.object({
  id: z.number().optional(),
  date: z.string(),
  weight: z.string().optional(),
  mobility: mobilitySchema,
  handstand: handstandSchema,
  strength: strengthSchema,
});

export type Workout = z.infer<typeof workoutSchema>;

// Database table definition
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  weight: text("weight"),
  mobility_day: integer("mobility_day"),
  mobility_completion: text("mobility_completion").notNull(),
  handstand_exercises: jsonb("handstand_exercises").notNull().$type<string[]>(),
  strength_day: integer("strength_day"),
  strength_exercises: jsonb("strength_exercises").notNull().$type<Exercise[]>(),
});

// Export schemas for insert operations
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutDB = typeof workouts.$inferSelect;

// Users table with enhanced multi-user support
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  display_name: text("display_name").notNull(),
  created_at: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  display_name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
