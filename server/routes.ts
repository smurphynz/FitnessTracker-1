import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { workoutSchema, Workout } from "@shared/schema";
import { z } from "zod";
import path from "path";

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
  
  // Serve the forest app as the main app
  app.get("/forest-app", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "server/public/index.html"));
  });
  
  // Serve the forest app at the standalone route
  app.get("/standalone", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "server/public/standalone/index.html"));
  });
  
  // Also serve the forest app at the root route with higher priority than Vite
  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "server/public/index.html"));
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
      
      // Return ultra-minimal HTML response for Safari compatibility
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Emergency Save</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                text-align: center;
                padding: 20px;
                margin: 0;
                background-color: #22543D;
                color: white;
              }
              .container {
                max-width: 500px;
                margin: 30px auto;
                padding: 20px;
                background-color: rgba(34, 84, 61, 0.7);
                border: 2px solid #FFEB3B;
                border-radius: 10px;
              }
              h1 {
                color: #FFEB3B;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .success-message {
                background-color: #4CAF50;
                color: white;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                font-weight: bold;
                font-size: 18px;
              }
              .detail {
                background-color: rgba(0, 0, 0, 0.2);
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
              }
              .button {
                display: inline-block;
                padding: 12px 25px;
                background-color: #FFEB3B;
                color: #333;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px;
                border: none;
              }
              .button:hover {
                background-color: #FDD835;
              }
              .button.secondary {
                background-color: #4CAF50;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Emergency Save Function</h1>
              <div class="success-message">✅ Workout saved successfully!</div>
              <div class="detail">Saved workout ID: ${savedWorkout.id}</div>
              <div class="detail">Date: ${workout.date}</div>
              <div class="detail">Mobility: Full Session</div>
              <div>
                <a class="button" href="/">Return to App</a>
                <a class="button secondary" href="/emergency-save">Save Another</a>
              </div>
              <div style="margin-top: 20px">
                <a class="button" href="/redirect-save.html">More Save Options</a>
              </div>
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
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Emergency Save - Error</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                text-align: center;
                padding: 20px;
                margin: 0;
                background-color: #22543D;
                color: white;
              }
              .container {
                max-width: 500px;
                margin: 30px auto;
                padding: 20px;
                background-color: rgba(34, 84, 61, 0.7);
                border: 2px solid #FFEB3B;
                border-radius: 10px;
              }
              h1 {
                color: #FFEB3B;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .error-message {
                background-color: #F44336;
                color: white;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                font-weight: bold;
                font-size: 18px;
              }
              .detail {
                background-color: rgba(0, 0, 0, 0.2);
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
              }
              .button {
                display: inline-block;
                padding: 12px 25px;
                background-color: #FFEB3B;
                color: #333;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px;
                border: none;
              }
              .button:hover {
                background-color: #FDD835;
              }
              .button.retry {
                background-color: #F44336;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Emergency Save Function</h1>
              <div class="error-message">❌ Failed to save workout</div>
              <div class="detail">Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>
              <div>
                <a class="button" href="/">Return to App</a>
                <a class="button retry" href="/emergency-save">Try Again</a>
              </div>
              <div style="margin-top: 20px">
                <a class="button" href="/redirect-save.html">Other Save Options</a>
              </div>
            </div>
          </body>
        </html>
      `);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
