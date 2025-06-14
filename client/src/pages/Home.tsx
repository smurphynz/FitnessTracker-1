import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import WorkoutTab from "@/components/WorkoutTab";
import ProgressTab from "@/components/ProgressTab";
import SaveWorkoutButton from "@/components/SaveWorkoutButton";
import { workoutSchema, type Workout } from "@shared/schema";
import { localStorageAPI } from "@/lib/storage";

// Define API response types
interface LastDayResponse {
  lastDay: number | null;
}

const workoutsArraySchema = z.array(workoutSchema);

export default function Home() {
  const { user, logoutMutation } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("70");
  const [activeTab, setActiveTab] = useState<"workout" | "progress">("workout");

  // Get all workouts
  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts"],
    select: (data) => {
      try {
        return workoutsArraySchema.parse(data);
      } catch (error) {
        console.error("Failed to parse workouts:", error);
        return [];
      }
    },
  });

  // Get last mobility and strength days
  const { data: lastMobilityDayData } = useQuery<LastDayResponse>({
    queryKey: ["/api/last-mobility-day"],
  });

  const { data: lastStrengthDayData } = useQuery<LastDayResponse>({
    queryKey: ["/api/last-strength-day"],
  });

  const lastMobilityDay = lastMobilityDayData?.lastDay ?? null;
  const lastStrengthDay = lastStrengthDayData?.lastDay ?? null;

  const handleSaveWorkout = (newWorkout: Workout) => {
    // Store the workout locally before syncing with server
    localStorageAPI.addWorkout(newWorkout);
    return true;
  };

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md" style={{height: "auto", overflow: "visible", position: "relative"}}>
      {/* User Header */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span className="font-medium">{user?.display_name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      <Header
        date={date}
        setDate={setDate}
        weight={weight}
        setWeight={setWeight}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "workout" ? (
        <WorkoutTab
          date={date}
          weight={weight}
          lastMobilityDay={lastMobilityDay}
          lastStrengthDay={lastStrengthDay}
          onSaveWorkout={handleSaveWorkout}
        />
      ) : (
        <ProgressTab workouts={workouts} />
      )}

      {activeTab === "workout" && <SaveWorkoutButton />}
    </div>
  );
}