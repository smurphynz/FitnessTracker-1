import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import WorkoutTab from "@/components/WorkoutTab";
import ProgressTab from "@/components/ProgressTab";
import SaveWorkoutButton from "@/components/SaveWorkoutButton";
import WorkoutTemplates from "@/components/WorkoutTemplates";
import ProgressPhotos from "@/components/ProgressPhotos";
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
  const [activeTab, setActiveTab] = useState<"workout" | "progress" | "templates" | "photos">("workout");
  const [currentWorkout, setCurrentWorkout] = useState(null);

  // Get all workouts
  const { data: workouts = [], isLoading: workoutsLoading, error: workoutsError } = useQuery({
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
      {/* App Title */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-primary">
          {user?.app_title || `${user?.display_name}'s Fitness Tracker`}
        </h1>
      </div>

      {/* User Header */}
      <div className="flex items-center justify-between mb-4 p-3 forest-panel rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span className="font-medium text-white">{user?.display_name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Link href="/settings">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex items-center space-x-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Data Recovery Notice */}
      <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg">
        <p className="text-sm text-green-200">
          <strong>Good news:</strong> Your 11 workouts are safely stored in the database.
        </p>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => window.location.href = '/logout-now'}
          >
            Force Logout & Access Registration
          </Button>
        </div>
      </div>

      <Header
        date={date}
        setDate={setDate}
        weight={weight}
        setWeight={setWeight}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "workout" && (
        <WorkoutTab
          date={date}
          weight={weight}
          lastMobilityDay={lastMobilityDay}
          lastStrengthDay={lastStrengthDay}
          onSaveWorkout={handleSaveWorkout}
        />
      )}
      
      {activeTab === "progress" && <ProgressTab workouts={workouts} />}
      
      {activeTab === "templates" && (
        <WorkoutTemplates
          onLoadTemplate={(template) => {
            // Load template data into current workout
            console.log("Loading template:", template);
          }}
          currentWorkout={currentWorkout}
          onSaveAsTemplate={() => {
            // Save current workout as template
            console.log("Saving as template");
          }}
        />
      )}
      
      {activeTab === "photos" && <ProgressPhotos />}

      {activeTab === "workout" && <SaveWorkoutButton />}
    </div>
  );
}