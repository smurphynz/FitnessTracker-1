import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Dot } from 'recharts';

interface WeightTrendCardProps {
  data: Array<{ date: string; weight: number }>;
  currentWeight: number | null;
}

export default function WeightTrendCard({ data, currentWeight }: WeightTrendCardProps) {
  const hasData = data.length > 0;
  const firstWeight = hasData ? data[0].weight : null;
  const lastWeight = hasData ? data[data.length - 1].weight : null;
  const weightChange = firstWeight && lastWeight ? lastWeight - firstWeight : 0;

  // Format date for display (show month/day)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format data for chart with short dates
  const chartData = data.map(item => ({
    ...item,
    displayDate: formatDate(item.date)
  }));

  return (
    <div className="space-y-4">
      {hasData ? (
        <>
          {/* Enhanced Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgb(75, 85, 99)' }}
                />
                <YAxis 
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgb(75, 85, 99)' }}
                  width={35}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} kg`, 'Weight']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgb(239, 246, 255)',
                    border: '1px solid rgb(147, 197, 253)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="rgb(37, 99, 235)" 
                  strokeWidth={2}
                  dot={{ fill: 'rgb(37, 99, 235)', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 4, stroke: 'rgb(37, 99, 235)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="bg-primary-50/60 rounded-lg p-3">
            <h4 className="text-sm font-medium text-primary-700 mb-2">Weight Log</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.slice().reverse().map((entry, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 bg-white/60 rounded text-sm">
                  <span className="text-primary-900">{formatDate(entry.date)}</span>
                  <span className="font-medium text-primary-700">{entry.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-primary-600 font-medium">Change:</span>
              <span className={`ml-2 ${weightChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </span>
            </div>
            {currentWeight && (
              <div className="text-primary-900">
                Current: <span className="font-medium">{currentWeight} kg</span>
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