import { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneMissed, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import GaugeCard from '../components/GaugeCard';
import {
  getOverviewStats,
  getCallsByHour,
  getResponseTimeTrend,
  getAgentStats,
  type OverviewStats,
  type HourlyData,
  type ResponseTimeData,
  type AgentStats
} from '../lib/api';

export default function Overview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [responseData, setResponseData] = useState<ResponseTimeData[]>([]);
  const [agentData, setAgentData] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2025-12-01');

  const getMinDate = () => {
    return '2025-11-01';  // Test data starts from Nov 2025
  };

  const getMaxDate = () => {
    return '2025-12-31';  // Test data ends Dec 2025
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('sl-SI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, hourly, response, agents] = await Promise.all([
          getOverviewStats(selectedDate),
          getCallsByHour(selectedDate),
          getResponseTimeTrend(selectedDate),
          getAgentStats(selectedDate),
        ]);
        setStats(statsData);
        setHourlyData(hourly);
        setResponseData(response);
        setAgentData(agents);
      } catch (error) {
        console.error('Napaka pri nalaganju podatkov:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-white text-lg">Nalaganje podatkov...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">Napaka pri nalaganju podatkov</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Nadzorna plošča klicnega centra</h1>
            <p className="text-sm text-gray-400">{formatDate(selectedDate)}</p>
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
        <StatCard title="Skupaj klicev" value={stats.skupajKlicev} icon={<Phone size={24} />} color="blue" />
        <StatCard title="Odgovorjeni" value={stats.odgovorjeni} icon={<PhoneCall size={24} />} color="green" />
        <StatCard title="Stopnja zamujenih" value={`${stats.stopnjaZamujenih}%`} icon={<PhoneMissed size={24} />} color="red" />
        <StatCard title="Povp. trajanje klica" value={stats.povpTrajanje} icon={<Clock size={24} />} color="yellow" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <GaugeCard title="Stopnja odgovorjenih" value={stats.odgovorjeni} max={stats.skupajKlicev} color="green" />
        <GaugeCard title="Aktivni agenti" value={stats.aktivniAgenti} max={5} color="blue" />
        <div className="col-span-2 bg-[#111217] border border-[#2a2c36] rounded p-5">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Dohodni</div>
              <div className="text-3xl font-bold text-blue-400">{stats.dohodni}</div>
              <div className="text-xs text-gray-400 mt-1">{stats.dohodniPercent}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Odhodni</div>
              <div className="text-3xl font-bold text-green-400">{stats.odhodni}</div>
              <div className="text-xs text-gray-400 mt-1">{stats.odhodniPercent}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Interni</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.interni}</div>
              <div className="text-xs text-gray-400 mt-1">{stats.interniPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Klici po tipih</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData} barCategoryGap="5%">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2c36" vertical={false} />
              <XAxis dataKey="hour" stroke="#6b7280" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
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
              <Bar dataKey="dohodni" stackId="a" fill="#3B82F6" name="Dohodni" radius={[0, 0, 0, 0]} />
              <Bar dataKey="odhodni" stackId="a" fill="#10B981" name="Odhodni" radius={[0, 0, 0, 0]} />
              <Bar dataKey="interni" stackId="a" fill="#F59E0B" name="Interni" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Odzivni čas (sekunde)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={responseData}>
              <defs>
                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2c36" vertical={false} />
              <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
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
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorResponse)"
                name="Odzivni čas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#111217] border border-[#2a2c36] rounded">
        <div className="p-5 border-b border-[#2a2c36]">
          <h2 className="text-base font-medium text-white">Agenti</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2c36]">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agent</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Klici</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odgovorjeni</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Povp. pogovor</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Skupaj čas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2c36]">
              {agentData.map((agent, index) => (
                <tr key={index} className="hover:bg-[#1a1c23] transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{agent.agent}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-white">{agent.klici}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-white">{agent.odgovorjeni}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{agent.povpPogovor}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{agent.skupajCas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
