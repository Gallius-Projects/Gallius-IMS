import { Outlet } from 'react-router-dom';
import { Topbar } from '../components/Topbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface AppLayoutProps {
  onLogout: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}

      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className={`fixed top-1/2 left-0 z-50 flex h-10 ${isSidebarExpanded ? 'w-0' : 'w-7'} -translate-x-1/3 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:w-9 hover:translate-x-0 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-purple-950/30 dark:hover:text-purple-400`}
      >
        <ChevronRight size={18} className="transition-transform duration-300" />
      </button>
      <Sidebar sidebarRef={sidebarRef} isSidebarExpanded={isSidebarExpanded} />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar onLogout={onLogout} />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="animate-fade-in mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
