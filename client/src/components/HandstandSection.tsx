import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import type { HandstandExercise } from "@/types";

interface Props {
  exercises: HandstandExercise[];
  onAdd: (name: string) => void;
}

export default function HandstandSection({ exercises, onAdd }: Props) {
  return (
    <section className="bg-primary-900/60 backdrop-blur-sm rounded-lg p-4">
      <header className="mb-3 text-center">
        <span className="border-b-2 border-primary-300 pb-1 text-primary-300 shadow-sm">
          Handstand Training
        </span>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {exercises.map((ex, i) => (
          <Badge
            key={i}
            className="bg-primary-700/70 backdrop-blur-sm border border-primary-600/30 text-white hover:bg-primary-700 rounded-full px-3 py-1 flex items-center"
          >
            {ex.name}
          </Badge>
        ))}
      </div>

      <Select onValueChange={onAdd}>
        <SelectTrigger
          id="handstand-exercise"
          className="w-full bg-primary-700/70 backdrop-blur-sm border border-primary-600/30 rounded"
        >
          Add Exercise…
        </SelectTrigger>
        <SelectContent className="bg-primary-700">
          {[
            "Shape Changes",
            "Uneven Hands",
            "Mexican",
            "Splits",
          ].map((opt) => (
            <div
              key={opt}
              className="cursor-pointer px-3 py-2 hover:bg-primary-600/50"
              onClick={() => onAdd(opt)}
            >
              {opt}
            </div>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
