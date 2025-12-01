import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

const weeklyTrendData = [
  { week: 'Teden 1', total: 420, answered: 368, missed: 52 },
  { week: 'Teden 2', total: 450, answered: 405, missed: 45 },
  { week: 'Teden 3', total: 480, answered: 432, missed: 48 },
  { week: 'Teden 4', total: 510, answered: 469, missed: 41 },
  { week: 'Teden 5', total: 490, answered: 451, missed: 39 },
];

const topPerformers = [
  { name: 'Sarah', calls: 142, answered: 138, rate: 97.2, trend: 'up' },
  { name: 'John', calls: 135, answered: 128, rate: 94.8, trend: 'up' },
  { name: 'Mike', calls: 128, answered: 118, rate: 92.2, trend: 'down' },
  { name: 'Peter', calls: 125, answered: 115, rate: 92.0, trend: 'up' },
  { name: 'Anna', calls: 120, answered: 109, rate: 90.8, trend: 'down' },
];

const peakHours = [
  { hour: '9-10 AM', calls: 145, percentage: 12.8 },
  { hour: '10-11 AM', calls: 132, percentage: 11.6 },
  { hour: '3-4 PM', calls: 128, percentage: 11.3 },
  { hour: '2-3 PM', calls: 118, percentage: 10.4 },
  { hour: '11-12 PM', calls: 112, percentage: 9.9 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Zadnjih 5 tednov');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Analitika</h1>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Zadnjih 5 tednov</option>
              <option>Zadnjih 10 tednov</option>
              <option>Zadnji 3 meseci</option>
              <option>Zadnjih 6 mesecev</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="bg-[#111217] border border-[#2a2c36] rounded p-5 mb-6">
        <h2 className="text-base font-medium text-white mb-6">Tedenski trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={weeklyTrendData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorAnswered2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorMissed2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2c36" vertical={false} />
            <XAxis dataKey="week" stroke="#6b7280" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1c23',
                border: '1px solid #2a2c36',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorTotal)"
              name="Skupaj klicev"
            />
            <Area
              type="monotone"
              dataKey="answered"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorAnswered2)"
              name="Odgovorjeni"
            />
            <Area
              type="monotone"
              dataKey="missed"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#colorMissed2)"
              name="Zamujeni"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Najboljši agenti</h2>
          <div className="space-y-3">
            {topPerformers.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a1c23] border border-[#2a2c36] rounded hover:border-[#3a3c46] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{agent.name}</p>
                    <p className="text-xs text-gray-400">{agent.calls} klicev • {agent.answered} odgovorjenih</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white">{agent.rate}%</span>
                  {agent.trend === 'up' ? (
                    <TrendingUp className="text-green-400" size={18} />
                  ) : (
                    <TrendingDown className="text-red-400" size={18} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Vrhunske ure</h2>
          <div className="space-y-3">
            {peakHours.map((hour, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{hour.hour}</span>
                  <span className="text-xs text-gray-400">{hour.calls} klicev ({hour.percentage}%)</span>
                </div>
                <div className="w-full bg-[#2a2c36] rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${hour.percentage * 7.8}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Povprečni odzivni čas</h3>
          <p className="text-2xl font-semibold text-white mb-2">8.2s</p>
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <TrendingDown size={14} />
            <span>2.3s hitreje</span>
          </div>
        </div>

        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Zadovoljstvo strank</h3>
          <p className="text-2xl font-semibold text-white mb-2">4.7/5.0</p>
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <TrendingUp size={14} />
            <span>0.2 povečanje</span>
          </div>
        </div>

        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Rešitev ob prvem klicu</h3>
          <p className="text-2xl font-semibold text-white mb-2">82%</p>
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <TrendingUp size={14} />
            <span>5% povečanje</span>
          </div>
        </div>
      </div>
    </div>
  );
}
