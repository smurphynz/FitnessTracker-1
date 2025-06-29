import { format } from "date-fns";
import { Workout } from "@shared/schema";

interface RecentWorkoutsListProps {
  workouts: Workout[];
}

export default function RecentWorkoutsList({ workouts }: RecentWorkoutsListProps) {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-primary-600">
        No workouts recorded yet. Start your fitness journey!
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {workouts.map((workout, index) => {
        const formattedDate = (() => {
          try {
            return format(new Date(workout.date), "MMM d, yyyy");
          } catch (error) {
            return workout.date;
          }
        })();

        const strengthExerciseCount = workout.strength.exercises.length;
        const handstandExerciseCount = workout.handstand.exercises.length;
        const mobilityText = workout.mobility.completion !== 'not-completed' ? 
          `${workout.mobility.completion.replace('-', ' ')}` : 'Skipped';

        return (
          <div key={index} className="bg-primary-50/50 border border-primary-300/30 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-primary-600">{formattedDate}</h4>
              {workout.weight && (
                <span className="text-sm text-primary-900">{workout.weight} kg</span>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-primary-900">
              <div>
                <span className="font-medium">Mobility:</span> {mobilityText}
                {workout.mobility.dayNumber && ` (Day ${workout.mobility.dayNumber})`}
              </div>
              
              {handstandExerciseCount > 0 && (
                <div>
                  <span className="font-medium">Handstand:</span> {handstandExerciseCount} exercise{handstandExerciseCount !== 1 ? 's' : ''}
                </div>
              )}
              
              {strengthExerciseCount > 0 && (
                <div>
                  <span className="font-medium">Strength:</span> {strengthExerciseCount} exercise{strengthExerciseCount !== 1 ? 's' : ''}
                  {workout.strength.dayNumber && ` (Day ${workout.strength.dayNumber})`}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}