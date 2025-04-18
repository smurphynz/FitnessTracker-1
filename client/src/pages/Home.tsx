import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import WorkoutTab from "@/components/WorkoutTab";
import ProgressTab from "@/components/ProgressTab";
import { localStorageAPI } from "@/lib/storage";
import { Workout } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"workout" | "progress">("workout");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [lastMobilityDay, setLastMobilityDay] = useState<number | null>(null);
  const [lastStrengthDay, setLastStrengthDay] = useState<number | null>(null);
  
  // Load initial data from localStorage
  useEffect(() => {
    const storedWorkouts = localStorageAPI.getWorkouts();
    const storedLastMobilityDay = localStorageAPI.getLastMobilityDay();
    const storedLastStrengthDay = localStorageAPI.getLastStrengthDay();
    
    setWorkouts(storedWorkouts);
    setLastMobilityDay(storedLastMobilityDay);
    setLastStrengthDay(storedLastStrengthDay);
  }, []);
  
  // Try to fetch from backend when online
  useEffect(() => {
    const fetchDataFromBackend = async () => {
      try {
        // Fetch workouts
        const workoutsResponse = await fetch('/api/workouts');
        if (workoutsResponse.ok) {
          const workoutsData = await workoutsResponse.json();
          setWorkouts(workoutsData);
        }
        
        // Fetch last mobility day
        const mobilityResponse = await fetch('/api/last-mobility-day');
        if (mobilityResponse.ok) {
          const { lastDay } = await mobilityResponse.json();
          setLastMobilityDay(lastDay);
        }
        
        // Fetch last strength day
        const strengthResponse = await fetch('/api/last-strength-day');
        if (strengthResponse.ok) {
          const { lastDay } = await strengthResponse.json();
          setLastStrengthDay(lastDay);
        }
      } catch (error) {
        // If fetching fails, we'll use the localStorage data loaded in the first useEffect
        console.log('Using offline data');
      }
    };
    
    fetchDataFromBackend();
  }, []);
  
  // Handler for saving a new workout
  const handleSaveWorkout = (newWorkout: Workout) => {
    try {
      // Add workout to local storage first
      const savedWorkout = localStorageAPI.addWorkout(newWorkout);
      
      // Update state
      setWorkouts(prev => [savedWorkout, ...prev]);
      
      // Update last day trackers if applicable
      if (newWorkout.mobility.dayNumber) {
        setLastMobilityDay(newWorkout.mobility.dayNumber);
      }
      
      if (newWorkout.strength.dayNumber) {
        setLastStrengthDay(newWorkout.strength.dayNumber);
      }
      
      // Try to sync with backend when online
      fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout),
      }).catch(err => {
        // If POST fails, we already saved to localStorage, so it's okay for offline use
        console.log('Workout saved offline');
      });
      
      return true;
    } catch (error) {
      console.error('Failed to save workout:', error);
      return false;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 relative z-0">
      <Header 
        date={date} 
        setDate={setDate} 
        weight={weight} 
        setWeight={setWeight} 
      />
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-1 container mx-auto px-4 pb-24">
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
      </main>
    </div>
  );
}
