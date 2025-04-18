import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <span className="border-b-2 border-accent pb-1">Mobility Training</span>
      </h2>
      
      <div className="bg-forest-800 rounded-md mb-3 p-2 text-center">
        <p className="text-sm">
          Last Mobility Day: 
          <span className="font-medium text-accent ml-1">
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
      </div>
    </section>
  );
}
