import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUserContext();
  const router = useRouter();

  const [hovered, setHovered] = useState(false);
  const [reveal, setReveal] = useState(true);
  const [stay, setStay] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <img
            src="/images/GIMS_Logo.png"
            alt="Gallius Logo"
            className="w-10"
          />
          <span className="relative font-[Montserrat] text-lg font-extrabold tracking-tight whitespace-nowrap text-slate-900 select-none dark:text-white">
            {reveal ? 'Gallius Inventory Management System' : 'GIMS'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden rounded-lg border border-slate-200/50 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 md:inline dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-300">
            User:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {user?.username}
            </span>
          </span>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-lg border border-slate-200/30 p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4.5 w-4.5" />
            ) : (
              <Sun className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
