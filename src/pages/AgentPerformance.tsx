import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { ChevronDown } from 'lucide-react';
import {
  getPerformanceStats,
  getDailyVolume,
  getEfficiencyMetrics,
  getDailyBreakdown,
  getAgentList,
  type PerformanceStats,
  type DailyVolumeData,
  type EfficiencyMetrics,
  type DailyBreakdown
} from '../lib/api';

export default function AgentPerformance() {
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2025-12-01');
  const [agents, setAgents] = useState<string[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [volumeData, setVolumeData] = useState<DailyVolumeData[]>([]);
  const [metrics, setMetrics] = useState<EfficiencyMetrics | null>(null);
  const [breakdown, setBreakdown] = useState<DailyBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const getMinDate = () => {
    return '2025-11-01';
  };

  const getMaxDate = () => {
    return '2025-12-31';
  };

  useEffect(() => {
    async function loadAgents() {
      try {
        const agentList = await getAgentList();
        setAgents(agentList);
      } catch (error) {
        console.error('Napaka pri nalaganju agentov:', error);
      }
    }
    loadAgents();
  }, []);

  useEffect(() => {
    async function loadData() {
      console.log('Loading data for date:', selectedDate, 'agent:', selectedAgent);
      setLoading(true);
      try {
        const [statsData, volume, metricsData, breakdownData] = await Promise.all([
          getPerformanceStats(selectedDate, selectedAgent),
          getDailyVolume(selectedDate, selectedAgent),
          getEfficiencyMetrics(selectedDate, selectedAgent),
          getDailyBreakdown(selectedDate, selectedAgent),
        ]);
        setStats(statsData);
        setVolumeData(volume);
        setMetrics(metricsData);
        setBreakdown(breakdownData);
      } catch (error) {
        console.error('Napaka pri nalaganju podatkov:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedAgent, selectedDate]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-white text-lg">Nalaganje podatkov...</div>
      </div>
    );
  }

  if (!stats || !metrics) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">Napaka pri nalaganju podatkov</div>
      </div>
    );
  }

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
              <option value="all">Vsi agenti</option>
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div>
            <input
              type="date"
              value={selectedDate}
              min={getMinDate()}
              max={getMaxDate()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Skupaj klicev" value={stats.skupajKlicev} color="blue" />
        <StatCard title="Stopnja odzivnosti" value={`${stats.stopnjaOdzivnosti}%`} color="green" />
        <StatCard title="Povp. trajanje klica" value={stats.povpTrajanje} color="yellow" />
        <StatCard title="Skupaj čas klicev" value={stats.skupajCas} color="blue" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Dnevni obseg klicev</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={volumeData}>
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
            <div className="flex justify-between items-center py-2.5 border-b border-[#2a2c36]">
              <span className="text-sm text-gray-400">Povp. čas zvonjenja</span>
              <span className="text-base font-semibold text-white">{metrics.povpCasZvonjenja}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[#2a2c36]">
              <span className="text-sm text-gray-400">Najdaljši klic</span>
              <span className="text-base font-semibold text-white">{metrics.najdaljsiKlic}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[#2a2c36]">
              <span className="text-sm text-gray-400">Najkrajši klic</span>
              <span className="text-base font-semibold text-white">{metrics.najkrajsiKlic}</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-sm text-gray-400">Zamujeni klici</span>
              <span className="text-base font-semibold text-white">{metrics.zamujeniKlici}</span>
            </div>
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
              {breakdown.map((day, index) => (
                <tr key={index} className="hover:bg-[#1a1c23] transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{day.dan}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{day.dohodni}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{day.odhodni}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{day.skupaj}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-green-400">{day.odgovorjeni}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-red-400">{day.zamujeni}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`text-sm font-medium ${day.stopnja >= 90 ? 'text-green-400' : day.stopnja >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {day.stopnja}%
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
