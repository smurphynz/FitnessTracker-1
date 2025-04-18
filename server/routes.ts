import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { workoutSchema, Workout } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the fitness tracker
  
  // Get all workouts
  app.get("/api/workouts", async (req: Request, res: Response) => {
    try {
      const workouts = await storage.getWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  // Get a specific workout
  app.get("/api/workouts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workout ID" });
      }
      
      const workout = await storage.getWorkout(id);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  // Create a new workout
  app.post("/api/workouts", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedWorkout = workoutSchema.safeParse(req.body);
      
      if (!validatedWorkout.success) {
        return res.status(400).json({ 
          message: "Invalid workout data", 
          errors: validatedWorkout.error.errors 
        });
      }
      
      const workout = await storage.createWorkout(validatedWorkout.data);
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  // Get last mobility day
  app.get("/api/last-mobility-day", async (req: Request, res: Response) => {
    try {
      const lastDay = await storage.getLastMobilityDay();
      res.json({ lastDay });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch last mobility day" });
    }
  });

  // Get last strength day
  app.get("/api/last-strength-day", async (req: Request, res: Response) => {
    try {
      const lastDay = await storage.getLastStrengthDay();
      res.json({ lastDay });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch last strength day" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
