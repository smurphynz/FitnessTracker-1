import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";

interface SaveWorkoutButtonProps {
  workout: Workout;
  onSuccess?: () => void;
}

export default function SaveWorkoutButton({ workout, onSuccess }: SaveWorkoutButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveWorkoutMutation = useMutation({
    mutationFn: async (workoutData: Workout) => {
      const response = await fetch("/api/workouts", {
        method: "POST",
        body: JSON.stringify(workoutData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Success!",
        description: "Workout saved successfully",
        variant: "default",
      });
      setIsSaving(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Save workout error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save workout",
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  const handleSave = async () => {
    if (isSaving || saveWorkoutMutation.isPending) return;
    
    setIsSaving(true);
    saveWorkoutMutation.mutate(workout);
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving || saveWorkoutMutation.isPending}
      className="save-workout-btn"
    >
      {isSaving || saveWorkoutMutation.isPending ? "Saving..." : "Save Workout"}
    </button>
  );
}