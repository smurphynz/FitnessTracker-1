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
  'Biceps',
  'Bodyrow',
  'Bulgarian Split Squats',
  'Chest Press',
  'Dip',
  'Elevated Pistol Squat',
  'Hollow Body Crunch',
  'Jefferson Curls',
  'Jumping Squat',
  'Lat Pull Down',
  'Leg Curl',
  'Leg Extension',
  'Leg Press',
  'Lying Knee Twist',
  'Pull-Up',
  'Push-Up',
  'Seated Rows',
  'Shoulder Press',
  'Side to Side Push Up',
  'SL Glute Bridge Raise',
  'Squats',
  'Step Up',
  'Swimmer',
  'Triceps',
  'Walking Lunges',
].sort();

// Helper to check if an exercise is time-based
export const isExerciseTimeBased = (exerciseName: string): boolean => {
  return timeBasedExercises.includes(exerciseName);
};

// All strength exercises combined
export const strengthExercises = [...timeBasedExercises, ...repBasedExercises].sort();
