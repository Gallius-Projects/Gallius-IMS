import { useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, LogOut, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/assets': 'Assets',
  '/transactions': 'Transactions',
};

interface TopbarProps {
  onLogout: () => void;
}

export function Topbar({ onLogout }: TopbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const [hovered, setHovered] = useState(false);
  const [reveal, setReveal] = useState(true);
  const [stay, setStay] = useState(false);

  const pageLabel =
    Object.entries(ROUTE_LABELS).find(([path]) => location.pathname.startsWith(path))?.[1] ??
    'AssetFlow';

  return (
    <header className="topbar flex h-16 flex-shrink-0 items-center gap-4 px-6">
      <div className="flex w-8 items-center justify-center shadow-md">
        {/* <Box size={16} className="text-white" /> */}
        <img src="/images/GIMS_Logo.png" alt="Gallius Logo" />
      </div>

      {/* Page title */}
      <div className="flex-1">
        <div
          className={`flex w-30 cursor-pointer items-center justify-start gap-1 overflow-hidden transition-all ease-in-out ${reveal ? 'w-102 pr-2 duration-500' : 'w-30'} ${hovered ? 'duration-10' : ''}`}
          onMouseEnter={() => {
            setReveal(true);
            setHovered(true);
            setStay(true);
          }}
          onMouseLeave={() => {
            if (!stay && reveal) {
              setReveal(false);
            }
            setHovered(false);
          }}
          onClick={() => {
            if (reveal) {
              setReveal(false);
            }
            setStay(!stay);
          }}
        >
          <span
            className="relative font-[Montserrat] text-base font-semibold tracking-tight whitespace-nowrap text-slate-900 select-none dark:text-white"
            style={{ color: 'var(--text-primary)' }}
          >
            {reveal ? 'Gallius Asset Management System' : 'G-AMS'}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {pageLabel}
        </p>
      </div>

      {/* Search bar */}
      <div
        className="hidden w-56 items-center gap-2 rounded-lg px-3 py-2 md:flex"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
        }}
      >
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Quick search..."
          className="w-full bg-transparent text-xs outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-all duration-200"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-light)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-light)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          A
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          title="Sign out"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
