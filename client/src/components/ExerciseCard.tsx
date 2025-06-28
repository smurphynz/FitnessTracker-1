import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Exercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: Exercise;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  onUpdateSetValue: (setIndex: number, value: number) => void;
  onRemoveExercise: () => void;
}

export default function ExerciseCard({
  exercise,
  onAddSet,
  onRemoveSet,
  onUpdateSetValue,
  onRemoveExercise
}: ExerciseCardProps) {
  return (
    <div className="bg-primary-50/80 backdrop-blur-sm border border-primary-300/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-primary-600">{exercise.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${exercise.isTimeBased 
          ? 'bg-success/70 backdrop-blur-sm border-success text-primary-900' 
          : 'bg-primary-300/70 backdrop-blur-sm border-primary-600 text-primary-900'}`}>
          {exercise.isTimeBased ? 'Time-based' : 'Rep-based'}
        </span>
      </div>
      
      {/* Sets */}
      <div className="space-y-2 mb-3">
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center space-x-2">
            <span className="text-sm text-primary-600 font-medium">Set {setIndex + 1}:</span>
            <Input 
              type="number" 
              className="bg-primary-50/70 backdrop-blur-sm border border-primary-300/30 w-16 rounded p-1 text-sm text-primary-900 focus:border-primary-600" 
              value={set.value}
              onChange={(e) => onUpdateSetValue(setIndex, parseInt(e.target.value) || 0)}
              min={1}
            />
            <span className="text-sm text-primary-900">{exercise.isTimeBased ? 'seconds' : 'reps'}</span>
            {exercise.sets.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-transparent p-0"
                onClick={() => onRemoveSet(setIndex)}
              >
                <span className="sr-only">Remove set</span>
                ✕
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {/* Add/Remove Set Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          size="sm"
          className="bg-[#FFEB3B] hover:bg-[#FFC107] text-forest-900 text-xs h-7 font-medium border border-[#FFEB3B]/50" 
          onClick={onAddSet}
        >
          + Add Set
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-transparent text-xs h-7" 
          onClick={onRemoveExercise}
        >
          Remove Exercise
        </Button>
      </div>
    </div>
  );
}
