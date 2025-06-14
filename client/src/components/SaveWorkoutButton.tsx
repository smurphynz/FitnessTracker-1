import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function SaveWorkoutButton() {
  const handleSave = () => {
    // Simple navigation without nested links
    window.location.href = "/save";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        Save Workout
      </Button>
    </div>
  );
}