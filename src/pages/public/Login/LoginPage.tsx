import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Eye, EyeOff, Lock, Mail, ArrowRight, Shield, Loader2, User } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import '../../../App.css';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('gams-admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 900));

    if (username === 'gams-admin' && password === 'admin123') {
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use gams-admin / admin123');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[url('/images/OneAyala.jpeg')] bg-cover bg-fixed bg-center bg-no-repeat p-10">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/80" />

      {/* Bottom Left Logo and Text */}
      <div className="absolute bottom-0 left-0 z-50 flex [animation:fade-in_0.5s_ease-in-out_0.1s_forwards] items-center opacity-0">
        <img
          src="/images/GalliusLogo.png"
          alt="Gallius Logo"
          className="z-50 w-[clamp(20px,10vw,30px)]"
        />

        <h1 className="overflow-hidden font-[Poppins] text-[10px] font-bold whitespace-nowrap text-slate-900 dark:text-white">
          Gallius Shared Services, OPC
        </h1>
      </div>

      <div className="">s</div>

      {/* Customized clip-path design */}
      <div className="absolute h-full w-full bg-gray-100/80 [clip-path:none] 2xl:[clip-path:polygon(0_0,45%_0,50%_100%,0_100%)] dark:bg-gray-300/10" />

      {/* Top Right Actions */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="cursor-pointer rounded-xl border border-slate-200/50 bg-white/80 p-2.5 text-slate-700 shadow-md transition-all hover:bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="animate-fade-in flex w-full flex-col flex-wrap items-center justify-between gap-10 lg:flex-row">
        {/* Left Side */}
        <div className="align-center relative flex flex-1 flex-col justify-center space-y-[clamp(8px,3vw,30px)] lg:max-w-2xl">
          {/* Logo and Title with animation */}
          <div className="flex min-w-lg items-center justify-center gap-2 overflow-hidden transition-all duration-500 ease-in-out max-sm:flex-col">
            <img
              src="/images/GIMS_Logo.png"
              alt="Gallius Logo"
              className="enlarge-animation hover:shadow-inner-10 z-50 w-30 transition-all duration-500 ease-in-out hover:scale-110 hover:cursor-pointer max-sm:mb-4"
            />

            <div className="unfolding-animation flex flex-col">
              <div className="unfolding-animation">
                {/* <h1 className="max-sm:text-md w-fit [animation:reveal-text_1s_ease-in-out_1.2s_forwards] overflow-hidden pr-2 text-center font-[Montserrat] text-[clamp(2rem,2.5vw,2.5rem)] font-[var(--font-heading)] font-extrabold tracking-tight whitespace-nowrap text-slate-600 opacity-0 max-sm:w-full dark:text-white">
                  Gallius Inventory
                </h1> */}
                <h1 className="max-sm:text-md w-fit [animation:reveal-text_1s_ease-in-out_1.2s_forwards] overflow-hidden pr-2 text-center font-[Montserrat] text-[clamp(2rem,2.5vw,2.5rem)] font-[var(--font-heading)] font-extrabold tracking-tight whitespace-nowrap text-slate-600 opacity-0 max-sm:w-full dark:text-white">
                  Gallius Inventory
                </h1>
              </div>
              <div className="unfolding-animation">
                <h1 className="max-sm:text-md w-fit [animation:reveal-text_1s_ease-in-out_1.5s_forwards] overflow-hidden pr-2 text-center font-[Montserrat] text-[clamp(2rem,2.5vw,2.5rem)] font-[var(--font-heading)] font-extrabold tracking-tight whitespace-nowrap text-slate-600 opacity-0 max-sm:w-full dark:text-white">
                  Management System
                  <div className="blinking-animation absolute right-0 h-full w-0.5 bg-slate-900" />
                </h1>
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div>
            <h1 className="animate-fade-in font-[Poppins] text-[clamp(1.5rem,2.5vw,2.5rem)] font-bold tracking-tight">
              Empowering your Digital Future
            </h1>
          </div>

          {/* Description */}
          <div>
            <h1 className="fade-in-animation font-[Poppins] text-2xl text-[clamp(15px,2vw,20px)]">
              Welcome to the Inventory Management System, sign in to manage products, monitor stock
              levels, and keep your inventory organized.
            </h1>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center max-2xl:flex-1 max-lg:flex-1">
          <div className="animate-fade-in w-full max-w-md min-w-sm">
            <div className="glass dark:glass rounded-3xl border border-white/20 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60">
              {/* Header */}
              <div className="mb-8 text-center">
                {/* <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500 dark:shadow-indigo-500/20">
                <Server className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Asset Inventory System
              </h1> */}
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Inventory Portal of Gallius OPC
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-200/50 bg-red-50/80 p-3.5 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  <p className="text-xs font-medium text-red-500">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                    Username
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/60 py-3 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/60 py-3 pr-10 pl-10 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="hover:from-magenta-300 hover:bg-magenta-300 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gradient-to-r hover:to-slate-700 hover:text-white hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-violet-500 dark:shadow-violet-500/15 dark:hover:bg-violet-400"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Development Tips */}
              <div className="mt-6 border-t border-slate-200/50 pt-5 text-center dark:border-slate-800/50">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Dev login credentials:{' '}
                  <code className="font-semibold text-slate-600 dark:text-slate-400">
                    gams-admin
                  </code>{' '}
                  /{' '}
                  <code className="font-semibold text-slate-600 dark:text-slate-400">admin123</code>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
