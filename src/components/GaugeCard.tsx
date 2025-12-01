interface GaugeCardProps {
  title: string;
  value: number;
  max: number;
  unit?: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export default function GaugeCard({ title, value, max, unit = '', color }: GaugeCardProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: { stroke: '#3B82F6', text: 'text-blue-400' },
    green: { stroke: '#10B981', text: 'text-green-400' },
    yellow: { stroke: '#F59E0B', text: 'text-yellow-400' },
    red: { stroke: '#EF4444', text: 'text-red-400' },
  };

  return (
    <div className="bg-[#111217] border border-[#2a2c36] rounded p-5 hover:border-[#3a3c46] transition-colors">
      <h3 className="text-xs text-gray-400 mb-3 uppercase tracking-wider">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="relative w-28 h-28">
          <svg className="transform -rotate-90" width="112" height="112">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="#2a2c36"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke={colorClasses[color].stroke}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${colorClasses[color].text}`}>
              {value}
            </span>
            {unit && <span className="text-xs text-gray-400">{unit}</span>}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${colorClasses[color].text}`}>
            {percentage.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">od {max}</div>
        </div>
      </div>
    </div>
  );
}
