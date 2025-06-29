import { pgTable, text, serial, integer, boolean, date, jsonb, decimal, unique } from "drizzle-orm/pg-core";
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
  dayNumber: z.union([z.number(), z.literal("freestyle")]).nullable().optional(),
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
  date: text("date").notNull(),
  weight: text("weight"),
  weight_kg: decimal("weight_kg", { precision: 5, scale: 2 }), // New snapshot column
  mobility_day: integer("mobility_day"),
  mobility_completion: text("mobility_completion").notNull(),
  handstand_exercises: jsonb("handstand_exercises").notNull().$type<string[]>(),
  strength_day: text("strength_day"), // Now supports both numbers and "freestyle"
  strength_exercises: jsonb("strength_exercises").notNull().$type<Exercise[]>(),
});

// Export schemas for insert operations
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutDB = typeof workouts.$inferSelect;

// Users table (keeping this from the original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Body weight tracking table
export const bodyWeight = pgTable("body_weight", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  weightKg: decimal("weight_kg", { precision: 5, scale: 2 }).notNull(),
}, (table) => ({
  userDateUnique: unique().on(table.userId, table.date),
}));

// Body weight schemas
export const bodyWeightSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  date: z.string(),
  weightKg: z.number(),
});

export const insertBodyWeightSchema = createInsertSchema(bodyWeight).omit({
  id: true,
});

export type BodyWeight = z.infer<typeof bodyWeightSchema>;
export type InsertBodyWeight = z.infer<typeof insertBodyWeightSchema>;
export type BodyWeightDB = typeof bodyWeight.$inferSelect;

// Summary types for API responses
export const summarySchema = z.object({
  weeklyFrequency: z.array(z.object({
    day: z.string(),
    count: z.number(),
  })),
  recentWorkouts: z.array(workoutSchema),
  prBadges: z.array(z.object({
    exercise: z.string(),
    value: z.number(),
    unit: z.string(),
  })),
  streaks: z.object({
    current: z.number(),
    longest: z.number(),
  }),
  currentWeight: z.number().nullable(),
  weightTrend: z.array(z.object({
    date: z.string(),
    weight: z.number(),
  })),
});

export type Summary = z.infer<typeof summarySchema>;
