interface StreakPanelProps {
  streaks: { current: number; longest: number };
}

export default function StreakPanel({ streaks }: StreakPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-primary-50/50 border border-primary-300/30 rounded-lg">
        <div className="text-2xl font-bold text-primary-600 mb-1">
          🔥 {streaks.current}
        </div>
        <div className="text-sm text-primary-900">Current Streak</div>
        <div className="text-xs text-primary-700 mt-1">
          {streaks.current === 1 ? 'day' : 'days'}
        </div>
      </div>
      
      <div className="text-center p-4 bg-primary-50/50 border border-primary-300/30 rounded-lg">
        <div className="text-2xl font-bold text-primary-600 mb-1">
          🏆 {streaks.longest}
        </div>
        <div className="text-sm text-primary-900">Longest Streak</div>
        <div className="text-xs text-primary-700 mt-1">
          {streaks.longest === 1 ? 'day' : 'days'}
        </div>
      </div>
    </div>
  );
}