import { useState } from "react";
import MobilitySection from "./MobilitySection";
import HandstandSection from "./HandstandSection";
import StrengthSection from "./StrengthSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Workout, Exercise } from "@shared/schema";

interface WorkoutTabProps {
  date: string;
  weight: string;
  lastMobilityDay: number | null;
  lastStrengthDay: number | null;
  onSaveWorkout: (workout: Workout) => boolean;
}

export default function WorkoutTab({ 
  date, 
  weight, 
  lastMobilityDay, 
  lastStrengthDay,
  onSaveWorkout 
}: WorkoutTabProps) {
  const { toast } = useToast();
  
  // Mobility state
  const [mobilityDay, setMobilityDay] = useState<number | undefined>(
    lastMobilityDay ? lastMobilityDay + 1 : undefined
  );
  const [mobilityCompletion, setMobilityCompletion] = useState<'not-completed' | 'half-session' | 'full-session'>('full-session');
  
  // Handstand state
  const [handstandExercises, setHandstandExercises] = useState<string[]>([]);
  
  // Strength state
  const [strengthDay, setStrengthDay] = useState<number | undefined>(
    lastStrengthDay ? lastStrengthDay + 1 : undefined
  );
  const [strengthExercises, setStrengthExercises] = useState<Exercise[]>([]);
  
  // Save workout handler
  const handleSaveWorkout = () => {
    const newWorkout: Workout = {
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
    
    // Validation
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a workout date",
        variant: "destructive"
      });
      return;
    }
    
    const success = onSaveWorkout(newWorkout);
    
    if (success) {
      toast({
        title: "Workout Saved",
        description: "Your workout has been successfully saved",
      });
      
      // Reset form for next entry (keeping the days)
      setHandstandExercises([]);
      setStrengthExercises([]);
    } else {
      toast({
        title: "Save Failed",
        description: "There was an error saving your workout",
        variant: "destructive"
      });
    }
  };

  return (
    <div id="workout-content" className="flex flex-col space-y-4">
      {/* Mobility Section */}
      <MobilitySection 
        lastMobilityDay={lastMobilityDay}
        mobilityDay={mobilityDay}
        setMobilityDay={setMobilityDay}
        mobilityCompletion={mobilityCompletion}
        setMobilityCompletion={setMobilityCompletion}
      />
      
      {/* Handstand Section */}
      <HandstandSection 
        handstandExercises={handstandExercises}
        setHandstandExercises={setHandstandExercises}
      />
      
      {/* Strength Section */}
      <StrengthSection 
        lastStrengthDay={lastStrengthDay}
        strengthDay={strengthDay}
        setStrengthDay={setStrengthDay}
        strengthExercises={strengthExercises}
        setStrengthExercises={setStrengthExercises}
      />
      
      {/* Save Workout Button */}
      <div className="mt-10 mb-20 relative">
        {/* Pulsing effect for attention */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur-sm opacity-60 save-button-glow"></div>
        <Button 
          className="relative w-full bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-forest-900 font-extrabold text-2xl py-7 h-auto rounded-lg shadow-xl border-2 border-[#FFEB3B] flex items-center justify-center"
          onClick={handleSaveWorkout}
        >
          SAVE WORKOUT
        </Button>
      </div>
    </div>
  );
}
