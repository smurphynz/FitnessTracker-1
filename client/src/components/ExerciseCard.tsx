import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutExercise } from "@/types";

interface Props {
  exercise: WorkoutExercise;
  setIndex: number;
  onDelete: () => void;
}

export default function ExerciseCard({ exercise, setIndex, onDelete }: Props) {
  return (
    <div className="bg-primary-700/80 backdrop-blur-sm border border-primary-600/30 rounded-lg p-3 shadow-md">
      <h3 className="font-medium text-primary-300">{exercise.name}</h3>

      <div className="mt-2 flex flex-wrap gap-2">
        {exercise.sets.map((set, i) => (
          <span
            key={i}
            className="bg-primary-700/70 backdrop-blur-sm border border-primary-600/30 w-16 rounded p-1 text-sm text-white text-center"
          >
            {set.reps ?? set.seconds}s
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-primary-300">Set {setIndex + 1}:</span>

        <button
          onClick={onDelete}
          className={cn(
            "h-6 w-6 text-red-400 hover:text-red-300 p-0",
            "hover:bg-transparent focus:outline-none"
          )}
        >
          <Trash2 className="h-full w-full" />
        </button>
      </div>

      <button
        className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white text-xs h-7 font-medium border border-primary-700/50 rounded"
        onClick={onDelete}
      >
        Remove Exercise
      </button>
    </div>
  );
}
