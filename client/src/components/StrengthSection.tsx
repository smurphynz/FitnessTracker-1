import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExerciseCard from "./ExerciseCard";
import { timeBasedExercises, repBasedExercises, isExerciseTimeBased } from "@/lib/exercises";
import { Exercise } from "@shared/schema";

interface StrengthSectionProps {
  lastStrengthDay: number | null;
  strengthDay: number | undefined;
  setStrengthDay: (day: number | undefined) => void;
  strengthExercises: Exercise[];
  setStrengthExercises: (exercises: Exercise[]) => void;
}

export default function StrengthSection({
  lastStrengthDay,
  strengthDay,
  setStrengthDay,
  strengthExercises,
  setStrengthExercises
}: StrengthSectionProps) {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [strengthCompleted, setStrengthCompleted] = useState<boolean>(false);
  
  const handleAddExercise = () => {
    if (!selectedExercise) return;
    
    const isTimeBased = isExerciseTimeBased(selectedExercise);
    
    const newExercise: Exercise = {
      name: selectedExercise,
      isTimeBased,
      sets: [{ value: isTimeBased ? 30 : 8 }]
    };
    
    setStrengthExercises([...strengthExercises, newExercise]);
    setSelectedExercise("");
  };
  
  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...strengthExercises];
    updatedExercises.splice(index, 1);
    setStrengthExercises(updatedExercises);
  };
  
  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...strengthExercises];
    const exercise = updatedExercises[exerciseIndex];
    const lastSetValue = exercise.sets.length > 0 
      ? exercise.sets[exercise.sets.length - 1].value 
      : exercise.isTimeBased ? 30 : 8;
      
    exercise.sets.push({ value: lastSetValue });
    setStrengthExercises(updatedExercises);
  };
  
  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...strengthExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setStrengthExercises(updatedExercises);
  };
  
  const handleUpdateSetValue = (exerciseIndex: number, setIndex: number, value: number) => {
    const updatedExercises = [...strengthExercises];
    updatedExercises[exerciseIndex].sets[setIndex].value = value;
    setStrengthExercises(updatedExercises);
  };

  return (
    <section className="forest-panel rounded-lg p-4">
      <h2 className="text-xl font-semibold text-center mb-3">
        <span className="border-b-2 border-[#FFEB3B] pb-1">CaliMove Level 2</span>
      </h2>
      
      <div className="bg-forest-800 bg-opacity-80 backdrop-blur-sm border border-[#FFEB3B]/10 rounded-md mb-3 p-2 text-center">
        <p className="text-sm">
          Last CaliMove Strength Day: 
          <span className="font-medium text-[#FFEB3B] ml-1">
            {lastStrengthDay !== null ? lastStrengthDay : "None"}
          </span>
        </p>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="strength-day" className="block text-sm font-medium mb-1">Day Number</Label>
        <Input 
          type="number" 
          id="strength-day" 
          className="w-full bg-forest-800 rounded p-2" 
          value={strengthDay === undefined ? '' : strengthDay}
          onChange={(e) => {
            const value = e.target.value;
            setStrengthDay(value === '' ? undefined : parseInt(value));
          }}
        />
      </div>
      
      {/* Exercise List */}
      <div className="space-y-4" id="strength-exercises">
        {strengthExercises.map((exercise, index) => (
          <ExerciseCard 
            key={index}
            exercise={exercise}
            onAddSet={() => handleAddSet(index)}
            onRemoveSet={(setIndex) => handleRemoveSet(index, setIndex)}
            onUpdateSetValue={(setIndex, value) => handleUpdateSetValue(index, setIndex, value)}
            onRemoveExercise={() => handleRemoveExercise(index)}
          />
        ))}
        {strengthExercises.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">No exercises added yet</p>
        )}
      </div>
      
      {/* Add Exercise */}
      <div className="mt-4 flex flex-col space-y-3">
        <div>
          <Label htmlFor="strength-exercise" className="block text-sm font-medium mb-1">Add Exercise</Label>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger id="strength-exercise" className="w-full bg-forest-800 rounded">
              <SelectValue placeholder="Choose exercise" />
            </SelectTrigger>
            <SelectContent className="bg-forest-800">
              <SelectGroup>
                <SelectLabel>Time-based Exercises</SelectLabel>
                {timeBasedExercises.map((exercise) => (
                  <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Rep-based Exercises</SelectLabel>
                {repBasedExercises.map((exercise) => (
                  <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="bg-[#FFEB3B] text-forest-900 font-medium py-6"
          onClick={handleAddExercise}
          disabled={!selectedExercise}
        >
          Add Exercise
        </Button>
        
        {/* Exercise Completion Button */}
        <div className="mt-4">
          <Button 
            className={`w-full py-4 font-medium ${
              strengthCompleted 
                ? 'bg-[#FFEB3B] hover:bg-[#FFC107] text-forest-900' 
                : 'bg-forest-700 hover:bg-forest-600'
            }`}
            onClick={() => setStrengthCompleted(!strengthCompleted)}
          >
            {strengthCompleted 
              ? 'Strength Training Completed ✓' 
              : 'Mark Exercise Day Completed'}
          </Button>
        </div>
      </div>
    </section>
  );
}
