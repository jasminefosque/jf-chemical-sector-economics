import type { PageView } from '../../App';

interface NavItem {
  id: PageView;
  label: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'upstream', label: 'Upstream Inputs' },
  { id: 'cost', label: 'Cost Structure' },
  { id: 'capacity', label: 'Capacity & Production' },
  { id: 'demand', label: 'Downstream Demand' },
  { id: 'trade', label: 'Trade Exposure' },
  { id: 'regulatory', label: 'Regulatory Pressure' },
  { id: 'methodology', label: 'Methodology' },
];

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <nav className="py-6">
        <div className="px-4 mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h2>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-6 py-3 text-sm transition-colors ${
                  currentPage === item.id
                    ? 'bg-industrial-100 text-industrial-800 border-l-4 border-industrial-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
