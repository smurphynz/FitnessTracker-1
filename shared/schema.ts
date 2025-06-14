import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  user_id: integer("user_id").references(() => users.id),
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

// Users table with enhanced multi-user support and preferences
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  display_name: text("display_name").notNull(),
  email: text("email"),
  show_mobility: boolean("show_mobility").notNull().default(true),
  show_handstand: boolean("show_handstand").notNull().default(true),
  app_title: text("app_title"), // Custom app title, defaults to display_name + " Fitness Tracker"
  theme: text("theme").default("light"),
  reset_token: text("reset_token"),
  reset_token_expires: text("reset_token_expires"),
  created_at: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  reset_token: true,
  reset_token_expires: true,
  created_at: true,
});

export const updateUserPreferencesSchema = createInsertSchema(users).pick({
  display_name: true,
  show_mobility: true,
  show_handstand: true,
  app_title: true,
  theme: true,
});

export const workoutTemplates = pgTable("workout_templates", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  mobility_day: integer("mobility_day"),
  mobility_completion: text("mobility_completion"),
  handstand_exercises: text("handstand_exercises").array(),
  strength_day: integer("strength_day"),
  strength_exercises: jsonb("strength_exercises"),
  created_at: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  photo_url: text("photo_url").notNull(),
  caption: text("caption"),
  taken_at: text("taken_at").notNull().default("CURRENT_TIMESTAMP"),
  weight: text("weight"),
});

export const workoutTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Template name is required"),
  mobility: mobilitySchema.optional(),
  handstand: handstandSchema.optional(),
  strength: strengthSchema.optional(),
});

export type WorkoutTemplate = z.infer<typeof workoutTemplateSchema>;

export const insertWorkoutTemplateSchema = createInsertSchema(workoutTemplates).omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const insertProgressPhotoSchema = createInsertSchema(progressPhotos).omit({
  id: true,
  user_id: true,
  taken_at: true,
});

export type InsertWorkoutTemplate = z.infer<typeof insertWorkoutTemplateSchema>;
export type InsertProgressPhoto = z.infer<typeof insertProgressPhotoSchema>;
export type WorkoutTemplateDB = typeof workoutTemplates.$inferSelect;
export type ProgressPhotoDB = typeof progressPhotos.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
