import { useState, useEffect } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { getCallHistory, getAgentList, type CallHistoryResult } from '../lib/api';

export default function CallHistory() {
  const [agents, setAgents] = useState<string[]>([]);
  const [data, setData] = useState<CallHistoryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: '2025-12-01',
    agent: 'all',
    type: 'all',
    status: 'all',
    page: 1,
  });

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
      console.log('Loading data for date:', filters.date);
      setLoading(true);
      try {
        const result = await getCallHistory(filters);
        setData(result);
      } catch (error) {
        console.error('Napaka pri nalaganju podatkov:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters]);

  const updateFilter = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const getStatusColor = (status: string) => {
    if (status === 'ODGOVORJEN') return 'text-green-400';
    if (status === 'NI ODGOVORA') return 'text-red-400';
    if (status === 'ZASEDEN') return 'text-yellow-400';
    return 'text-gray-400';
  };

  if (loading && !data) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-white text-lg">Nalaganje podatkov...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Zgodovina klicev</h1>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
            <Download size={16} />
            Izvozi CSV
          </button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <input
              type="date"
              value={filters.date}
              min={getMinDate()}
              max={getMaxDate()}
              onChange={(e) => updateFilter('date', e.target.value)}
              className="bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={filters.agent}
              onChange={(e) => updateFilter('agent', e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Vsi agenti</option>
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Vsi tipi</option>
              <option value="Dohodni">Dohodni</option>
              <option value="Odhodni">Odhodni</option>
              <option value="Interni">Interni</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="appearance-none bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Vsi statusi</option>
              <option value="ODGOVORJEN">Odgovorjen</option>
              <option value="NI ODGOVORA">Ni odgovora</option>
              <option value="ZAMUJEN">Zamujen</option>
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
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stranka</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agent</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tip</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trajanje</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2c36]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    Nalaganje...
                  </td>
                </tr>
              ) : data?.records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    Ni podatkov za prikaz
                  </td>
                </tr>
              ) : (
                data?.records.map((record, index) => (
                  <tr key={index} className="hover:bg-[#1a1c23] transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-white">{record.cas}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{record.od}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{record.za}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">{record.agent}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{record.tip}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-400">{record.trajanje}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm">
                      <span className={getStatusColor(record.status)}>{record.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="px-5 py-4 border-t border-[#2a2c36] flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Prikazujem {((filters.page - 1) * 10) + 1} do {Math.min(filters.page * 10, data.total)} od {data.total} klicev
            </div>
            <div className="flex gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => updateFilter('page', filters.page - 1)}
                className="px-3 py-1 bg-[#1a1c23] border border-[#2a2c36] text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2c36] transition-colors"
              >
                Prejšnja
              </button>
              <span className="px-3 py-1 text-sm text-gray-400">
                Stran {filters.page} od {data.totalPages}
              </span>
              <button
                disabled={filters.page >= data.totalPages}
                onClick={() => updateFilter('page', filters.page + 1)}
                className="px-3 py-1 bg-[#1a1c23] border border-[#2a2c36] text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2c36] transition-colors"
              >
                Naslednja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
