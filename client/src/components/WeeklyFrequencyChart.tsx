import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface WeeklyFrequencyChartProps {
  data: Array<{ day: string; count: number }>;
}

export default function WeeklyFrequencyChart({ data }: WeeklyFrequencyChartProps) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            className="text-xs fill-primary-600"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            className="text-xs fill-primary-600"
          />
          <Bar 
            dataKey="count" 
            fill="rgb(37, 99, 235)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}