import { Link } from "wouter";

export default function SaveWorkoutButton() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black p-4 flex justify-center z-50">
      <Link href="/save">
        <a className="block w-full py-4 bg-red-600 text-white text-2xl font-bold rounded-lg text-center uppercase border-4 border-white shadow-lg">
          Save Workout
        </a>
      </Link>
    </div>
  );
}