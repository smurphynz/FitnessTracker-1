import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Workout } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// This is a standalone component for the Save Workout button
export default function SaveWorkoutButton() {
  const { toast } = useToast();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<string>("");
  const [mobilityDay, setMobilityDay] = useState<number | undefined>(undefined);
  const [mobilityCompletion, setMobilityCompletion] = useState<'not-completed' | 'half-session' | 'full-session'>('full-session');
  const [handstandExercises, setHandstandExercises] = useState<string[]>([]);
  const [strengthDay, setStrengthDay] = useState<number | undefined>(undefined);
  const [strengthExercises, setStrengthExercises] = useState<any[]>([]);
  
  // Get form values from elements on the page
  useEffect(() => {
    // Try to get values from the page
    const getPageValues = () => {
      try {
        // Date from date input
        const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        if (dateInput) setDate(dateInput.value);
        
        // Weight from weight input
        const weightInput = document.querySelector('input[placeholder="Enter weight"]') as HTMLInputElement;
        if (weightInput) setWeight(weightInput.value);
      } catch (error) {
        console.error("Error getting form values:", error);
      }
    };
    
    // Run once at the beginning
    getPageValues();
    
    // And set up an interval to keep checking
    const interval = setInterval(getPageValues, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Save workout functionality
  const saveWorkout = async () => {
    try {
      // Create workout object with form values
      const workout: Workout = {
        date,
        weight: weight || undefined,
        mobility: {
          dayNumber: mobilityDay,
          completion: mobilityCompletion
        },
        handstand: {
          exercises: handstandExercises
        },
        strength: {
          dayNumber: strengthDay,
          exercises: strengthExercises
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
        
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
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
      className="fixed bottom-8 left-0 right-0 z-[9999] px-4"
      style={{ 
        pointerEvents: 'auto',
        backgroundColor: 'transparent',
        transform: 'translateZ(0)'
      }}
    >
      <div className="relative mx-auto max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur-sm opacity-100 animate-pulse"></div>
        <button 
          id="save-workout-button"
          className="relative w-full bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-black font-black text-3xl py-6 h-auto rounded-lg shadow-2xl border-4 border-[#FFEB3B] flex items-center justify-center"
          onClick={saveWorkout}
          style={{ 
            pointerEvents: 'auto',
            backgroundColor: '#FFEB3B',
            boxShadow: '0 0 20px 2px rgba(255, 235, 59, 0.7)'
          }}
        >
          SAVE WORKOUT
        </button>
      </div>
    </div>
  );
}