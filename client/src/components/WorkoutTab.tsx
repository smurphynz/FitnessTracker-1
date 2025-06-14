import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import MobilitySection from "./MobilitySection";
import HandstandSection from "./HandstandSection";
import StrengthSection from "./StrengthSection";
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
  const { user } = useAuth();
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
    if (!date.trim()) {
      toast({
        title: "Date required",
        description: "Please select a valid date",
        variant: "destructive",
      });
      return;
    }

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
    <div id="workout-content" className="flex flex-col space-y-4 pb-20" style={{ overflow: "visible" }}>
      {/* Mobility Section - conditionally shown */}
      {user?.show_mobility && (
        <MobilitySection 
          lastMobilityDay={lastMobilityDay}
          mobilityDay={mobilityDay}
          setMobilityDay={setMobilityDay}
          mobilityCompletion={mobilityCompletion}
          setMobilityCompletion={setMobilityCompletion}
        />
      )}
      
      {/* Handstand Section - conditionally shown */}
      {user?.show_handstand && (
        <HandstandSection 
          handstandExercises={handstandExercises}
          setHandstandExercises={setHandstandExercises}
        />
      )}
      
      {/* Strength Section - always shown */}
      <StrengthSection 
        lastStrengthDay={lastStrengthDay}
        strengthDay={strengthDay}
        setStrengthDay={setStrengthDay}
        strengthExercises={strengthExercises}
        setStrengthExercises={setStrengthExercises}
      />
      
      {/* Original save button now hidden, using global SaveWorkoutButton instead */}
      <div className="h-20"></div> {/* Spacer at bottom */}
    </div>
  );
}
