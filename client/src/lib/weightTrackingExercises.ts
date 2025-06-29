// Exercises that support weight tracking (gym equipment exercises)
export const weightTrackingExercises = [
  'Biceps',
  'Bulgarian Split Squats',
  'Chest Press',
  'Jefferson Curls',
  'Lat Pull Down',
  'Leg Curl',
  'Leg Extension',
  'Leg Press',
  'Seated Rows',
  'Shoulder Press',
  'Squats',
  'Triceps',
  'Walking Lunges',
];

export const supportsWeightTracking = (exerciseName: string): boolean => {
  return weightTrackingExercises.includes(exerciseName);
};