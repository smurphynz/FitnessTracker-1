import { format } from "date-fns";
import { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  // Format date
  const formattedDate = (() => {
    try {
      return format(new Date(workout.date), "MMMM d, yyyy");
    } catch (error) {
      return workout.date;
    }
  })();

  // Map completion status to readable text
  const getCompletionText = (completion: string) => {
    switch (completion) {
      case 'full-session': return 'Full Session';
      case 'half-session': return 'Half Session';
      case 'not-completed': return 'Not Completed';
      default: return completion;
    }
  };

  return (
    <div className="bg-forest-800 bg-opacity-70 backdrop-blur-sm border border-[#FFEB3B]/10 rounded-lg p-3 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[#FFEB3B]">{formattedDate}</h3>
        {workout.weight && <span className="text-sm">{workout.weight} kg</span>}
      </div>
      
      <div className="mt-2 border-t border-forest-700 pt-2">
        <p className="text-sm">
          <span className="text-accent">Mobility:</span> 
          {workout.mobility.dayNumber 
            ? `Day ${workout.mobility.dayNumber} (${getCompletionText(workout.mobility.completion)})`
            : getCompletionText(workout.mobility.completion)
          }
        </p>
        
        {workout.handstand.exercises.length > 0 && (
          <p className="text-sm mt-1">
            <span className="text-accent">Handstand:</span> {workout.handstand.exercises.join(', ')}
          </p>
        )}
        
        {workout.strength.exercises.length > 0 && (
          <>
            <p className="text-sm mt-1">
              <span className="text-accent">
                Strength{workout.strength.dayNumber ? ` (Day ${workout.strength.dayNumber})` : ''}:
              </span>
            </p>
            <div className="ml-4 mt-1">
              {workout.strength.exercises.map((exercise, index) => (
                <p key={index} className="text-xs">
                  {exercise.name}: {exercise.sets.map(set => set.value).join(', ')} 
                  {exercise.isTimeBased ? ' seconds' : ' reps'}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
