import { Phone, PhoneCall, PhoneMissed, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import GaugeCard from '../components/GaugeCard';

const hourlyData = [
  { hour: '08:00', inbound: 8, outbound: 4, internal: 0 },
  { hour: '09:00', inbound: 18, outbound: 5, internal: 1 },
  { hour: '10:00', inbound: 12, outbound: 5, internal: 1 },
  { hour: '11:00', inbound: 16, outbound: 5, internal: 1 },
  { hour: '12:00', inbound: 10, outbound: 4, internal: 1 },
  { hour: '13:00', inbound: 6, outbound: 3, internal: 1 },
  { hour: '14:00', inbound: 14, outbound: 5, internal: 1 },
  { hour: '15:00', inbound: 18, outbound: 7, internal: 1 },
  { hour: '16:00', inbound: 16, outbound: 6, internal: 2 },
  { hour: '17:00', inbound: 12, outbound: 4, internal: 1 },
];

const responseTimeData = [
  { time: '08:00', value: 8.5 },
  { time: '09:00', value: 9.2 },
  { time: '10:00', value: 7.8 },
  { time: '11:00', value: 8.1 },
  { time: '12:00', value: 7.5 },
  { time: '13:00', value: 6.8 },
  { time: '14:00', value: 8.3 },
  { time: '15:00', value: 9.1 },
  { time: '16:00', value: 8.7 },
  { time: '17:00', value: 7.9 },
];

const agentData = [
  { name: 'John', status: 'Na voljo', calls: 32, answered: 28, avgTalk: '2:45', totalTalk: '1h 17m', statusColor: 'green' },
  { name: 'Sarah', status: 'V klicu', calls: 28, answered: 26, avgTalk: '3:12', totalTalk: '1h 23m', statusColor: 'blue' },
  { name: 'Mike', status: 'Na voljo', calls: 25, answered: 22, avgTalk: '2:18', totalTalk: '51m', statusColor: 'green' },
  { name: 'Anna', status: 'Odmor', calls: 22, answered: 22, avgTalk: '2:05', totalTalk: '46m', statusColor: 'yellow' },
  { name: 'Peter', status: 'Na voljo', calls: 20, answered: 20, avgTalk: '2:52', totalTalk: '57m', statusColor: 'green' },
];

export default function Overview() {
  const today = new Date().toLocaleDateString('sl-SI', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Nadzorna plošča klicnega centra</h1>
        <p className="text-sm text-gray-400">{today}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Skupaj klicev" value="127" icon={<Phone size={24} />} color="blue" />
        <StatCard title="Odgovorjeni" value="98" icon={<PhoneCall size={24} />} color="green" />
        <StatCard title="Stopnja zamujenih" value="23%" icon={<PhoneMissed size={24} />} color="red" />
        <StatCard title="Povp. trajanje klica" value="2m 34s" icon={<Clock size={24} />} color="yellow" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <GaugeCard title="Stopnja odgovorjenih" value={98} max={127} color="green" />
        <GaugeCard title="Aktivni agenti" value={4} max={5} color="blue" />
        <div className="col-span-2 bg-[#111217] border border-[#2a2c36] rounded p-5">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Dohodni</div>
              <div className="text-3xl font-bold text-blue-400">85</div>
              <div className="text-xs text-gray-400 mt-1">67%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Odhodni</div>
              <div className="text-3xl font-bold text-green-400">35</div>
              <div className="text-xs text-gray-400 mt-1">28%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Interni</div>
              <div className="text-3xl font-bold text-yellow-400">7</div>
              <div className="text-xs text-gray-400 mt-1">5%</div>
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
              <Bar dataKey="inbound" stackId="a" fill="#3B82F6" name="Dohodni" radius={[0, 0, 0, 0]} />
              <Bar dataKey="outbound" stackId="a" fill="#10B981" name="Odhodni" radius={[0, 0, 0, 0]} />
              <Bar dataKey="internal" stackId="a" fill="#F59E0B" name="Interni" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111217] border border-[#2a2c36] rounded p-5">
          <h2 className="text-base font-medium text-white mb-4">Odzivni čas (sekunde)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={responseTimeData}>
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
          <h2 className="text-base font-medium text-white">Status agentov</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2c36]">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agent</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Klici</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odgovorjeni</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Povp. pogovor</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Skupaj čas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2c36]">
              {agentData.map((agent, index) => (
                <tr key={index} className="hover:bg-[#1a1c23] transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.statusColor === 'green' ? 'bg-green-500' : agent.statusColor === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm font-medium text-white">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{agent.status}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-white">{agent.calls}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-white">{agent.answered}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{agent.avgTalk}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{agent.totalTalk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
