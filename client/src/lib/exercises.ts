// Handstand exercises
export const handstandExercises = [
  'Back to Wall Hold',
  'Box Hold',
  'Face to Wall Hold',
  'Freestanding Practice',
  'Kick Ups',
  'Mexican',
  'Shape Changes',
  'Shoulder Taps',
  'Splits',
  'Uneven Hands',
  'Wall Walk',
  'Wrist Prep',
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
