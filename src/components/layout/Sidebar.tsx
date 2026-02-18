import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prices', label: 'Price Indices' },
  { id: 'production', label: 'Production & Capacity' },
  { id: 'energy', label: 'Energy Economics' },
  { id: 'trade', label: 'Trade Flows' },
  { id: 'shocks', label: 'Shock Events' },
];

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('overview');

  return (
    <aside className="w-64 bg-slate-100 border-r border-slate-300 shadow-sm">
      <nav className="py-6">
        <div className="px-4 mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Navigation
          </h2>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full text-left px-6 py-3 text-sm transition-colors ${
                  activeItem === item.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-slate-700 hover:bg-slate-200 border-l-4 border-transparent'
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
