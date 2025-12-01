interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export default function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="bg-[#111217] border border-[#2a2c36] rounded p-5 hover:border-[#3a3c46] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
        {icon && (
          <div className={`p-2.5 rounded ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
