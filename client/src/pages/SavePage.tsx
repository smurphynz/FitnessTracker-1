import { useState } from "react";
import { Link } from "wouter";

export default function SavePage() {
  const [saved, setSaved] = useState(false);
  
  const handleSave = async () => {
    try {
      // Simple workout object
      const workout = {
        date: new Date().toISOString().split('T')[0],
        weight: '70',
        mobility: { completion: 'full-session' },
        handstand: { exercises: [] },
        strength: { exercises: [] }
      };
      
      // Send to API
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
      });
      
      if (response.ok) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl mb-8 text-center font-bold">
        Save Your Workout
      </h1>
      
      {!saved ? (
        <button
          onClick={handleSave}
          className="w-full max-w-md py-6 px-4 bg-red-600 text-white font-bold text-xl rounded-lg mb-4 border-4 border-white"
        >
          SAVE WORKOUT NOW
        </button>
      ) : (
        <div className="text-center mb-8">
          <p className="text-green-500 text-2xl mb-4">
            Workout saved successfully!
          </p>
          <Link to="/">
            <a className="text-blue-400 underline">
              Return to main page
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}