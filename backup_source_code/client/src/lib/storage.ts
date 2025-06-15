import { Workout, Exercise } from "@shared/schema";

// LocalStorage keys
const WORKOUTS_KEY = 'caliTracker_workouts';
const LAST_MOBILITY_DAY_KEY = 'caliTracker_lastMobilityDay';
const LAST_STRENGTH_DAY_KEY = 'caliTracker_lastStrengthDay';

// Functions for interacting with localStorage
const saveWorkouts = (workouts: Workout[]) => {
  try {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to save workouts to localStorage:', error);
  }
};

const getWorkouts = (): Workout[] => {
  try {
    const workoutsJson = localStorage.getItem(WORKOUTS_KEY);
    return workoutsJson ? JSON.parse(workoutsJson) : [];
  } catch (error) {
    console.error('Failed to get workouts from localStorage:', error);
    return [];
  }
};

const saveLastMobilityDay = (dayNumber: number) => {
  try {
    localStorage.setItem(LAST_MOBILITY_DAY_KEY, dayNumber.toString());
  } catch (error) {
    console.error('Failed to save last mobility day to localStorage:', error);
  }
};

const getLastMobilityDay = (): number | null => {
  try {
    const dayString = localStorage.getItem(LAST_MOBILITY_DAY_KEY);
    return dayString ? parseInt(dayString, 10) : null;
  } catch (error) {
    console.error('Failed to get last mobility day from localStorage:', error);
    return null;
  }
};

const saveLastStrengthDay = (dayNumber: number) => {
  try {
    localStorage.setItem(LAST_STRENGTH_DAY_KEY, dayNumber.toString());
  } catch (error) {
    console.error('Failed to save last strength day to localStorage:', error);
  }
};

const getLastStrengthDay = (): number | null => {
  try {
    const dayString = localStorage.getItem(LAST_STRENGTH_DAY_KEY);
    return dayString ? parseInt(dayString, 10) : null;
  } catch (error) {
    console.error('Failed to get last strength day from localStorage:', error);
    return null;
  }
};

// Function to add a new workout and update last day trackers
const addWorkout = (workout: Workout) => {
  try {
    const workouts = getWorkouts();
    
    // Generate an ID for the workout
    const newId = workouts.length > 0 
      ? Math.max(...workouts.map(w => w.id ?? 0)) + 1 
      : 1;
    
    const newWorkout = { ...workout, id: newId };
    workouts.unshift(newWorkout); // Add to the beginning for chronological order
    
    saveWorkouts(workouts);
    
    // Update last day trackers if applicable
    if (workout.mobility.dayNumber) {
      saveLastMobilityDay(workout.mobility.dayNumber);
    }
    
    if (workout.strength.dayNumber) {
      saveLastStrengthDay(workout.strength.dayNumber);
    }
    
    return newWorkout;
  } catch (error) {
    console.error('Failed to add workout:', error);
    throw error;
  }
};

// For syncing with the backend when online
const syncWithBackend = async () => {
  try {
    // Get workouts from localStorage
    const localWorkouts = getWorkouts();
    
    // Send to backend
    await fetch('/api/workouts/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localWorkouts),
    });
    
    // Fetch updated data from backend
    const response = await fetch('/api/workouts');
    const backendWorkouts = await response.json();
    
    // Update localStorage
    saveWorkouts(backendWorkouts);
    
    return true;
  } catch (error) {
    console.error('Failed to sync with backend:', error);
    return false;
  }
};

// Export the storage API
export const localStorageAPI = {
  getWorkouts,
  addWorkout,
  getLastMobilityDay,
  getLastStrengthDay,
  syncWithBackend,
};
