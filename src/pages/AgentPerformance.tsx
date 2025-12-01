import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { ChevronDown } from 'lucide-react';

const dailyData = [
  { day: 'Mon', inbound: 42, outbound: 18, total: 60, answered: 52, missed: 8, rate: 87 },
  { day: 'Tue', inbound: 38, outbound: 22, total: 60, answered: 54, missed: 6, rate: 90 },
  { day: 'Wed', inbound: 45, outbound: 15, total: 60, answered: 51, missed: 9, rate: 85 },
  { day: 'Thu', inbound: 40, outbound: 20, total: 60, answered: 55, missed: 5, rate: 92 },
  { day: 'Fri', inbound: 35, outbound: 25, total: 60, answered: 50, missed: 10, rate: 83 },
  { day: 'Sat', inbound: 28, outbound: 12, total: 40, answered: 36, missed: 4, rate: 90 },
];

const weeklyChartData = [
  { day: 'Pon', answered: 52, missed: 8 },
  { day: 'Tor', answered: 54, missed: 6 },
  { day: 'Sre', answered: 51, missed: 9 },
  { day: 'Čet', answered: 55, missed: 5 },
  { day: 'Pet', answered: 50, missed: 10 },
  { day: 'Sob', answered: 36, missed: 4 },
];

const performanceMetrics = [
  { label: 'Povp. čas zvonjenja', value: '8.2s' },
  { label: 'Najdaljši klic', value: '12m 45s' },
  { label: 'Najkrajši klic', value: '0m 23s' },
  { label: 'Zamujeni klici', value: '42' },
  { label: 'Povratni klici', value: '15' },
];

export default function AgentPerformance() {
  const [selectedAgent, setSelectedAgent] = useState('Vsi agenti');
  const [selectedDept, setSelectedDept] = useState('Vsi oddelki');
  const [dateRange, setDateRange] = useState('Zadnjih 7 dni');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-6">Učinkovitost agentov</h1>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Vsi agenti</option>
              <option>John</option>
              <option>Sarah</option>
              <option>Mike</option>
              <option>Anna</option>
              <option>Peter</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Vsi oddelki</option>
              <option>Prodaja</option>
              <option>Podpora</option>
              <option>Tehnična</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Zadnjih 7 dni</option>
              <option>Zadnjih 30 dni</option>
              <option>Ta mesec</option>
              <option>Pretekli mesec</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Skupaj klicev" value="340" color="blue" />
        <StatCard title="Stopnja odzivnosti" value="88%" color="green" />
        <StatCard title="Povp. trajanje klica" value="2m 48s" color="yellow" />
        <StatCard title="Skupaj čas klicev" value="15h 52m" color="blue" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Dnevni obseg klicev</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyChartData}>
              <defs>
                <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorMissed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2c36" vertical={false} />
              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
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
              <Area
                type="monotone"
                dataKey="answered"
                stackId="1"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorAnswered)"
                name="Odgovorjeni"
              />
              <Area
                type="monotone"
                dataKey="missed"
                stackId="1"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#colorMissed)"
                name="Zamujeni"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Metrike učinkovitosti</h2>
          <div className="space-y-3">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center py-2.5 border-b border-[#2a2c36] last:border-0">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <span className="text-base font-semibold text-white">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111217] border border-[#2a2c36] rounded">
        <div className="p-5 border-b border-[#2a2c36]">
          <h2 className="text-base font-medium text-white">Dnevna razčlenitev</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2c36]">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dan</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dohodni</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odhodni</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Skupaj</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odgovorjeni</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Zamujeni</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stopnja %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2c36]">
              {dailyData.map((day, index) => (
                <tr key={index} className="hover:bg-[#1a1c23] transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{day.day}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{day.inbound}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{day.outbound}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{day.total}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-green-400">{day.answered}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-red-400">{day.missed}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`text-sm font-medium ${day.rate >= 90 ? 'text-green-400' : day.rate >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {day.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
