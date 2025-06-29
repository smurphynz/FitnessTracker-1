import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { handstandExercises } from "@/lib/exercises";

interface HandstandSectionProps {
  handstandExercises: string[];
  setHandstandExercises: (exercises: string[]) => void;
}

export default function HandstandSection({
  handstandExercises: selectedExercises,
  setHandstandExercises
}: HandstandSectionProps) {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [handstandCompleted, setHandstandCompleted] = useState<boolean>(false);
  
  const handleAddExercise = () => {
    if (selectedExercise && !selectedExercises.includes(selectedExercise)) {
      setHandstandExercises([...selectedExercises, selectedExercise]);
      setSelectedExercise("");
    }
  };
  
  const handleRemoveExercise = (exercise: string) => {
    setHandstandExercises(selectedExercises.filter(ex => ex !== exercise));
  };

  return (
    <section className="forest-panel rounded-lg p-4">
      <h2 className="text-xl font-semibold text-center mb-3">
        <span className="border-b-2 border-primary-600 pb-1 text-primary-600 shadow-sm">Handstand Training</span>
      </h2>
      
      {/* Selected exercises */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2" id="selected-handstand-exercises">
          {selectedExercises.map((exercise, index) => (
            <Badge key={index} className="bg-primary-50/70 backdrop-blur-sm border border-primary-300/30 text-primary-900 hover:bg-primary-300/50 rounded-full px-3 py-1 flex items-center">
              <span>{exercise}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 text-red-400 hover:text-red-300 hover:bg-transparent"
                onClick={() => handleRemoveExercise(exercise)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedExercises.length === 0 && (
            <p className="text-sm text-muted-foreground">No exercises selected</p>
          )}
        </div>
      </div>
      
      {/* Add exercises */}
      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <Label htmlFor="handstand-exercise" className="block text-sm font-medium mb-1">Add Exercise</Label>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger id="handstand-exercise" className="w-full bg-primary-50/70 backdrop-blur-sm border border-primary-300/30 rounded text-primary-900 focus:border-primary-600">
              <SelectValue placeholder="Choose exercise" />
            </SelectTrigger>
            <SelectContent className="bg-primary-50 border-primary-300">
              {handstandExercises.map((exercise) => (
                <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="bg-primary-600 hover:bg-primary-700 text-primary-50 font-medium border border-primary-300" 
          onClick={handleAddExercise}
          disabled={!selectedExercise}
        >
          Add
        </Button>
      </div>
      
      {/* Exercise Completion Button */}
      <div className="mt-4">
        <Button 
          className={`w-full py-4 font-medium ${
            handstandCompleted 
              ? 'bg-primary-600 hover:bg-primary-700 text-primary-50' 
              : 'bg-primary-300 hover:bg-primary-600 text-primary-900 hover:text-primary-50'
          }`}
          onClick={() => setHandstandCompleted(!handstandCompleted)}
        >
          {handstandCompleted 
            ? 'Handstand Training Completed ✓' 
            : 'Handstand Training Completed'}
        </Button>
      </div>
    </section>
  );
}
