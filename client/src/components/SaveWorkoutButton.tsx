import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Workout } from "@shared/schema";

// This is a standalone component for the Save Workout button
export default function SaveWorkoutButton() {
  const { toast } = useToast();
  
  // Save workout functionality
  const saveWorkout = async () => {
    try {
      // Create a simple workout object - this should be replaced with real data in production
      const workout: Workout = {
        date: new Date().toISOString().split('T')[0],
        mobility: {
          completion: 'full-session'
        },
        handstand: {
          exercises: []
        },
        strength: {
          exercises: []
        }
      };
      
      // Send to API
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your workout has been saved",
        });
      } else {
        toast({
          title: "Failed to save",
          description: "There was an error saving your workout",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div 
      id="save-workout-button-container" 
      className="fixed bottom-8 left-0 right-0 z-50 px-4"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative mx-auto max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur-sm opacity-75 animate-pulse"></div>
        <button 
          id="save-workout-button"
          className="relative w-full bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-forest-900 font-extrabold text-3xl py-6 h-auto rounded-lg shadow-xl border-2 border-[#FFEB3B] flex items-center justify-center"
          onClick={saveWorkout}
          style={{ pointerEvents: 'auto' }}
        >
          SAVE WORKOUT
        </button>
      </div>
    </div>
  );
}