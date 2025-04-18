import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  date: string;
  setDate: (date: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
}

export default function Header({ date, setDate, weight, setWeight }: HeaderProps) {
  // Set current date on initial render
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, [setDate]);

  return (
    <header className="forest-panel sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#FFEB3B]">
            Sean's Cali Fitness Tracker
          </h1>
          
          {/* Date and Weight tracking */}
          <div className="w-full flex items-center justify-between mt-3">
            {/* Date selector */}
            <div className="flex items-center">
              <Label htmlFor="workout-date" className="mr-2 text-sm font-medium">Date:</Label>
              <Input 
                type="date" 
                id="workout-date" 
                className="bg-forest-800 bg-opacity-70 backdrop-blur-sm border border-[#FFEB3B]/10 rounded px-2 py-1 text-sm h-auto w-auto" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            {/* Weight input */}
            <div className="flex items-center">
              <Label htmlFor="weight-input" className="mr-2 text-sm font-medium">Weight:</Label>
              <Input 
                type="number" 
                id="weight-input" 
                placeholder="kg" 
                className="bg-forest-800 bg-opacity-70 backdrop-blur-sm border border-[#FFEB3B]/10 rounded w-16 px-2 py-1 text-sm h-auto" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
