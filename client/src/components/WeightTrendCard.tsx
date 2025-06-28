import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface WeightTrendCardProps {
  data: Array<{ date: string; weight: number }>;
  currentWeight: number | null;
}

export default function WeightTrendCard({ data, currentWeight }: WeightTrendCardProps) {
  const hasData = data.length > 0;
  const firstWeight = hasData ? data[0].weight : null;
  const lastWeight = hasData ? data[data.length - 1].weight : null;
  const weightChange = firstWeight && lastWeight ? lastWeight - firstWeight : 0;

  return (
    <div className="space-y-4">
      {hasData ? (
        <>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="rgb(37, 99, 235)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-primary-600 font-medium">30-day change:</span>
              <span className={`ml-2 ${weightChange >= 0 ? 'text-primary-600' : 'text-primary-600'}`}>
                {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </span>
            </div>
            {currentWeight && (
              <div className="text-primary-900">
                Current: {currentWeight} kg
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-primary-600">
          No weight data available. Log your first weight to see trends.
        </div>
      )}
    </div>
  );
}