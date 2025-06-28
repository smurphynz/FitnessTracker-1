import { Badge } from "@/components/ui/badge";

interface PRBadgesProps {
  badges: Array<{ exercise: string; value: number; unit: string }>;
}

export default function PRBadges({ badges }: PRBadgesProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-primary-600">
        Complete strength exercises to see your personal records!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-primary-50/50 border border-primary-300/30 rounded-lg">
          <div>
            <h4 className="font-medium text-primary-600">{badge.exercise}</h4>
            <div className="text-sm text-primary-900">Personal Best</div>
          </div>
          <Badge className="bg-primary-600 text-primary-50 px-3 py-1">
            {badge.value} {badge.unit}
          </Badge>
        </div>
      ))}
    </div>
  );
}