import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, History, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: '/', label: 'Pregled', icon: LayoutDashboard },
  { path: '/agents', label: 'Učinkovitost agentov', icon: Users },
  { path: '/history', label: 'Zgodovina klicev', icon: History },
  { path: '/analytics', label: 'Analitika', icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0b0c0e]">
      <aside className="w-56 bg-[#111217] border-r border-[#2a2c36] text-white flex flex-col">
        <div className="p-4 border-b border-[#2a2c36]">
          <h1 className="text-lg font-semibold text-white">Klicni center</h1>
          <p className="text-xs text-gray-400 mt-1">Nadzorna plošča</p>
        </div>
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                      isActive
                        ? 'bg-[#1f60c4] text-white'
                        : 'text-gray-400 hover:bg-[#1a1c23] hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-[#0b0c0e]">
        {children}
      </main>
    </div>
  );
}
