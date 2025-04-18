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
  
  // Emergency Save API endpoint - can be accessed directly through a browser
  app.get("/emergency-save", async (req: Request, res: Response) => {
    try {
      // Create a minimal workout
      const workout: Workout = {
        date: new Date().toISOString().split('T')[0],
        weight: "70",
        mobility: { completion: "full-session" },
        handstand: { exercises: [] },
        strength: { exercises: [] }
      };
      
      // Save to database
      const savedWorkout = await storage.createWorkout(workout);
      
      // Return simple HTML response - no React
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Emergency Save</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background-color: #1A402B;
                color: white;
              }
              .success {
                color: #4CAF50;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFEB3B;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px;
              }
            </style>
          </head>
          <body>
            <h1>Emergency Save Function</h1>
            <div class="success">✅ Workout saved successfully!</div>
            <p>Saved workout ID: ${savedWorkout.id}</p>
            <p>Date: ${workout.date}</p>
            <div>
              <a class="button" href="/">Return to App</a>
              <a class="button" href="/emergency-save">Save Another</a>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Emergency save failed:", error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Emergency Save</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background-color: #1A402B;
                color: white;
              }
              .error {
                color: #f44336;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFEB3B;
                color: black;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px;
              }
            </style>
          </head>
          <body>
            <h1>Emergency Save Function</h1>
            <div class="error">❌ Failed to save workout</div>
            <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <div>
              <a class="button" href="/">Return to App</a>
              <a class="button" href="/emergency-save">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
