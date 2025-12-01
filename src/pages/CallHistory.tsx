import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const callHistory = [
  { time: '10:45', from: '+1 (555) 123-4567', to: '+1 (555) 987-6543', agent: 'John', type: 'Dohodni', duration: '3m 24s', status: 'ODGOVORJEN' },
  { time: '10:42', from: '+1 (555) 234-5678', to: '+1 (555) 876-5432', agent: 'Sarah', type: 'Odhodni', duration: '1m 52s', status: 'ODGOVORJEN' },
  { time: '10:38', from: '+1 (555) 345-6789', to: '+1 (555) 765-4321', agent: 'Mike', type: 'Dohodni', duration: '0m 0s', status: 'ZAMUJEN' },
  { time: '10:35', from: '+1 (555) 456-7890', to: '+1 (555) 654-3210', agent: 'Anna', type: 'Dohodni', duration: '5m 18s', status: 'ODGOVORJEN' },
  { time: '10:30', from: '+1 (555) 567-8901', to: '+1 (555) 543-2109', agent: 'Peter', type: 'Interni', duration: '2m 05s', status: 'ODGOVORJEN' },
  { time: '10:28', from: '+1 (555) 678-9012', to: '+1 (555) 432-1098', agent: 'John', type: 'Dohodni', duration: '0m 0s', status: 'NI ODGOVORA' },
  { time: '10:25', from: '+1 (555) 789-0123', to: '+1 (555) 321-0987', agent: 'Sarah', type: 'Odhodni', duration: '4m 42s', status: 'ODGOVORJEN' },
  { time: '10:20', from: '+1 (555) 890-1234', to: '+1 (555) 210-9876', agent: 'Mike', type: 'Dohodni', duration: '2m 33s', status: 'ODGOVORJEN' },
  { time: '10:15', from: '+1 (555) 901-2345', to: '+1 (555) 109-8765', agent: 'Anna', type: 'Dohodni', duration: '6m 12s', status: 'ODGOVORJEN' },
  { time: '10:10', from: '+1 (555) 012-3456', to: '+1 (555) 098-7654', agent: 'Peter', type: 'Odhodni', duration: '1m 28s', status: 'ODGOVORJEN' },
];

export default function CallHistory() {
  const [dateFilter, setDateFilter] = useState('Danes');
  const [agentFilter, setAgentFilter] = useState('Vsi agenti');
  const [typeFilter, setTypeFilter] = useState('Vsi tipi');
  const [statusFilter, setStatusFilter] = useState('Vsi statusi');

  const getStatusBadge = (status: string) => {
    const styles = {
      ODGOVORJEN: 'bg-green-500/20 text-green-400 border border-green-500/30',
      ZAMUJEN: 'bg-red-500/20 text-red-400 border border-red-500/30',
      'NI ODGOVORA': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Zgodovina klicev</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 transition-colors">
            <Download size={14} />
            Izvozi
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Danes</option>
              <option>Včeraj</option>
              <option>Zadnjih 7 dni</option>
              <option>Zadnjih 30 dni</option>
              <option>Obdobje po meri</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Vsi tipi</option>
              <option>Dohodni</option>
              <option>Odhodni</option>
              <option>Interni</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Vsi statusi</option>
              <option>Odgovorjeni</option>
              <option>Zamujeni</option>
              <option>Ni odgovora</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="bg-[#111217] border border-[#2a2c36] rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2c36]">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Čas</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Od</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Za</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agent</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tip</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trajanje</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2c36]">
              {callHistory.map((call, index) => (
                <tr key={index} className="hover:bg-[#1a1c23] transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-white">{call.time}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{call.from}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{call.to}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{call.agent}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{call.type}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{call.duration}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#2a2c36] flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Prikazujem 1 do 10 od 127 klicev
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-[#2a2c36] text-gray-400 rounded hover:bg-[#1a1c23] disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</button>
            <button className="px-3 py-1 border border-[#2a2c36] text-gray-400 text-sm rounded hover:bg-[#1a1c23]">2</button>
            <button className="px-3 py-1 border border-[#2a2c36] text-gray-400 text-sm rounded hover:bg-[#1a1c23]">3</button>
            <button className="px-2 py-1 border border-[#2a2c36] text-gray-400 rounded hover:bg-[#1a1c23]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
