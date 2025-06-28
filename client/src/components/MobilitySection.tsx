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
        <span className="border-b-2 border-primary-600 pb-1 text-primary-600 shadow-sm">Mobility Training</span>
      </h2>
      
      <div className="bg-primary-50/80 backdrop-blur-sm border border-primary-300/30 rounded-md mb-3 p-2 text-center">
        <p className="text-sm text-primary-900">
          Last Mobility Day: 
          <span className="font-medium text-primary-600 ml-1">
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
            className="w-full bg-primary-50/70 backdrop-blur-sm border border-primary-300/30 rounded p-2 text-primary-900 focus:border-primary-600" 
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
            <SelectTrigger id="mobility-completion" className="w-full bg-primary-50/70 backdrop-blur-sm border border-primary-300/30 rounded text-primary-900 focus:border-primary-600">
              <SelectValue placeholder="Select completion level" />
            </SelectTrigger>
            <SelectContent className="bg-primary-50 border-primary-300">
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
                ? 'bg-success hover:bg-success/90 text-primary-900' 
                : 'bg-primary-300 hover:bg-primary-600 text-primary-900 hover:text-primary-50'
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
