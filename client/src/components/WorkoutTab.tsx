import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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
  
  // Portal for fixed save button
  useEffect(() => {
    // Create a div to hold our portal and add it directly to the body
    const portalNode = document.createElement('div');
    portalNode.id = 'save-button-portal';
    document.body.appendChild(portalNode);
    
    // Cleanup function to remove the node when component unmounts
    return () => {
      if (document.body.contains(portalNode)) {
        document.body.removeChild(portalNode);
      }
    };
  }, []);
  
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

  // Render our component and create a portal for the fixed button
  return (
    <>
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
        
        {/* In-page Save Button */}
        <div className="mt-10 mb-20 relative">
          <Button 
            className="relative w-full bg-gradient-to-r from-[#FFEB3B] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-forest-900 font-extrabold text-2xl py-7 h-auto rounded-lg shadow-xl border-2 border-[#FFEB3B] flex items-center justify-center"
            onClick={handleSaveWorkout}
          >
            SAVE WORKOUT
          </Button>
        </div>
      </div>
      
      {/* Portal for fixed button - render only if portal container exists */}
      {document.getElementById('save-button-portal') && 
        ReactDOM.createPortal(
          <button 
            onClick={handleSaveWorkout}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#FFEB3B',
              color: 'black',
              zIndex: 9999,
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            SAVE WORKOUT
          </button>,
          document.getElementById('save-button-portal')!
        )
      }
    </>
  );
}
