'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import Sidebar from '../components/ui/sidebar';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import axiosInstance from '@/lib/axiosInstance';
import { useLibrariesContext } from '@/context/LibrariesContext';

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  type Role = 'superadmin' | 'admin' | 'user';

  const router = useRouter();
  const { user, setUser, setIsAuthenticated } = useUserContext();

  const {
    setCategories,
    setBrands,
    setLocations,
    setSuppliers,
    setOffices,
    setEmployees,
  } = useLibrariesContext();

  const userRole = user?.role as Role;
  const sideBarRef = useRef<HTMLDivElement>(null);

  // Sidebar state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_info');

    if (!token || !savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    };

    const fetchBrands = async () => {
      const response = await axiosInstance.get('/brands');
      setBrands(response.data);
    };

    const fetchLocations = async () => {
      const response = await axiosInstance.get('/locations');
      setLocations(response.data);
    };

    const fetchSuppliers = async () => {
      const response = await axiosInstance.get('/suppliers');
      setSuppliers(response.data);
    };

    const fetchOffices = async () => {
      const response = await axiosInstance.get('/offices');
      setOffices(response.data);
    };

    const fetchEmployees = async () => {
      const response = await axiosInstance.get('/employees');
      setEmployees(response.data);
    };

    fetchCategories();
    fetchBrands();
    fetchLocations();
    fetchSuppliers();
    fetchOffices();
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar
        sideBarRef={sideBarRef}
        isSidebarExpanded={isSidebarExpanded}
        userRole={userRole}
      />
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className={`fixed top-1/2 left-0 z-50 flex h-10 ${isSidebarExpanded ? 'w-0' : 'w-7'} -translate-x-1/3 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:w-9 hover:translate-x-0 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-purple-950/30 dark:hover:text-purple-400`}
      >
        <ChevronRight size={18} className="transition-transform duration-300" />
      </button>

      {/* Header */}
      <Header />
      {/* space-y-8 */}
      <main className="animate-fade-in max-h-screen min-h-screen min-w-0 flex-1 overflow-y-hidden">
        {children}
      </main>

      <Footer />
    </div>
  );
}
