import WorkoutCard from "./WorkoutCard";
import { Workout } from "@shared/schema";

interface ProgressTabProps {
  workouts: Workout[];
}

export default function ProgressTab({ workouts }: ProgressTabProps) {
  return (
    <div id="progress-content" className="flex flex-col space-y-4">
      <div className="forest-panel rounded-lg p-4">
        <h2 className="text-xl font-semibold text-center mb-3">
          <span className="border-b-2 border-primary-600 pb-1 text-primary-600 shadow-sm">Workout History</span>
        </h2>
        
        {/* Workout History List */}
        <div className="space-y-3" id="workout-history">
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No workouts recorded yet. Start tracking your first workout!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
