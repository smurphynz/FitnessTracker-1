// Handstand exercises
export const handstandExercises = [
  'Back to Wall Hold',
  'Box Hold',
  'Chest to Wall Handstand Push Ups (Eccentric)',
  'Chest to Wall Handstand Push Ups (Full Range)',
  'Crow Handstand Push Up',
  'Crow Pose (Bakasana)',
  'Face to Wall Hold',
  'Freestanding Practice',
  'Frog Stand to Handstand (Assisted)',
  'Handstand Gaze Shift',
  'Handstand Iso Holds',
  'Handstand Shrugs',
  'Kick Ups',
  'L Sits',
  'Mexican',
  'Pike Press Work',
  'Pike Push Ups',
  'Shape Changes',
  'Shoulder Taps',
  'Splits',
  'Straddle Leg Lifts',
  'Straddle Press',
  'Straddle Ups',
  'Straddle Walks',
  'Uneven Hands',
  'V Ups',
  'Wall Walk',
  'Wrist Prep',
  'Wrist Taps',
].sort();

// Time-based exercises
export const timeBasedExercises = [
  'Active Hangs',
  'Arch Up Hold',
  'Deep Squat Hold',
  'Hollow Body Hold',
  'Horse Stance',
  'Pike Stand',
].sort();

// Rep-based exercises
export const repBasedExercises = [
  'Archer Bodyrow',
  'Archer Squat',
  'Bodyrow',
  'Dip',
  'Elevated Pistol Squat',
  'Hollow Body Crunch',
  'Jumping Squat',
  'Lying Knee Twist',
  'Pull-Up',
  'Push-Up',
  'Side to Side Push Up',
  'SL Glute Bridge Raise',
  'Step Up',
  'Swimmer',
].sort();

// Helper to check if an exercise is time-based
export const isExerciseTimeBased = (exerciseName: string): boolean => {
  return timeBasedExercises.includes(exerciseName);
};

// All strength exercises combined
export const strengthExercises = [...timeBasedExercises, ...repBasedExercises].sort();
