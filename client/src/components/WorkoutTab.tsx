import { useState } from "react";
import MobilitySection from "./MobilitySection";
import HandstandSection from "./HandstandSection";
import StrengthSection from "./StrengthSection";
import SaveWorkoutButton from "./SaveWorkoutButton";
import { Workout, Exercise } from "@shared/schema";

interface WorkoutTabProps {
  date: string;
  weight: string;
  lastMobilityDay: number | null;
  lastStrengthDay: number | null;
}

export default function WorkoutTab({ 
  date, 
  weight, 
  lastMobilityDay, 
  lastStrengthDay
}: WorkoutTabProps) {
  
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
  // Create workout data for saving
  const createWorkoutData = (): Workout => {
    return {
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
  };

  const handleSaveSuccess = () => {
    // Reset form for next entry (keeping the days)
    setHandstandExercises([]);
    setStrengthExercises([]);
  };

  return (
    <div id="workout-content" className="flex flex-col space-y-4 pb-20" style={{ overflow: "visible" }}>
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
      <SaveWorkoutButton 
        workout={createWorkoutData()} 
        onSuccess={handleSaveSuccess}
      />
      
      <div className="h-20"></div> {/* Spacer at bottom */}
    </div>
  );
}
