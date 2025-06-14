import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { workoutSchema, Workout, updateUserPreferencesSchema, insertWorkoutTemplateSchema, insertProgressPhotoSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API routes for the fitness tracker
  
  // Get all workouts
  app.get("/api/workouts", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const workouts = await storage.getWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  // Get a specific workout
  app.get("/api/workouts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workout ID" });
      }
      
      const userId = req.user!.id;
      const workout = await storage.getWorkout(id, userId);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  // Create a new workout (or update if date exists)
  app.post("/api/workouts", requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedWorkout = workoutSchema.safeParse(req.body);
      
      if (!validatedWorkout.success) {
        return res.status(400).json({ 
          message: "Invalid workout data", 
          errors: validatedWorkout.error.errors 
        });
      }
      
      const userId = req.user!.id;
      const isDuplicate = await storage.checkDuplicateWorkout(validatedWorkout.data.date, userId);
      const workout = await storage.createWorkout(validatedWorkout.data, userId);
      
      res.status(isDuplicate ? 200 : 201).json(workout);
    } catch (error) {
      console.error("Error creating/updating workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    }
  });

  // Get last mobility day
  app.get("/api/last-mobility-day", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const lastDay = await storage.getLastMobilityDay(userId);
      res.json({ lastDay });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch last mobility day" });
    }
  });

  // Get last strength day
  app.get("/api/last-strength-day", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const lastDay = await storage.getLastStrengthDay(userId);
      res.json({ lastDay });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch last strength day" });
    }
  });
  
  // Get last Calimove strength day (even if recent workouts were freestyle)
  app.get("/api/last-calimove-strength-day", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const result = await storage.getLastCalimoveStrengthDay(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch last Calimove strength day" });
    }
  });

  // Update user preferences
  app.patch("/api/user/preferences", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const validationResult = updateUserPreferencesSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid preferences data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updatedUser = await storage.updateUserPreferences(userId, validationResult.data);
      res.json({ 
        id: updatedUser.id, 
        username: updatedUser.username, 
        display_name: updatedUser.display_name,
        show_mobility: updatedUser.show_mobility,
        show_handstand: updatedUser.show_handstand,
        app_title: updatedUser.app_title
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Workout Templates API routes
  app.get("/api/workout-templates", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const templates = await storage.getWorkoutTemplates(userId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout templates" });
    }
  });

  app.post("/api/workout-templates", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = insertWorkoutTemplateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid template data", 
          errors: validationResult.error.errors 
        });
      }
      
      const userId = req.user!.id;
      const template = await storage.createWorkoutTemplate(validationResult.data, userId);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating workout template:", error);
      res.status(500).json({ message: "Failed to create workout template" });
    }
  });

  app.delete("/api/workout-templates/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const userId = req.user!.id;
      const success = await storage.deleteWorkoutTemplate(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout template" });
    }
  });

  // Progress Photos API routes
  app.get("/api/progress-photos", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const photos = await storage.getProgressPhotos(userId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress photos" });
    }
  });

  app.post("/api/progress-photos", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = insertProgressPhotoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid photo data", 
          errors: validationResult.error.errors 
        });
      }
      
      const userId = req.user!.id;
      const photo = await storage.createProgressPhoto(validationResult.data, userId);
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error creating progress photo:", error);
      res.status(500).json({ message: "Failed to create progress photo" });
    }
  });

  app.delete("/api/progress-photos/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }
      
      const userId = req.user!.id;
      const success = await storage.deleteProgressPhoto(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete progress photo" });
    }
  });
  
  // Admin endpoint to clear all workout data (password protected)
  app.post("/api/admin/clear-workouts", requireAuth, async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      if (password !== "clearallworkouts") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { db } = await import("./db");
      const { workouts } = await import("@shared/schema");
      
      // Delete all workouts
      await db.delete(workouts);
      res.json({ success: true, message: "All workout data has been cleared" });
    } catch (error) {
      console.error('Error clearing workout data:', error);
      res.status(500).json({ message: "Failed to clear workout data" });
    }
  });
  
  // Serve the forest app as the main app
  app.get("/forest-app", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "server/public/index.html"));
  });
  
  // Safari-specific route with different filename to avoid caching issues
  app.get("/safari", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Redirect to a unique URL
    const timestamp = Date.now();
    res.redirect(`/newsafari/${timestamp}`);
  });
  
  // Complete new implementation to avoid Safari caching issues
  app.get("/newsafari/:timestamp", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the new implementation file
    res.sendFile(path.resolve(process.cwd(), "server/public/new_safari.html"));
  });
  
  // Extreme cache-busting route that includes timestamp in URL
  app.get("/fresh/:timestamp", (req: Request, res: Response) => {
    // Add extreme cache-busting headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Read the HTML file
    let content = fs.readFileSync(path.resolve(process.cwd(), "server/public/safari_index.html"), 'utf8');
    
    // Add version to the HTML to force reload
    content = content.replace('</head>', `
      <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta http-equiv="pragma" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta name="version" content="${req.params.timestamp}" />
    </head>`);
    
    // Send the modified HTML
    res.send(content);
  });
  
  // Serve the forest app at the standalone route
  app.get("/standalone", (req: Request, res: Response) => {
    // Redirect to timestamped URL to bypass Safari caching
    const timestamp = Date.now();
    res.redirect(`/standalone-fresh/${timestamp}`);
  });

  // Version with timestamp to force Safari to reload
  app.get("/standalone-fresh/:timestamp", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Get timestamp for all assets
    const timestamp = req.params.timestamp;
    
    // Read the HTML file
    let content = fs.readFileSync(path.resolve(process.cwd(), "server/public/standalone/index.html"), 'utf8');
    
    // Add anti-cache measures in HTML
    content = content.replace('</head>', `
      <meta http-equiv="cache-control" content="max-age=0" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="pragma" content="no-cache" />
      <meta name="version" content="${timestamp}">
      <script>
        // Check if browser might be caching
        if(window.performance && window.performance.navigation.type === 1) {
          // This is a refresh - force bypass cache by reloading from server
          window.location.href = '/standalone-fresh/' + Date.now();
        }
      </script>
      <style>
        /* Weight input styling - inline to avoid caching */
        .input-group input#weight {
          width: 90px !important; 
          text-align: right !important;
          padding-right: 25px !important;
        }
        .weight-container {
          position: relative !important;
        }
        .weight-unit {
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          font-size: 0.75rem !important;
          color: white !important;
          pointer-events: none !important;
        }
      </style>
    </head>`);
    
    // Replace the weight input HTML directly
    content = content.replace(
      '<div class="input-group">\n          <label for="weight">Weight:</label>\n          <input type="number" id="weight"',
      '<div class="input-group">\n          <label for="weight">Weight:</label>\n          <div class="weight-container">\n            <input type="number" id="weight"'
    );
    
    content = content.replace(
      'placeholder="kg" step="0.1" value="70">',
      'placeholder="" step="0.1" value="70">\n            <span class="weight-unit">kg</span>\n          </div>'
    );
    
    res.send(content);
  });
  
  // Entirely new route with fixed HTML for Safari users
  app.get("/finalversion", (req: Request, res: Response) => {
    // Redirect to timestamped URL to bypass Safari caching
    const timestamp = Date.now();
    res.redirect(`/finalversion-ts/${timestamp}`);
  });
  
  // Version with timestamp to force Safari to reload
  app.get("/finalversion-ts/:timestamp", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the new implementation file
    res.sendFile(path.resolve(process.cwd(), "server/public/final_fresh.html"));
  });
  
  // New completely fresh version with timestamp in filename to bypass cache
  app.get("/absolute-fresh", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the completely new implementation file with timestamp in the filename
    res.sendFile(path.resolve(process.cwd(), "server/public/fresh_version_1682325444.html"));
  });
  
  // Serve the forest background image directly
  app.get("/forest-bg.png", (req: Request, res: Response) => {
    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.resolve(process.cwd(), "server/public/forest-background.png"));
  });
  
  // New ultra-fresh Safari version with inline styles 
  app.get("/safari-fix", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the completely new implementation file with timestamp in the filename
    res.sendFile(path.resolve(process.cwd(), "server/public/fresh_safari_fix.html"));
  });
  
  // Completely fresh version with timestamp in the filename for absolute uncached access
  app.get("/safari-fix-timestamp", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for Safari
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the completely new implementation file with timestamp in the filename
    res.sendFile(path.resolve(process.cwd(), "server/public/safari_fix_1745108499.html"));
  });
  
  // Brand new route with current timestamp to ensure Chrome doesn't cache it
  app.get("/exercises-1745110099", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for all browsers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the completely new implementation file
    res.sendFile(path.resolve(process.cwd(), "server/public/safari_fix_1745108499.html"));
  });
  
  // Another completely fresh version with a different timestamp and file
  app.get("/fresh-exercises-1745110685", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for all browsers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    
    // Send the completely new implementation file
    res.sendFile(path.resolve(process.cwd(), "server/public/fresh_exercises_1745110685.html"));
  });
  
  // Extreme anti-cache version with indicators to show it's fresh
  app.get("/nocache-1745111110", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for all browsers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Add a unique header to verify freshness
    res.setHeader('X-Fresh-Load', Date.now().toString());
    
    // Send the completely new implementation file
    res.sendFile(path.resolve(process.cwd(), "server/public/nocache_version_1745111110.html"));
  });
  
  // Ultra fresh version for seeing the new exercise options - new timestamp to force load
  app.get("/fresh-exercises-options", (req: Request, res: Response) => {
    // Generate unique timestamp
    const timestamp = Date.now();
    res.redirect(`/fresh-exercises-options/${timestamp}`);
  });
  
  // Timestamped route to absolutely force browser refresh
  app.get("/fresh-exercises-options/:timestamp", (req: Request, res: Response) => {
    // Add extreme cache-busting headers for all browsers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Add a unique header to verify freshness on each load
    res.setHeader('X-Fresh-Load', req.params.timestamp);
    
    // Send the index file with all new exercise options
    res.sendFile(path.resolve(process.cwd(), "server/public/index.html"));
  });

  // Admin page for clearing data
  app.get("/admin", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "server/public/admin.html"));
  });

  // Direct logout route that clears session completely
  app.get("/logout-now", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) console.error("Logout error:", err);
    });
    if (req.session) {
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
      });
    }
    res.clearCookie('connect.sid');
    res.redirect('/direct-auth');
  });

  // Simple HTML auth page that bypasses React
  app.get("/direct-auth", (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), "server/public/direct-auth.html"));
  });

  // Let Vite handle the root route for the React app
  
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
      
      // For emergency save, create a default user if none exists
      let userId = 1; // Default to user ID 1
      
      // Save to database
      const savedWorkout = await storage.createWorkout(workout, userId);
      
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
