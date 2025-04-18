import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface MobilitySectionProps {
  lastMobilityDay: number | null;
  mobilityDay: number | undefined;
  setMobilityDay: (day: number | undefined) => void;
  mobilityCompletion: 'not-completed' | 'half-session' | 'full-session';
  setMobilityCompletion: (completion: 'not-completed' | 'half-session' | 'full-session') => void;
}

export default function MobilitySection({
  lastMobilityDay,
  mobilityDay,
  setMobilityDay,
  mobilityCompletion,
  setMobilityCompletion
}: MobilitySectionProps) {
  return (
    <section className="forest-panel rounded-lg p-4">
      <h2 className="text-xl font-semibold text-center mb-3">
        <span className="border-b-2 border-[#FFEB3B] pb-1">Mobility Training</span>
      </h2>
      
      <div className="bg-forest-800 rounded-md mb-3 p-2 text-center">
        <p className="text-sm">
          Last Mobility Day: 
          <span className="font-medium text-[#FFEB3B] ml-1">
            {lastMobilityDay !== null ? lastMobilityDay : "None"}
          </span>
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="mobility-day" className="block text-sm font-medium mb-1">Day Number</Label>
          <Input 
            type="number" 
            id="mobility-day" 
            className="w-full bg-forest-800 rounded p-2" 
            value={mobilityDay === undefined ? '' : mobilityDay}
            onChange={(e) => {
              const value = e.target.value;
              setMobilityDay(value === '' ? undefined : parseInt(value));
            }}
          />
        </div>
        
        <div>
          <Label htmlFor="mobility-completion" className="block text-sm font-medium mb-1">Completion Level</Label>
          <Select 
            value={mobilityCompletion} 
            onValueChange={(value: 'not-completed' | 'half-session' | 'full-session') => 
              setMobilityCompletion(value)
            }
          >
            <SelectTrigger id="mobility-completion" className="w-full bg-forest-800 rounded">
              <SelectValue placeholder="Select completion level" />
            </SelectTrigger>
            <SelectContent className="bg-forest-800">
              <SelectItem value="full-session">Full Session</SelectItem>
              <SelectItem value="half-session">Half Session</SelectItem>
              <SelectItem value="not-completed">Not Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Exercise Completion Button */}
        <div className="mt-4">
          <Button 
            className={`w-full py-4 font-medium ${
              mobilityCompletion !== 'not-completed' 
                ? 'bg-[#FFEB3B] hover:bg-[#FFC107] text-forest-900' 
                : 'bg-forest-700 hover:bg-forest-600'
            }`}
            onClick={() => {
              const nextState = mobilityCompletion === 'not-completed'
                ? 'half-session'
                : mobilityCompletion === 'half-session'
                  ? 'full-session'
                  : 'not-completed';
              setMobilityCompletion(nextState);
            }}
          >
            {mobilityCompletion === 'not-completed' 
              ? 'Mark Exercise Day Completed' 
              : mobilityCompletion === 'half-session'
                ? 'Half Session Completed ✓' 
                : 'Full Session Completed ✓'}
          </Button>
        </div>
      </div>
    </section>
  );
}
